/**
 * Created by paul on 5/7/15.
 */
'use strict';

var angular = require('angular'); //

require('./modules/core');
require('./modules/dashboard'); //
require('./modules/layout');
require('./modules/auth');
require('./modules/widgets');
require('./modules/services');

setup.$inject = ['$rootScope', '$location', '$window'];

function setup($rootScope, $location, $window){

    /*
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        //Do your things
        if("/" == $location.$$path){
            if (!$window.sessionStorage.token || window.sessionStorage.token === "null") {
                $location.path('/login');
            }
        }
    });
    */

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            var title = (toState.title || '');
            $rootScope.title = title; // data bind to <title>
        }
    );
}

angular
        .module('app', ['app.core',
                       'app.auth',
                       'app.dashboard',
                       'app.layout',
                       'app.widgets',
                       'app.services'
                      ])
        .run(setup);