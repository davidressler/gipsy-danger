/**********************************************/
/**         SEARCH ITEMS MODULE         **/
/**********************************************/

var searchItems = angular.module('SearchItemsMod', []);

/***********************/
/** Search Items Fact **/
/***********************/
searchItems.factory('SearchItemsFact', function() {
	/* Variables */
	var listings = [];
	var buildings = [];
	var items = [];

	/* Private Functions */
	function _clearLists() {
		listings = [];
		buildings = [];
		items = [];
	}

	/* Public Functions */
	var getBuildingById = function(id) {
		for (var i = 0; i < buildings.length; i++) {
			if (id === buildings[i].id) {
				return buildings[i];
			}
		}
		return null;
	};

	var getListingById = function(id) {
		for(var i=0; i < listings.length; i++) {
			if(id === listings[i].id) {
				return listings[i];
			}
		}
		return null;
	};

	var loadItems = function(data) {
		_clearLists();
		for(var i=0; i < items.length; i++) {
			var item;
			if(data[i]['t'] == 1) {
				item = new Listing(data[i]);
				listings.push(item);
			} else if(data[i]['t'] == 2) {
				item = new Building(data[i]);
				buildings.push(item);
			}
			items.push(item);
		}
	};

	return {
		getBuildingById: getBuildingById,
		getListingById: getListingById,
		loadItems: loadItems
	}

});

//TODO: MOVE THESE TO SEPARATE FILES
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


function Building(data) {
	this.defaultPhoto = data['dp'];
	this.id = parseInt(data['id']);
	this.isFavorite = data['fa'];
	this.isFeatured = data['ife'];
	this.isFresh = false;
	this.isViewed = data['iv'];
	this.maxPrice = data['mp'];
	this.minPrice = data['p'];
	this.title = data['ti'];
	this.typeId = 2;

}

function FullBuilding(data) {
	Building.call(this, data);

	this.address = data['ad'];
	this.amenities = data['am'];
	this.floorplans = [];

	this.LoadFloorplans = function(floorplans) {
		this.floorplans = [];
		for(var i=0; i < floorplans.length; i++) {
			this.floorplans.push(new Floorplan(floorplans[i]));
		}
	};
}
FullBuilding.prototype = Object.create(Building.prototype);
FullBuilding.prototype.constructor = FullBuilding;

function Floorplan(data) {
	this.beds = data['bd'];
	this.baths = data['ba'];
	this.maxPrice = data['mp'];
	this.minPrice = data['p'];
	this.sqft = data['sq'];
	this.title = data['t'];

}

//TODO: ONLY NECESSARY IF WE HAVE A FLOORPLAN PAGE
function FullFloorplan(data) {
	Floorplan.call(this, data);

	this.address = data['ad'];
	this.amenities = data['am'];
	this.description = data['de'];
	this.photoList = data['pl'];
}
FullFloorplan.prototype = Object.create(Floorplan.prototype);
FullFloorplan.prototype.constructor = FullFloorplan;