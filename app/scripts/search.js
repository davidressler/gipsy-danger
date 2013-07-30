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
searchMod.factory('SearchFact', function($rootScope, Bottomless) {
	/* Variables
	**************/
	var search = new Search();

	var urlKeys = {
		bd: { type: 'intList', name: 'beds' },
		bn: { type: 'floatList', name: 'bounds' },
		c: { type: 'bool', name: 'cats' },
		d: { type: 'bool', name: 'dogs' },
		k: { type: 'stringList', name: 'keywords' },
		mx: { type: 'int', name: 'maxPrice' },
		mn: { type: 'int', name: 'minPrice' },
		p: { type: 'bool', name: 'photos' },
		z: { type: 'int', name: 'zoom' }
	};
	var searchKeys = {
		beds: { type: 'intList', url: 'bd' },
		bounds: { type: 'floatList', url: 'bn' },
		cats: { type: 'bool', url: 'c' },
		dogs: { type: 'bool', url: 'd' },
		keywords: { type: 'stringList', url: 'k' },
		maxPrice: { type: 'int', url: 'mx' },
		minPrice: { type: 'int', url: 'mn' },
		photos: { type: 'bool', url: 'p' },
		zoom: { type: 'int', url: 'z' }
	};

	/* Private Functions
	**********************/
	function _urlToSearch(params) {
		/** Convert url into a valid search object **/

		for (var param in params) {

			// Check that the parameter in the url is even something we care about
			if (urlKeys.hasOwnProperty(param)) {
				var value = params[param];

				// Let BottomlessJS do the heavy lifting
				search[urlKeys[value].name] = Bottomless.scrubByType(urlKeys[param].type, value);
			}
		}
	}

	/* Public Functions
	**********************/
	var getSearch = function () {
		/** Getter for search object (aka how SearchCtrl updates its model) **/

		return search;
	};

	var isUrlValid = function (params) {
		/** Check if the url has the minimum requirements to create a valid search **/

		// First, check if the url contains a zoom level and, if it does, that the value is legitimate
		if( !(params.hasOwnProperty('z') && !isNaN(params['z'])) ) {
			return false;
		}

		// Check to see if the url contains a bounds parameter
		if( !(params.hasOwnProperty('bn')) ) {
			var bounds = params['bn'].split(',');

			// Make sure we have all 4 values we need to actually have map bounds
			if(bounds.length != 4) {
				return false;
			}

			// Make sure we hav 4 legitimate values
			for(var i=0; i < bounds.length; i++) {
				if(isNaN(parseFloat(bounds[i]))) {
					return false;
				}
			}

		}

		// If we made it this far, we can actually do something with this url
		return true;
	};

	var searchToUrl = function (searchObj) {
		/** Convert search object into url string (aka query parameters) */

		var url = '';
		for(var key in searchObj) {
			// If there are already values in the url string, we need to add an & character - durh
			if(url != '') url += '&';

			// Add the appropriate abbreviated url key
			url += searchKeys[key].url + "=";

			// For lists and booleans, we have a special url structure - Bottomless takes care of that
			var type = searchKeys[key].type;
			if (type === 'intList' || type === 'floatList' || type === 'stringList' || type === 'bool') {
				url += Bottomless.filthifyByType(type, searchObj[key]);
			} else {

				// Otherwise, just attach the value to the url string
				url += searchObj[key];
			}
		}
		return url;
	};

	var setSearch = function (params) {
		/** Save search from url into model **/

		// Check if the url would even make a valid search object
		if(isUrlValid(params)) {

		// Convert url to valid search object (stored as local variable)
			_urlToSearch(params);

		// Let the SearchCtrl know that it needs to update its model
			$rootScope.$broadcast('SearchUpdated')
		} else {

			// If it's not valid, make the SearchCtrl apply its model so the url becomes valid
			$rootScope.$broadcast('UpdateURL');
		}
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
searchMod.controller('SearchCtrl', function($scope, $location, $timeout, SearchFact, PropertiesFact) {
	/* Controller Setup
	********************/
	$timeout(function () {
		$scope.init();
	});

	/* Scope Variables
	*******************/
	$scope.isCreatingAlert = false;
	$scope.isNamingAlert = false;
	$scope.isReady = false;
	$scope.properties = PropertiesFact.getAllProperties();
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
	$scope.$on('AlertSaved', function () {
		// Revert to normal search (aka not setting an alert)
		$scope.isCreatingAlert = false;
		$scope.isNamingAlert = false;
	});

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

/* TODO: THIS MAY NOT BE NECESSARY
searchMod.directive('SearchDir', function() {
	return {
		restrict: 'EA',
		template: '<div class="search-dir"></div>',
		transclude: true,
		controller: 'SearchCtrl'
	}
});
*/


// TODO: THIS SHOULD BE IN A DIFF FILE AND MAYBE A DIFF DIRECTIVE

/*
*
* Hopefully we can have this work so that the search object is stored in a parent controller and then map and list have access to that
*  Could use $parent
*  If not, we could wrap "Search" in its own directive and have the search map directive and list directives "require" SearchDir
*  Don't know how that will play with hack maps
*  But really the search logic should be separate from the map logic cause search is just a search and we can visualize any which way we want
*
* */

searchMod.directive('SearchMapDir', function() {
	return {
		restrict: 'EA',
		template: '<div class="map-wrapper" ng-transclude></div>',
		controller: 'SearchMapCtrl',
		transclude: true
	}
});

searchMod.controller('SearchMapCtrl', function($scope) {
	/* Scope Variables
	*******************/
	$scope.events = {
		bounds_changed: function () {

		},
		dragend: function () {

		},
		dragstart: function(mapModel) {

		},
		idle: function (mapModel) {

		},
		zoom_changed: function (mapModel) {

		}
	};
	$scope.markers = [];
	$scope.options = {
		mapTypeControl: false,
		streetViewControl: false,
		panControl: false,
		keyboardShortcuts: false
	};
});

searchMod.directive('SearchListDir', function () {
	return {
		restrict: 'EA',
		template: '<div class="search-list" ng-transclude></div>',
		controller: 'SearchListCtrl',
		transclude: true
	}
});

searchMod.controller('SearchListCtrl', function ($scope) {

});