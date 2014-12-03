'use strict';

var ngIdpControllers = angular.module('ngIdpControllers', []);

ngIdpControllers.controller('SignInCtrl', ['$scope','DataFactory', function ($scope, DataFactory) {
	console.log("Hello from SignInCtrl");

	$scope.validate = function () {
		
		DataFactory.checkPost("/AuthenticateUser", $scope.login)
		.success(function(json){
			console.log("success called" + json.name);
			location.replace("http://localhost:3000/" + "#homePage?name="+json.name);  
		});
	}
}]);

ngIdpControllers.controller('HomepageCtrl', ['$scope','DataFactory', function ($scope, $http) {
	console.log("Hello from HomepageCtrl");
	var filterarray = [
	{"name":"MaxPrice", 
	"value":"25", 
	"paramName":"Currency", 
	"paramValue":"USD"},
	{"name":"FreeShippingOnly", 
	"value":"true", 
	"paramName":"", 
	"paramValue":""},
	{"name":"ListingType", 
	"value":["AuctionWithBIN", "FixedPrice", "StoreInventory"], 
	"paramName":"", 
	"paramValue":""},
	];

	$scope.searchFromEbay = function () {
		console.log("Hello from searchFromEbay");
		console.log($scope.keyword);
		console.log($scope.category);
	}
	
}]);

ngIdpControllers.controller('registrationCtrl', ['$scope','DataFactory', function ($scope, DataFactory) {
	console.log("Hello from registrationCtrl");

	$scope.registerUser = function () {
		
		DataFactory.checkPost("/RegisterUser", $scope.register)
        		 	.success(function(json){
        		 		console.log("success called" + json.name);
        		 		location.replace("http://localhost:3000/" + "#homePage?name="+json.name);  
        	});
	}
}]);
