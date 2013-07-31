/***************************************/
/**         PROPERTIES MODULE         **/
/***************************************/

var propertiesMod = angular.module('PropertiesMod', []);

/*********************/
/** Properties Fact **/
/*********************/
propertiesMod.factory('PropertiesFact', function() {
	/* Variables
	**************/
	var listings = [];
	var buildings = [];
	var properties = [];

	/* Private Functions
	**********************/
	function _clearLists() {
		listings = [];
		buildings = [];
		properties = [];
	}

	function _getBuildingById(id) {
		for (var i = 0; i < buildings.length; i++) {
			if (id === buildings[i].id) {
				return buildings[i];
			}
		}
		return null;
	}

	function _getListingById(id) {
		for (var i = 0; i < listings.length; i++) {
			if (id === listings[i].id) {
				return listings[i];
			}
		}
		return null;
	}

	function _loadProperties(data) {
		_clearLists();
		for (var i = 0; i < data.length; i++) {
			var item;
			if (data[i]['t'] == 1) {
				item = new Listing(data[i]);
				listings.push(item);
			} else if (data[i]['t'] == 2) {
				item = new Building(data[i]);
				buildings.push(item);
			}
			properties.push(item);
		}
	}

	/* Public Functions
	*********************/
	var getAllProperties = function (bounds) {
		_loadProperties(listingData);
		return properties;
	};

	var getById = function(id, typeId) {
		if(typeId === 1) {
			return _getListingById(id);
		} else if(typeId === 2) {
			return _getBuildingById(id);
		}
		return null;
	};


	return {
		getAllProperties: getAllProperties,
		getById: getById
	}

});

/****************************************************************/
/** Bottom Scroll Bar Directive (WTF this needs a better name) **/
/****************************************************************/
propertiesMod.directive('PropertiesScrollDir', function () {
	return {
		restrict: 'EA',
		transclude: true,
		link: function(scope, element, attrs) {
			// Ruby.ScrollShit()
		}
	}
});