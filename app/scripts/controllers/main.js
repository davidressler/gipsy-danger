'use strict';


 app.controller('MainCtrl', function ($scope, $route, $location, $routeParams, Search, $timeout) {
	 $scope.templates = [
		 {path: '/search/poop', url: 'views/b.html'},
		 {path: '/search/list', url: 'views/a.html'},
		 {path: '/search/map', url: 'views/map.html'}
	 ];

	 $scope.template = $scope.templates[0];

	 function SetTemplate() {
		 for(var template in $scope.templates) {
			 if($scope.templates[template].path == $location.path()) {
				 $scope.template = $scope.templates[template];
			 }
		 }

	 }
	 SetTemplate();

	$scope.$on('SearchUpdated', function () {
		console.log('RESPONDING TO BROADCAST', $scope.search);
		$scope.search = Search.getSearch();
		console.log($scope.search);
		console.log('NEW SEARCH', $scope.search);
	});

	 $scope.search = Search.getSearch();
	 console.log($scope.search);

	     angular.extend($scope, {
	 	    options: {
	 			mapTypeControl: false,
	 		    streetViewControl: false,
	 		    panControl: false,
	 		    keyboardShortcuts: false
	 	    },
	         markers: [], // an array of markers,
	         events: {
	             bounds_changed: function() {
	 //                if (!beenSeen) {
	 //                    beenSeen = true;
	 //                }
	             },
	             idle: function (mapModel) {
//	                 $scope.updateURL();
	             },
	 	        dragstart: function(mapModel) {

	 	        },
	             dragend: function() {

	             },
	 	        zoom_changed: function(mapModel) {
	 //		        $scope.syncMapWithSearch(mapModel, true);
	 	        }
	         }
	     });

	$scope.isReady = false;
	 $timeout(function() {
		$scope.isReady = true;
	 });


	 $scope.updateURL = function() {
		 if($scope.isReady) {
			 var search = {
				 zoom: $scope.search.zoom,
				 center: $scope.search.center[0] + "," + $scope.search.center[1]
			 };
			 console.log('ABOUT TO REDIRECT', $scope.search);
			 $location.search(search);
		 }
	 };

	 $scope.$watch('search.zoom', function () {
		$scope.updateURL();
	 });

	 $scope.$on('UpdateURL', function() {
		$scope.updateURL();
	 });

  });

app.controller('ListCtrl', function ($scope) {
	$scope.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];

	$scope.templates = [
		{name: 'a.html', url: 'views/a.html'},
		{name: 'b.html', url: 'views/b.html'}
	];

	$scope.template = $scope.templates[1];
});


app.controller('MapCtrl', function ($scope, $routeParams, $route, $location) {
	 console.log($route.current.params);
	 console.log($routeParams);



  });
