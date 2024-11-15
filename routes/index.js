var express = require('express');
var createError = require('http-errors');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/record/:ownerId/:recordId', (req,res, next) => handle("world", req, res, next));
router.get('/session/:sessionId', (req,res, next) => handle("session", req, res, next));

router.get('/record/:ownerId/:recordId/json', (req,res, next) => handleJson("world", req, res, next));
router.get('/session/:sessionId/json', (req,res, next) => handleJson("session", req, res, next));

function getUrl(type, req) {
  switch (type) {
    case "world":
      return `https://api.resonite.com/users/${req.params.ownerId}/records/${req.params.recordId}/`;
    case "session":
      return "https://api.resonite.com/sessions/" + req.params.sessionId;
    default:
      throw new Error("Unknown url type");
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

function preProcessName(name) {
  const start = /<color="?(.+?)"?>/gi;
  const end = /<\/color>/gi
  return name.replace(start, "<span style=\"color: $1 ;\">").replace(end, "</span>");
}

function preProcess(json, type) {
  json.name = preProcessName(json.name);

  if (!json.thumbnailUrl || json.thumbnailUrl === "")
  {
    json.thumbnailUrl = "/images/noThumbnail.png";
  }

  if (json.thumbnailUri) {
    json.thumbnailUri = json.thumbnailUri.replace("resdb:///", "https://assets.resonite.com/").replace(".webp", "");
  } else {
    json.thumbnailUri = "/images/noThumbnail.png";
  }

  json.description = generateDescription(json, type);

  json.title = json.name;

  return json;
}

function generateDescription(json, type) {
  if (type =="world") {
    return json.description;
  }
  if (type =="session") {
    return `Host: ${json.hostUsername}.\n` +
     `Users ${json.totalJoinedUsers}/${json.maxUsers}:${json.sessionUsers.map(user => user.username).join(", ")}.\n`+
     `Version: ${json.appVersion}`;
  }
}

module.exports = router;
