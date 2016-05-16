/**
 * Created by paul on 5/11/15.
 */
'use strict';

var layoutModule = require('./index');


function getStates() {
    return [{
        state: 'app',
        config: {
            abstract: true,
            views:{
                root:{
                    templateUrl: 'views/modules/layout/shell.html',
                    controller: 'Shell',
                    controllerAs: 'vm',
                    title: 'Shell'
                }
            }
        }
    }];
}

onRun.$inject = ['routeHelper'];
function onRun(routeHelper){
    routeHelper.configureStates(getStates(), "/404");
}

layoutModule
    .run(onRun);