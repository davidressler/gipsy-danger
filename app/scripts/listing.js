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

	this.DrawCell = function() {
		var container = document.createElement('div');
		container.style.background = 'white';

		var img = document.createElement('img');
		img.style.float = 'left';
		img.src = 'http://d2vzw4mx84c4xs.cloudfront.net/chafe/2/' + this.defaultPhoto + '.jpg';
		container.appendChild(img);

		var infoContainer = document.createElement('div');
		infoContainer.style.float = 'left';

		var price = document.createElement('span');
		price.innerHTML = this.price;
		price.style.fontWeight = 'bold';
		infoContainer.appendChild(price);

		var bedBath = document.createElement('span');
		bedBath.innerHTML = this.beds + ' / ' + this.baths;
		infoContainer.appendChild(bedBath);

		var locationTitle = document.createElement('span');
		locationTitle.innerHTML = this.locationTitle;
		locationTitle.style.display = 'block';
		infoContainer.appendChild(locationTitle);

		var postedDate = document.createElement('span');
		postedDate.innerHTML = this.postDateEpoch;
		postedDate.style.display = 'block';
		infoContainer.appendChild(postedDate);

		var clearFix = document.createElement('div');
		clearFix.style.clear = 'both';

		container.appendChild(infoContainer);
		container.appendChild(clearFix);
		return container;
	};

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