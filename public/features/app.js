'use strict';

/* App Module */

var ngIdpApp = angular.module('ngIdpApp', [
  'ngRoute',
  'ngIdpServices',
  'ngIdpControllers',
  'ngIdpDirectives',
  'ngSanitize'
]);
ngIdpApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/homePage', {
        templateUrl: 'templates/Homepage.html',
        controller: 'HomepageCtrl'
      }).
      when('/signIn', {
        templateUrl: 'templates/SignIn.html',
        controller: 'SignInCtrl'
      });
      // .
      // otherwise({
      //   redirectTo: '/'
      // });
      console.log("routeProvider: "+ $routeProvider);
  }]);