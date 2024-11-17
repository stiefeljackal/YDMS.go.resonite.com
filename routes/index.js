import express from 'express';

import pkg from 'http-errors';
const {createError} = pkg;

import { preProcess } from '../helpers/preprocessing.js';

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/session/:sessionId', (req,res, next) => handle("session", req, res, next));
router.get('/session/:sessionId/json', (req,res, next) => handleJson("session", req, res, next));

// Register world/ and record/
for (const word of ["world", "record"]) {
  router.get(`/${word}/:ownerId/:recordId`, (req,res, next) => handle("world", req, res, next));
  router.get(`/${word}/:ownerId/:recordId/json`, (req,res, next) => handleJson("world", req, res, next));
}

var baseUrl = "https://api.resonite.com";

function getUrl(type, req) {
  switch (type) {
    case "world":
      return `${baseUrl}/users/${req.params.ownerId}/records/${req.params.recordId}/`;
    case "session":
      return `${baseUrl}/sessions/` + req.params.sessionId;
    default:
      throw new Error(`Unknown url type: ${type}`);
  }
}

async function createResoniteApiError(res, type) {
  if (res.status === 404) {
    return createError(res.status, `We couldn't find this ${type}.\n
    Check your link is valid, and that the session is still open and publicly viewable.`);
  }

  var text = await res.text();
  return createError(res.status, `Resonite API returned an error: ${text}`);
}

async function handle(type, req, res, next) {
  var apiResponse = await fetch(getUrl(type, req));
  if (!apiResponse.ok) {
    var error = await createResoniteApiError(apiResponse, type);
    return next(error);
  }

  var json = await apiResponse.json();

  if (type ==="world" && json.recordType !== "world") {
    return next(createError(400, "go.resonite.com only works for Session and world link."));
  }

  json = preProcess(json, type);
  json.urlPath = req.getUrl();

  res.status(200).render(type, json);
}

async function handleJson(type, req, res, next) {
  var apiResponse = await fetch(getUrl(type, req));
  if (!apiResponse.ok) {
    res.status(apiResponse.status);
    return next();
  }

  var json = await apiResponse.json();

  if (type ==="world" && json.recordType !== "world") {
    res.status(400);
    return next();
  }

  json = preProcess(json, type);
  // title is the TOP link
  var title = getOpenGraphTitle(type);
  res.json({
    title: title,
    author_name: title,
    author_url: req.getUrl().replace("/json",""),
    provider_name: "Resonite",
    provider_url: "https://resonite.com"
  });
}

function getOpenGraphTitle(type) {
  var app = "Resonite";
  switch(type) {
    case "session":
      return `${app} Session`;
    case "world":
      return `${app} World`;
    default:
      return `${app} World`;
  }
}

export default router;
