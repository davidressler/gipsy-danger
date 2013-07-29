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
	var typeDict = {
		bd: 'intList',
		bn: 'floatList',
		c: 'bool',
		d: 'bool',
		k: 'stringList',
		mx: 'int',
		mn: 'int',
		p: 'bool',
		z: 'int'
	};
	var urlDict = {
		bd: 'beds',
		bn: 'bounds',
		c: 'cats',
		d: 'dogs',
		k: 'keywords',
		mx: 'maxPrice',
		mn: 'minPrice',
		p: 'photos',
		z: 'zoom'
	};

	/* Private Functions */
	function _urlToSearch(params) {
		for (var param in params) {
			if (typeDict.hasOwnProperty(param)) {
				if (typeDict[param] === 'bool') {
					search[urlDict[params.param]] = params.param === 't' || params.param === 'true';
				} else if (typeDict[param] === 'int') {
					var num = parseInt(params.param);
					if (!isNaN(num)) search[urlDict[params.param]] = num;
				} else if (typeDict[param] === 'intList') {
					var list = params.param.split(',');
					for(var )
				}
			}

		}

	}

	/* Public Functions */
	var getSearch = function () {
		return search;
	};

	var isUrlValid = function (params) {
		var valid = true;
		if( !('z' in params && !isNaN(params['z'])) ) {
			valid = false;
			return valid;
		}
		if( !('bn' in params) ) {
			var bounds = params['bn'].split(',');
			if(bounds.length != 4) {
				valid = false;
				return valid;
			}
			for(var i=0; i < bounds.length; i++) {
				if(isNaN(parseFloat(bounds[i]))) {
					valid = false;
					return valid;
				}
			}

		}
		return valid;
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