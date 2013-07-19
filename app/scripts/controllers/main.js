'use strict';


 app.controller('MainCtrl', function ($scope, $route, $location, $routeParams, Search, $timeout) {
	 $scope.init = function() {
		 $scope.isReady = true;
		 if (!('zoom' in $location.search())) {
			 $scope.updateURL();
		 }
	 };

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
		$scope.search = Search.getSearch();
	});

	 $scope.search = Search.getSearch();

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
		$scope.init();
	 });


	 $scope.updateURL = function() {
		 if($scope.isReady) {
			 var search = {
				 zoom: $scope.search.zoom,
				 center: $scope.search.center[0] + "," + $scope.search.center[1]
			 };
			 $location.search(search);
		 }
	 };

	 $scope.$watch('search.zoom', function () {
		$scope.updateURL();
	 });

	 $scope.$on('UpdateURL', function() {
		 console.log('RESPONDING TO NO PARAMS');
		$scope.updateURL();
	 });

  });


