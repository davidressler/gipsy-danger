/*********************************/
/**         BOTTOMLESS JS       **/
/*********************************/

var bottomlessJS = angular.module('BottomlessJS', []);

bottomlessJS.factory('Bottomless', function () {

	/************************ SCRUB FUNCTIONS ************************/

	/****************/
	/** Scrub Bool **/
	/****************/
	var scrubBool = function(value) {
		return value.toLowerCase() === 't' || value.toLowerCase() === 'true';
	};

	/******************/
	/** Scrub Bounds **/
	/******************/
	var scrubBounds = function(value) {
		var scrubbed = scrubFloatList(value);
		if(scrubbed.length === 4) {
			return new google.maps.LatLngBounds(
				new google.maps.LatLng(scrubbed[0], scrubbed[1]),
				new google.maps.LatLng(scrubbed[2], scrubbed[3])
			);
		}
		return [];
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

	/************************ FILTHIFY / SOILING FUNCTIONS (aka to URL) ************************/

	/*******************/
	/** Filthify Bool **/
	/*******************/
	var filthifyBool = function (value) {
		if(value) return 't';
		return 'f'
	};

	/*********************/
	/** Filthify Bounds **/
	/*********************/
	var filthifyBounds = function(value) {
		var result = '';
		result += value.ba.b;
		result += ',' + value.fa.b;
		result += ',' + value.ba.d;
		result += ',' + value.fa.d;
		return result;
	};

	/*******************/
	/** Filthify List **/
	/*******************/
	var filthifyList = function (value) {
		var result = '';
		for(var i=0; i < value.length; i++) {
			if(i != 0) result += ',';
			result += value[i];
		}
		return result;
	};

	/************************ OTHER FUNCTIONS ************************/

	var scrubTypes = {
		bool: scrubBool,
		bounds: scrubBounds,
		floatList: scrubFloatList,
		int: scrubInt,
		intList: scrubIntList,
		stringList: scrubStringList
	};

	var filthifyTypes = {
		bool: filthifyBool,
		bounds: filthifyBounds,
		floatList: filthifyList,
		intList: filthifyList,
		stringList: filthifyList
	};

	/*******************/
	/** Scrub By Type **/
	/*******************/
	var scrubByType = function (type, value) {
		return scrubTypes[type](value);
	};

	/**********************/
	/** Filthify By Type **/
	/**********************/
	var filthifyByType = function (type, value) {
		return filthifyTypes[type](value);
	};

	return {
		filthifyByType: filthifyByType,
		scrubByType: scrubByType
	}


});