var express = require('express');

var app = express();

app.use(express.static('./build'));
app.use(express.static('.'));

app.all('/*', function(req, res) {
    res.sendFile('index.html', { root: 'build' });
});

app.listen(4343, function () {

    console.log('Modern Web!');

});