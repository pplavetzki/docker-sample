/**
 * Created by paul on 5/7/15.
 */
'use strict';

var angular = require('angular');

module.exports = angular.module('app.dashboard', ['app.core']);

require('./dashboard.controller');
require('./dashboard.routes');