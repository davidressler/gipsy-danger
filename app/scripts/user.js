/********************************************/
/*****       AUTHENTICATION MODULE      *****/
/********************************************/

var user = angular.module('UserMod', []);

/****************/
/** User Model **/
/****************/
function User () {
	this.email = '';
	this.firstName = '';
	this.id = 0;
	this.isRealBoy = false;
	this.lastName = '';
	this.phone = '';
}


/******************/
/** User Factory **/
/******************/
user.factory('UserFact', function($http) {
	/* Variables */
	var user = new User();

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
		//TODO: Logic shit goes here
		user = userObj;
	};

	return {
		User: getUser,
		setUser: setUser
	}

});