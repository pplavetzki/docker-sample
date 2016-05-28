import {settings} from "../../config";

var nano = require('nano')(settings.couchdb);

class SampleService {
    constructor() {}
    static getSamples() {
        return [{value1:'value data1'}, {value2:'value data2'}];
    }
}

export {SampleService};