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
      }).
      when('/forgotPassword', {
        templateUrl: 'templates/ForgotPassword.html',
        controller: 'forgotPasswordCtrl'
      }).
      when('/passwordChange', {
        templateUrl: 'templates/PasswordUpdated.html'
      }).
      when('/report', {
        templateUrl: 'templates/Report.html',
        controller: 'reportCtrl'
      });
      
    console.log("routeProvider: "+ $routeProvider);
  }]);
