var express = require('express');
var createError = require('http-errors');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/record/:ownerId/:recordId', (req,res, next) => handleRecord);
router.get('/session/:sessionId', (req,res, next) => handleSession);

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

async function handle(type, req, res, next) {
  var apiResponse = await fetch(getUrl(type, req));
  if (!apiResponse.ok) {
    return next(createError(apiResponse.status));
  }

  var json = await apiResponse.json();

  if (type ==="world" && json.recordType !== "world") {
    return next(createError(400, "go.resonite.com only works for Session and world link."));
  }

  json = preProcess(json);

  res.status(200).render(type, json);
}

function preProcessName(name) {
  const start = /<color="?(.+?)"?>/gi;
  const end = /<\/color>/gi
  return name.replace(start, "<span style=\"color: $1 ;\">").replace(end, "</span>");
}
function preProcess(json) {
  json.name = preProcessName(json.name);
  
  if (!json.thumbnailUrl || json.thumbnailUrl === "")
    json.thumbnailUrl = "/images/noThumbnail.png";

  return json;
}

module.exports = router;
