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

ngIdpControllers.controller('HomepageCtrl', ['$scope', function ($scope, $http) {
	console.log("Hello from HomepageCtrl");

}]);
