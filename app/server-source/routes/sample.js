var express = require('express');
var bodyParser = require('body-parser');

import {SampleService} from "../services/SampleServices";

var sample = express.Router();

var jsonParser = bodyParser.json();

sample.get('/', function (req, res) {
    SampleService.postConfig((err, body) => {
      res.type('json');
      if(err) res.json('{"result":"false"}');
      else res.json(body);
    });
});

// POST /api/users gets JSON bodies 
sample.post('/', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  res.type('json');
  res.json(JSON.stringify(SampleService.getSamples()));
})

export var sampleRoutes = sample;