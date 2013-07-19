'use strict';

var app = angular.module('angularRouterApp', ['google-maps']);

app.run(function($rootScope, $route, $routeParams, Search) {
	$rootScope.$on('$routeChangeSuccess', function () {
		console.log('SUCCESS', $routeParams);
		Search.setSearch($routeParams);
	})

	$rootScope.$on('$routeUpdate', function() {
		console.log('ROUTE PARAMS', $routeParams);
		Search.setSearch($routeParams);
	})
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

app.factory('Search', function($rootScope, $timeout) {
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
		console.log('FORMATTED RESULT', result);
		return result;
	};


	var setSearch = function(params) {
		if (validParams(params)) {
			search = formatParams(params);
			$rootScope.$broadcast('SearchUpdated');
		} else {
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
})