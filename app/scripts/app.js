'use strict';

var dependencies = [
    'angular-carousel',
	'google-maps',
	'ClusterMod',
	'AlertsMod',
	'BottomlessJS',
	'ClusterMod',
	'google-maps',
	'ListingMod',
	'PropertiesMod',
	'TemplatesMod',
	'AlertsMod',
    'ListingMod'
	'SearchMod',
	'TemplatesMod'
];

var Spot = angular.module('spot', dependencies);

Spot.run(function($rootScope, $location, $routeParams, SearchFact) {

	/* Private Functions
	**********************/
	function _setSearchFromParams(params) {
		var path = $location.path();
		var split = path.split('/');
		if (path == '/search/map' || path == '/search/list' || (split.length > 3 && (split[3] == 'listing' || split[3] == 'building'))) {
			SearchFact.setSearch(params);
		}
	}

	/* Route Changes
	******************/
	$rootScope.$on('$routeChangeSuccess', function () {
		_setSearchFromParams($routeParams);
	});

	$rootScope.$on('$routeUpdate', function() {
		_setSearchFromParams($routeParams);
	})
});