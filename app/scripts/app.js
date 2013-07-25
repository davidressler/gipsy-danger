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
		templateUrl: 'views/alert-box.html',
		link: function(scope, element, attrs) {
			var alertBox = element.children().eq(1).children();
			var ogTop = alertBox.position().top;
			var ogLeft = alertBox.position().left;
			var mapHeight = 1000;
			var mapWidth = 1000;

			alertBox.resizable({
				handles: 'ne, se, sw, nw',
				minHeight: 100,
				minWidth: 100,
				containment: 'parent',
				resize: function (event, ui) {
					var width = ui.element.width() + 2;
					var height = ui.element.height() + 2;
					var overlay = element.children().eq(0);
					var uiElement = ui.element;

					overlay.width(width);
					overlay.height(height);

					if(uiElement.position().top == ogTop ) {
						var newBottom = mapHeight - height - parseInt(overlay.css('border-top-width'));
						overlay.css('border-bottom-width', newBottom + 'px');
					}else {
						var newTop = mapHeight - height - parseInt(overlay.css('border-bottom-width'));
						overlay.css('border-top-width', newTop + 'px');
					}

					if (uiElement.position().left == ogLeft) {
						var newRight = mapWidth - width - parseInt(overlay.css('border-left-width'));
						overlay.css('border-right-width', newRight + 'px');
					} else {
						var newLeft = mapWidth - width - parseInt(overlay.css('border-right-width'));
						overlay.css('border-left-width', newLeft + 'px');
					}

					ogTop = uiElement.position().top;
					ogLeft = uiElement.position().left;
				}
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