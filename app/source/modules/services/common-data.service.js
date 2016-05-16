/**
 * Created by paul on 5/22/15.
 */
'use strict';

var servicesModule = require('./index');

var commonDataService = commonDataService;

commonDataService.$inject = ['$http'];

function commonDataService($http){

    var service = {
        getCountries:getCountries,
        getStates:getStates
    };

    return service;

    function getCountries(){
        return $http.get('/data/countries.json')
            .then(complete)
            .catch(failed);

        function complete(response){
            return response.data;
        }

        function failed(error){
            return console.log(error);
        }
    }

    function getStates(){
        return $http.get('/data/states.json')
            .then(complete)
            .catch(failed);

        function complete(response){
            return response.data;
        }

        function failed(error){
            return console.log(error);
        }
    }
}

servicesModule.factory('commonDataService', commonDataService);