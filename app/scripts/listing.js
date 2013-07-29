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
		return new FullListing();
	};

	return {
		getById: getById
	}

});


/**********************************/
/** Full Listing Page Controller **/
/**********************************/
listingsMod.controller('ListingCtrl', function($scope, $routeParams, $location, ListingFact) {
	/* Controller Setup
	 ********************/
	if('listingId' in $routeParams) {
		$scope.listing = ListingFact.getById($routeParams.listingId);
	} else {
		var urlParts = $location.path().split('/');
		$location.path('/' + urlParts[0] + '/' + urlParts[1]);
	}

});