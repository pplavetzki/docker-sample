var express = require('express');
var app = express();

var redis = require('redis');

//routes
import {sampleRoutes} from "./server-source/routes/sample";
import {configRoutes} from "./server-source/routes/configs";

var client = redis.createClient(6379, 'redis-db');

client.on('connect', function(){
    console.log('connected to redis'); 
});

client.on('error', function(){
    console.log('failed to connect to redis');
});

app.use(express.static('./build/source'));
app.use(express.static('.'));

app.use('/sample', sampleRoutes);
app.use('/configs', configRoutes);

app.all('/*', function(req, res) {
    res.sendFile('index.html', { root: 'build/source' });
});

app.listen(4343, function () {
    console.log('Modern Web up and running!');
});