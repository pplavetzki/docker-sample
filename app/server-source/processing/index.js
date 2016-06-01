import {stat, processConfigFile} from "./lib/junos-config";

processConfigFile((config) => {
    console.log(config.description);
});