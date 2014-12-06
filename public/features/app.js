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
      when('/', {
        templateUrl: 'templates/SignIn.html',
        controller: 'SignInCtrl'
      }).
      when('/registerUser', {
        templateUrl: 'templates/Registeration.html',
        controller: 'registrationCtrl'
      }).
      when('/productDetail', {
        templateUrl: 'templates/ProductDetail.html',
        controller: 'productDetailCtrl'
      }).
      when('/comments', {
        templateUrl: 'templates/Comments.html',
        controller: 'commentCtrl'
      }).
      when('/savedProducts', {
        templateUrl: 'templates/SavedProducts.html',
        controller: 'savedProductsCtrl'
      });
      
    console.log("routeProvider: "+ $routeProvider);
  }]);
