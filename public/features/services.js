'use strict';

/* Services */
var ngIdpServices = angular.module('ngIdpServices', []);

ngIdpServices.factory('DataFactory', function($http){
	
	return {
		checkPost : function(Url, sl){
			return $http.post(Url, sl);
		},
		fetchByItemId : function(Url){
			return $http.get(Url);
		}
	}
            
});