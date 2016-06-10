var express = require('express');
var bodyParser = require('body-parser');

import {ConfigServices} from "../services/ConfigServices";

var router = express.Router();

var jsonParser = bodyParser.json();

// POST /configs
router.post('/', function (req, res) {
    ConfigServices.saveConfig((err, body) => {
      res.type('json');
      if(err) res.json('{"ok":"false", "message":"' + err.message + '"}');
      else res.json(body);
    });
});

// GET /configs/:id
router.get('/', function(req, res){

    res.type('json');
    ConfigServices.getConfigs({include_docs:true}, (err, docs) => {
        if(err) res.json('{"ok":"false", "message":"' + err.message + '"}');
        else res.json(docs);
    });
});

// GET /configs/:id
router.get('/:id', function(req, res){
    let id = req.params.id;
    
    res.type('json');
    if(!id) res.json("error")
    else {
        ConfigServices.getConfig(id, (err, body) => {
            if(err) res.json('{"ok":"false", "message":"' + err.message + '"}');
            else res.json(body);
        });
    }
});

export var configRoutes = router;