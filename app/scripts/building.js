/*******************************************/
/**             BUILDING MODULE           **/
/*******************************************/

var buildingMod = angular.module('BuildingMod', []);

/********************/
/** Building Model **/
/********************/
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

}
FullBuilding.prototype = Object.create(Building.prototype);
FullBuilding.prototype.constructor = FullBuilding;


/*********************/
/** Floorplan Model **/
/*********************/
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



/***************************/
/** Full Building Factory **/
/***************************/
buildingMod.factory('BuildingFact', function() {

	/* Public Functions */
	var getById = function (id) {
		return new FullBuilding();
	};

	return {
		getById: getById
	}

});

/***********************/
/** Floorplan Factory **/
/***********************/
buildingMod.factory('FloorplanFact', function($http) {

	/* Public Functions */
	var getByBuildingId = function(buildingId) {
		var floorplans = [];
		for(var i=0; i < floorplans.length; i++) {
			floorplans[i] = new Floorplan(floorplan[i]);
		}
		return floorplans;
	};

	var getById = function(id) {
		return new FullFloorplan();
	};

	return {
		getByBuildingId: getByBuildingId,
		getById: getById
	}

});


/***********************************/
/** Full Building Page Controller **/
/***********************************/
buildingMod.controller('BuildingCtrl', function($scope, $routeParams, $location, BuildingFact, FloorplanFact) {
	/* Controller Setup
	 ********************/
	if('buildingId' in $routeParams) {
		var buildingId = $routeParams.buildingId;
		$scope.building = BuildingFact.getById(buildingId);
		$scope.floorplans = FloorplanFact.getByBuildingId(buildingId);
	} else {
		var urlParts = $location.path().split('/');
		$location.path('/' + urlParts[0] + '/' + urlParts[1]);
	}

});