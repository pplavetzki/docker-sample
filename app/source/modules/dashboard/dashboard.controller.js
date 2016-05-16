/**
 * Created by paul on 5/7/15.
 */
'use strict';

var dashboardModule = require('./index');
var Dashboard = Dashboard;

Dashboard.$inject = ['$state'];

function Dashboard ($state) {
    var vm = this;
    vm.testVar = 'We are up and running from a required module with a vm!';

    vm.gotoAnalysis = function() {
        $state.go('app.workflow');
    };
}

dashboardModule.controller('Dashboard', Dashboard);