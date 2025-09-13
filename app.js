import express from "express";
import path from "path";
import logger from "morgan";
import createError from "http-errors";

import indexRouter from "./routes/index.js";

// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  req.getUrl = function () {
    return req.protocol + "://" + req.get("host") + req.originalUrl;
  };
  return next();
});

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, _next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;
  if (req.app.get("env") !== "development") {
    res.locals.error.stack = null;
  }

  // render the error page
  res.status(err.status || 500);

  switch (err.contentType) {
    case "json":
      return res.send(err.message);
    default:
      return res.render("error");
  }
});

export default app;
