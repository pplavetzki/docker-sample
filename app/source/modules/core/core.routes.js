/**
 * Created by paul on 5/8/15.
 */
'use strict';

var coreModule = require('./index');

function getStates() {

    return [{
        state: '404',
        config: {
            url: '/404',
            views: {
                root: {
                    templateUrl: 'views/modules/core/404.html',
                    title: '404'
                }
            }
        }
    }];
}

onRun.$inject = ['routeHelper'];
function onRun(routeHelper){
    var otherwise = '/404';
    routeHelper.configureStates(getStates(), otherwise);
}

coreModule
    .run(onRun);