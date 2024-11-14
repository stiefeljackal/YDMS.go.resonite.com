var express = require('express');
var createError = require('http-errors');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/record/:ownerId/:recordId', handleRecord);
router.get('/session/:sessionId', handleSession);

async function handleSession(req, res, next) {
  var apiResponse = await fetch("https://api.resonite.com/sessions/" + req.params.sessionId);
  if (!apiResponse.ok) {
    return createError(apiResponse.status);
  }
  var json = await apiResponse.json();

  json = preProcess(json);

  res.status(200).render('session', json);
}

async function handleRecord(req, res, next) {
  var url = `https://api.resonite.com/users/${req.params.ownerId}/records/${req.params.recordId}/`;
  var apiResponse = await fetch(url);
  if (!apiResponse.ok) {
    return next(createError(apiResponse.status));
  }
  var json = await apiResponse.json();
  if (json.recordType !== "world") {
    return next(createError(400));
  }

  res.status(200).render('session', json);
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
