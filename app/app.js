var express = require('express');
var redis = require('redis');

//routes
import {sampleRoutes} from "./server-source/routes/sample";

var app = express();

var client = redis.createClient(6379, 'redis-db');

client.on('connect', function(){
    console.log('connected to redis'); 
});

app.use(express.static('./build/source'));
app.use(express.static('.'));

app.use('/sample', sampleRoutes);

app.all('/*', function(req, res) {
    res.sendFile('index.html', { root: 'build/source' });
});

app.listen(4343, function () {

    console.log('Modern Web Cool!');

});