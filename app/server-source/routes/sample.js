var express = require('express');
var bodyParser = require('body-parser');
var sampleService = require('../services/sampleServices');

var sample = express.Router();

var jsonParser = bodyParser.json();

sample.get('/', function (req, res) {
    res.type('json');
    res.json('{"result":"success"}');
});

// POST /api/users gets JSON bodies 
sample.post('/', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  res.type('json');
  res.json(JSON.parse(sampleService.getSamples()));
})

module.exports = sample;