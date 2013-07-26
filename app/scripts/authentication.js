/********************************************/
/*****       AUTHENTICATION MODULE      *****/
/********************************************/

var authentication = angular.module('AuthMod', []);

/*********************/
/** Login Directive **/
/*********************/
authentication.directive('LoginDir', function() {
	return {
		restrict: 'EA',
		transclude: true,
		templateUrl: 'views/login.html',
		controller: 'LoginCtrl',
		link: function(scope, element, attrs) {

		}
	}
});

authentication.controller('LoginCtrl', function($scope) {

});

/******************************/
/** Create Account Directive **/
/******************************/
authentication.directive('CreateAccountDir', function() {
	return {
		restrict: 'EA',
		transclude: true,
		templateUrl: 'views/createaccount.html',
		controller: 'CreateAccountCtrl',
		link: function(scope, element, attrs) {

		}
	}
});

authentication.controller('CreateAccountCtrl', function($scope) {

});