/******************************************/
/**             LISTING MODULE           **/
/******************************************/

var listingsMod = angular.module('ListingMod', []);

/*******************/
/** Listing Model **/
/*******************/
function Listing(data) {
	this.baths = data['ba'];
	this.beds = data['bd'];
	this.defaultPhoto = data['dp'];
	this.id = parseInt(data['id']);
	this.isFavorite = data['fa'];
	this.isFeatured = data['ife'];
	this.isFresh = data['if'];
	this.isViewed = data['iv'];
	this.locationTitle = data['lt'];
	this.postDateEpoch = parseInt(data['pd']);
	this.price = data['p'];
	this.sqft = data['sq'];
	this.typeId = 1;

}

function FullListing(data) {
	Listing.call(this, data);

	this.amenities = data['am'];
	this.description = data['de'];
	this.latitude = data['la'];
	this.longitude = data['ln'];
	this.photoList = data['pl'];
}
FullListing.prototype = Object.create(Listing.prototype);
FullListing.prototype.constructor = FullListing;

/**************************/
/** Full Listing Factory **/
/**************************/
listingsMod.factory('ListingFact', function() {

	/* Public Functions */
	var getById = function (id) {
//		return new FullListing(id);
        var res = [];
        for (var listing in listingData) {
            if (listingData[listing].id == id) {
                listing = parseInt(listing);
                res.push(listingData[listing-1]);
                res.push(listingData[listing]);
                res.push(listingData[listing + 1]);
            }
        }
        return res;
    };

//		for(var i=0; i < listingData.length; i++) {
//			if(listingData[i].id == parseInt(id)) {
//				return new FullListing(listingData[i]);
//			}
//		}
//		return null;
//	};


	return {
		getById: getById
	}

});


listingsMod.directive('listingPageDir', function() {
	return {
		restrict: 'EA',
		template: '{{ listing }}',
		controller: 'ListingCtrl'

	}
});

/**********************************/
/** Full Listing Page Controller **/
/**********************************/
listingsMod.controller('ListingCtrl', function($scope, $routeParams, $location, $timeout, ListingFact) {
	/* Controller Setup
	 ********************/
    $timeout(function () {
        $scope.init();
    });

    /* Scope Variables
     ********************/


    /* Scope Functions
     ********************/
    $scope.init = function() {
        $scope.isReady = true;
        $scope.listings = ListingFact.getById($routeParams.listingId);
    };

    $scope.loadPropertyFromPosition = function(newPosition) {
        var nextListingId = $scope.listings[newPosition].id;
        $scope.updateURL(nextListingId);
    };

    $scope.updateURL = function(id) {
        var newURL = $location.path().split('/');
        var URL = '/' + newURL[1] + '/' + newURL[2] + '/listing/' + id;
        $scope.$apply(function() {
            $location.url(URL);
        });
    };

//    debugger;
//
//    if('listingId' in $routeParams) {
//		$scope.listing = ListingFact.getById($routeParams.listingId);
//	} else {
//		var urlParts = $location.path().split('/');
//		$location.path('/' + urlParts[0] + '/' + urlParts[1]);
//	}



});