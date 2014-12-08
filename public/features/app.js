

/* App Module */

var ngIdpApp = angular.module('ngIdpApp', [
  'ngRoute',
  'ngIdpServices',
  'ngIdpControllers',
  'ngIdpDirectives',
  'ngSanitize',
  'ngCookies'
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
        templateUrl: 'templates/ProductDetail.html'
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
      }).
      when('/address', {
        templateUrl: 'templates/Address.html',
        controller: 'addressCtrl'
      }).
      when('/profile', {
        templateUrl: 'templates/Profile.html',
        controller: 'ProfileCtrl'
      }).
      when('/payment', {
        templateUrl: 'templates/Payment.html',
        controller: 'paymentCtrl'
      }).
      when('/addCard', {
        templateUrl: 'templates/AddCard.html',
        controller: 'addCardCtrl'
      }).
      when('/addAddress', {
        templateUrl: 'templates/AddAddress.html',
        controller: 'addAddressCtrl'
      });
      
    console.log("routeProvider: "+ $routeProvider);
  }]);
