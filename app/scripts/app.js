'use strict';

var app = angular.module('angularRouterApp', ['google-maps']);

app.run(function($rootScope, $location, $routeParams, Search) {
	$rootScope.$on('$routeChangeSuccess', function () {

		if($location.path() == '/search/map' || $location.path() == '/search/list') {
			Search.setSearch($routeParams);
		}

	})

	$rootScope.$on('$routeUpdate', function() {
		if ($location.path() == '/search/map' || $location.path() == '/search/list') {
			Search.setSearch($routeParams);
		}
	})
});

app.directive('alertBox', function() {
	return {
		restrict: 'EA',
		template: '<div class="alert-box-overlay"></div><div class="alert-box"><span></span></div>',
		link: function(scope, element, attrs) {
			console.log();
			element.children().eq(1).resizable({
				handles: 'ne, se, sw, nw',
				alsoResize: '.alert-box span',
				minHeight: 100,
				minWidth: 100
			});


		}
	}
});

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/search'
      })

	    .when('/search', {
		    controller: 'MainCtrl',
		    redirectTo: '/search/map'
	    })
	    .when('/search/list', {
		    templateUrl: 'views/search.html',
		    controller: 'MainCtrl',
		    reloadOnSearch: false
	    })
	    .when('/search/map', {
		    templateUrl: 'views/search.html',
		    controller: 'MainCtrl',
		    reloadOnSearch: false
	    })
	    .when('/search/poop', {
		    templateUrl: 'views/search.html',
		    controller: 'MainCtrl'
	    })
      .otherwise({
        redirectTo: '/'
      });
  });

app.factory('Search', function($rootScope) {
	var search = {
		zoom: 1,
		center: [36, -122]
	};

	var validParams = function(params) {
		if('zoom' in params && 'center' in params) {
			return true;
		}
		return false;
	};

	var formatParams = function(params) {
		var result = {};
		for (var param in params) {
			if(param === 'center') {
				result.center = [parseFloat(params[param].split(',')[0]), parseFloat(params[param].split(',')[1])]
			}else {
				result[param] = parseInt(params[param]);
			}
		}
		return result;
	};


	var setSearch = function(params) {
		if (validParams(params)) {
			search = formatParams(params);
			$rootScope.$broadcast('SearchUpdated');
		} else {
			console.log('NO PARAMS LETS BROADCAST');
			$rootScope.$broadcast('UpdateURL');
		}

	};

	var getSearch = function() {
		return search;
	};

	return {
		getSearch: getSearch,
		setSearch: setSearch
	}
});