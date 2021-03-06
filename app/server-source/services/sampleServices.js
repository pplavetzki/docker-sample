import {settings} from "../../config";
import {processConfigFile} from "../processing/lib/junos-config";

var nano = require('nano')(settings.couchdb);

class SampleService {
    constructor() {}
    static getSamples() {
        return [{value1:'value data 1'}, {value2:'value data 2'}];
    }
    static postConfig(callback) {
        processConfigFile((config) => {
            
            var configs = nano.use('configs');
            configs.insert(config, (err, body) => {
                if (err) callback(err);
                else callback(null, body);
            });
            
}       );
    }
}

export {SampleService};