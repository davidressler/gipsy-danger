/*************************************/
/**         SEARCH MODULE           **/
/*************************************/

var searchMod = angular.module('SearchMod', []);


/*
	URL PARAMETERS AND ABBREVIATIONS
	********************************

	beds --> bd (int list)
	bounds --> bn (float list)
	cats --> c (bool)
	dogs --> d (bool)
	keywords --> k (string list)
	maxPrice --> mx (int)
	minPrice --> mn (int)
	photos --> p (bool)
	zoom --> z (int)

 */


/******************/
/** Search Model **/
/******************/
function Search() {
	this.beds = [];
	this.bounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(37.7750, -122.4183),
		new google.maps.LatLng(37.7750, -122.4183)
	);
	this.cats = false;
	this.dogs = false;
	this.keywords = [];
	this.maxPrice = null;
	this.minPrice = null;
	this.photos = true;
	this.zoom = 12;

}

/********************/
/** Search Factory **/
/********************/
searchMod.factory('SearchFact', function() {
	/* Variables */
	var search = new Search();

	/* Private Functions */
	function _urlToSearch(params) {

	}

	/* Public Functions */
	var getSearch = function () {
		return search;
	};

	var isUrlValid = function (params) {
		return false;
	};

	var searchToUrl = function (searchObj) {

	};

	var setSearch = function (params) {

	};

	return {
		getSearch: getSearch,
		isUrlValid: isUrlValid,
		searchToUrl: searchToUrl,
		setSearch: setSearch
	}

});

/***********************/
/** Search Controller **/
/***********************/
searchMod.controller('SearchCtrl', function($scope, $location, $timeout, SearchFact) {
	/* Controller Setup
	********************/
	$timeout(function () {
		$scope.init();
	});

	/* Scope Variables
	*******************/
	$scope.isReady = false;
	$scope.search = SearchFact.getSearch();

	/* Scope Functions
	*******************/
	$scope.init = function () {
		$scope.isReady = true;

		// Is the URL Valid? If not, we need to set the params
		if (!SearchFact.isUrlValid($location.search())) {
			$scope.updateURL();
		}
	};

	$scope.updateURl = function () {
		if($scope.isReady) {
			$location.search(SearchFact.searchToUrl($scope.search));
		}
	};

	/* Scope Watches
	******************/
	$scope.$on('SearchUpdated', function () {
		// Respond to SearchFact update by syncing model
		$scope.search = SearchFact.getSearch();
	});

	$scope.$on('UpdateURL', function () {
		// Respond to SearchFact when URL was initially invalid
		$scope.updateURL();
	});

	$scope.$watch('search.zoom', function () {
		// When the zoom changes on the map, update the URL
		$scope.updateURL();
	});
});