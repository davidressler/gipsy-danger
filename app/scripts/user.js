/********************************************/
/*****       AUTHENTICATION MODULE      *****/
/********************************************/

var user = angular.module('UserMod', []);

/******************/
/** User Factory **/
/******************/
user.factory('UserFact', function($http) {
	/* Variables */
	var user = {
		email: '',
		firstName: '',
		id: 1,
		isRealBoy: false,
		lastName: '',
		phone: ''
	};

	/* Private Functions */
	function getUserById(id) {
		return '';
	}

	function getUserBySession() {
		return '';
	}


	/* Public Functions */
	var getUser = function() {
		return user;
	};

	var setUser = function(userObj) {
		user = userObj;
	};

	return {
		User: getUser,
		setUser: setUser
	}

});