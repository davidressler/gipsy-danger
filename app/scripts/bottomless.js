/*********************************/
/**         BOTTOMLESS JS       **/
/*********************************/

var bottomlessJS = angular.module('BottomlessJS', []);

bottomlessJS.factory('Bottomless', function () {

	/************************ UTIL FUNCTIONS ************************/

	/****************/
	/** Scrub Bool **/
	/****************/
	var scrubBool = function(value) {
		return value.toLowerCase() === 't' || value.toLowerCase() === 'true';
	};

	/**********************/
	/** Scrub Float List **/
	/**********************/
	var scrubFloatList = function(value) {
		var split = value.split(',');
		var list = [];
		for (var i = 0; i < split.length; i++) {
			var num = parseFloat(split[i]);
			if (!isNaN(num)) list.push(num);
		}
		return list;
	};

	/***********************/
	/** Scrub String List **/
	/***********************/
	var scrubStringList = function(value) {
		var split = value.split(',');
		if (split[0] != '') return split;

		return [];
	};

	/***************/
	/** Scrub Int **/
	/***************/
	var scrubInt = function(value) {
		var num = parseInt(value);
		if (!isNaN(num)) return num;

		return null;
	};

	/********************/
	/** Scrub Int List **/
	/********************/
	var scrubIntList = function(value) {
		var split = value.split(',');
		var list = [];
		for (var i = 0; i < split.length; i++) {
			var num = parseInt(split[i]);
			if (!isNaN(num)) list.push(num);
		}
		return list;
	};

	/************************ UTIL FUNCTIONS ************************/

	var types = {
		bool: scrubBool,
		floatList: scrubFloatList,
		int: scrubInt,
		intList: scrubIntList,
		stringList: scrubStringList
	};

	/*******************/
	/** Scrub By Type **/
	/*******************/
	var scrubByType = function (type, value) {
		return types[type](value);
	};

	return {
		scrubBool: scrubBool,
		scrubByType: scrubByType,
		scrubFloatList: scrubFloatList,
		scrubInt: scrubInt,
		scrubIntList: scrubIntList,
		scrubList: scrubList
	}


});