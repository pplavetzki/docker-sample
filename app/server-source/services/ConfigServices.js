import {settings} from "../../config";
import {processConfigFile} from "../processing/lib/junos-config";

var nano = require('nano')(settings.couchdb);

class ConfigServices {
    constructor() {}

    static saveConfig(callback) {
        processConfigFile((config) => {
            
            var configs = nano.use('configs');
            configs.insert(config, (err, body) => {
                if (err) callback(err);
                else callback(null, body);
            });
            
        });
    }
    static getConfig(id, callback) {
        var configs = nano.use('configs');
        configs.get(id, { revs_info: false }, (err, body) => {
            if (err) callback(err);
            else callback(null, body);
        });
   }
}

export {ConfigServices};