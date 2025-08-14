#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "../app.js";

import debugModule from "debug";
const debug = new debugModule("go.resonite.com:server");

import http from "http";

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 *
 * @param {string|number} val The possible port number to normalize.
 * @returns The normalized port number, or false or itself if the value cannot be parsed.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 *
 * @param {NodeJS.ErrnoException} error The error that was thrown.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind;
  if (typeof addr === "string") {
    bind = "pipe " + addr;
  } else {
    bind = "port " + addr.port;
    // Makes it super easy to ctrl + click the url, probably should turn off in prod
    console.log("http://127.0.1:" + addr.port);
  }
  debug("Listening on " + bind);
}
