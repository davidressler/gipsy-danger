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
					controller: 'SearchCtrl',
		            reloadOnSearch: false
				})
			    .when('/search/list/building/:buildingId', {
				    templateUrl: 'views/building.html',
				    controller: 'SearchCtrl',
		            reloadOnSearch: false
			    })
				    .when('/search/list/building/:buildingId/floorplan/:floorplanId', {
					    templateUrl: 'views/floorplan.html',
		                controller: 'SearchCtrl',
		                reloadOnSearch: false
				    })
		    .when('/search/map', {
			    templateUrl: 'views/search.html',
			    controller: 'SearchCtrl',
			    reloadOnSearch: false
		    })
			    .when('/search/map/listing/:listingId', {
				    templateUrl: 'views/listing.html',
				    controller: 'SearchCtrl',
		            reloadOnSearch: false
			    })
			    .when('/search/map/building/:buildingId', {
				    templateUrl: 'views/building.html',
				    controller: 'SearchCtrl',
		            reloadOnSearch: false
			    })
				    .when('/search/list/building/:buildingId/floorplan/:floorplanId', {
					    templateUrl: 'views/floorplan.html',
					    controller: 'SearchCtrl',
		                reloadOnSearch: false
				    })

	    /*******************/
	    /** Alerts Routes **/
	    /*******************/
	    .when('/alerts', {
			templateUrl: 'views/alert.html',
		    controller: 'AlertCtrl'
		})
	    .when('/alert/:alertId', {
		    templateUrl: 'views/alert.html',
		    controller: 'AlertCtrl'
	    })
		    .when('/alert/:alertId/listing/:listingId', {
			    templateUrl: 'views/listing.html',
			    controller: 'ListingCtrl'
		    })
		    .when('/alert/:alertId/building/:buildingId', {
			    templateUrl: 'views/building.html',
			    controller: 'BuildingCtrl'
		    })
			    .when('/alert/:alertId/building/:buildingId/floorplan/:floorplanId', {
				    templateUrl: 'views/floorplan.html',
				    controller: 'BuildingCtrl'
			    })

	    /******************/
	    /** Inbox Routes **/
	    /******************/
	    .when('/inbox', {
		    templateUrl: 'views/inbox.html',
		    controller: 'InboxCtrl'
	    })
		    .when('/inbox/favorites', {
			    templateUrl: 'views/inbox.html',
		        controller: 'InboxCtrl'
		    })
		    .when('/inbox/inactive', {
			    templateUrl: 'views/inbox.html',
			    controller: 'InboxCtrl'
		    })
		    .when('/inbox/applied', {
			    templateUrl: 'views/inbox.html',
			    controller: 'InboxCtrl'
		    })

	    /********************/
	    /** Account Routes **/
	    /********************/
	    .when('/account', {
		    redirectTo: '/account/settings'
	    })
		    .when('/account/settings', {
				templateUrl: 'views/account/settings.html',
		        controller: 'AccountCtrl',
		        access: {
			        requireLoggedIn: true
		        }
		    })
		    .when('/account/payments', {
				templateUrl: 'views/whatever.html',
		        controller: 'AccountCtrl',
		        access: {
			        requireLoggedIn: true
		        }
		    })
		    .when('/account/profile', {
				templateUrl: 'views/cool.html',
		        controller: 'AccountCtrl',
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