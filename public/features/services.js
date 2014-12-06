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
		},
		getUserName : function(Url) {
			return $http.get(Url);
		},
		deleteData : function(Url) {
			return $http.delete(Url);
		},
		putData : function(Url, sc) {
			return $http.put(Url, sc);
		},
		selectData : function(Url) {
			return $http.get(Url);
		}
	}
            
});