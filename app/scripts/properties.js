/***************************************/
/**         PROPERTIES MODULE         **/
/***************************************/

var propertiesMod = angular.module('PropertiesMod', []);

/*********************/
/** Properties Fact **/
/*********************/
propertiesMod.factory('PropertiesFact', function() {
	/* Variables */
	var listings = [];
	var buildings = [];
	var properties = [];

	/* Private Functions */
	function _clearLists() {
		listings = [];
		buildings = [];
		properties = [];
	}

	/* Public Functions */
	var getAllProperties = function () {
		return properties;
	};

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

	var loadProperties = function(data) {
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
			properties.push(item);
		}
	};

	return {
		getAllProperties: getAllProperties,
		getBuildingById: getBuildingById,
		getListingById: getListingById,
		loadProperties: loadProperties
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