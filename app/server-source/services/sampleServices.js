var configs = require('../../config');
var nano = require('nano')(configs.couchdb);

function getSamples() {
    return [{value1:'value data1'}, {value2:'value data2'}];
}

function sampleService() {
    this.getSamples = getSamples;
}

module.exports = sampleService();