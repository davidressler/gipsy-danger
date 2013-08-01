/***************************/
/*****     ROUTER      *****/
/***************************/

Spot.config(function ($routeProvider) {
    $routeProvider
	    /*****************/
	    /** Index Route **/
	    /*****************/
	    .when('/', {
	        redirectTo: '/search'
	    })

        /*******************/
	    /** Search Routes **/
	    /*******************/
	    .when('/search', {
		    redirectTo: '/search/map'
	    })
		    .when('/search/list', {
			    templateUrl: 'views/search.html',
			    controller: 'SearchCtrl',
			    reloadOnSearch: false
		    })
			    .when('/search/list/listing/:listingId', {
					templateUrl: 'views/listing.html',
					controller: 'ListingCtrl'
				})
			    .when('/search/list/building/:buildingId', {
				    templateUrl: 'views/building.html',
				    controller: 'BuildingController'
			    })
				    .when('/search/list/building/:buildingId/floorplan/:floorplanId', {
					    templateUrl: 'views/floorplan.html',
		                controller: 'BuildingController'
				    })
		    .when('/search/map', {
			    templateUrl: 'views/search.html',
			    controller: 'SearchCtrl',
			    reloadOnSearch: false
		    })
			    .when('/search/map/listing/:listingId', {
				    templateUrl: 'views/listing.html',
				    controller: 'ListingCtrl'
			    })
			    .when('/search/map/building/:buildingId', {
				    templateUrl: 'views/building.html',
				    controller: 'BuildingController'
			    })
				    .when('/search/list/building/:buildingId/floorplan/:floorplanId', {
					    templateUrl: 'views/floorplan.html',
					    controller: 'BuildingController'
				    })

	    /*******************/
	    /** Alerts Routes **/
	    /*******************/
	    .when('/alerts', {
			templateUrl: 'views/alert.html',
		    controller: 'AlertController'
		})
	    .when('/alert/:alertId', {
		    templateUrl: 'views/alert.html',
		    controller: 'AlertController'
	    })
		    .when('/alert/:alertId/listing/:listingId', {
			    templateUrl: 'views/listing.html',
			    controller: 'ListingController'
		    })
		    .when('/alert/:alertId/building/:buildingId', {
			    templateUrl: 'views/building.html',
			    controller: 'BuildingController'
		    })
			    .when('/alert/:alertId/building/:buildingId/floorplan/:floorplanId', {
				    templateUrl: 'views/floorplan.html',
				    controller: 'BuildingController'
			    })

	    /******************/
	    /** Inbox Routes **/
	    /******************/
	    .when('/inbox', {
		    templateUrl: 'views/inbox.html',
		    controller: 'InboxController'
	    })
		    .when('/inbox/favorites', {
			    templateUrl: 'views/inbox.html',
		        controller: 'InboxController'
		    })
		    .when('/inbox/inactive', {
			    templateUrl: 'views/inbox.html',
			    controller: 'InboxController'
		    })
		    .when('/inbox/applied', {
			    templateUrl: 'views/inbox.html',
			    controller: 'InboxController'
		    })

	    /********************/
	    /** Account Routes **/
	    /********************/
	    .when('/account', {
		    redirectTo: '/account/settings'
	    })
		    .when('/account/settings', {
				templateUrl: 'views/account/settings.html',
		        controller: 'AccountController',
		        access: {
			        requireLoggedIn: true
		        }
		    })
		    .when('/account/payments', {
				templateUrl: 'views/whatever.html',
		        controller: 'AccountController',
		        access: {
			        requireLoggedIn: true
		        }
		    })
		    .when('/account/profile', {
				templateUrl: 'views/cool.html',
		        controller: 'AccountController',
		        access: {
			        requireLoggedIn: true
		        }
		    })

	    /***************/
	    /** Otherwise **/
	    /***************/
	    .otherwise({
	        redirectTo: '/'
	    });
});