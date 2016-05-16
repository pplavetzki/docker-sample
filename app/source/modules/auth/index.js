/**
 * Created by paul on 5/7/15.
 */
'use strict';

var angular = require('angular');

module.exports = angular.module('app.auth', ['app.core']);

require('./auth.routes');
require('./login.controller');