'use strict';

var dependencies = [
	'AlertsMod',
	'BottomlessJS',
	'ClusterMod',
	'google-maps',
	'PropertiesMod',
	'SearchMod',
	'TemplatesMod'
];

var Spot = angular.module('spot', dependencies);

Spot.run(function($rootScope, $location, $routeParams, SearchFact) {

	/* Route Changes
	******************/
	$rootScope.$on('$routeChangeSuccess', function () {

		if($location.path() == '/search/map' || $location.path() == '/search/list') {
			SearchFact.setSearch($routeParams);
		}

	});

	$rootScope.$on('$routeUpdate', function() {
		if ($location.path() == '/search/map' || $location.path() == '/search/list') {
			SearchFact.setSearch($routeParams);
		}
	})
});