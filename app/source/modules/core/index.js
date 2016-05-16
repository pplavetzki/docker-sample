/**
 * Created by paul on 5/8/15.
 */
'use strict';

var angular = require('angular');

require('angular-ui-router');
require('angular-bootstrap');

module.exports = angular.module('app.core', ['ui.router', 'ui.bootstrap']);

require('./core.routes');
require('./route-helper.provider');