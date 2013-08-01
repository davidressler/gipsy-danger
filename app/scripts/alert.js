/*************************************/
/**         ALERTS MODULE           **/
/*************************************/

var alertsMod = angular.module('AlertsMod', []);

/********************/
/** Alerts Factory **/
/********************/
alertsMod.factory('AlertsFact', function($rootScope, $http, Bottomless, ShapeFact) {

	/* Variables
	**************/
	var alertBox;
	var projection;

	/* Private Functions
	*********************/
	function _calculateBounds() {
        var neAlertTop = alertBox.position().top;
        var neAlertLeft = alertBox.position().left + alertBox.width() + 2;
        var swAlertTop = alertBox.position().top + alertBox.height() + 2;
        var swAlertLeft = alertBox.position().left;

        var ne = projection.getProjection().fromContainerPixelToLatLng(
	        new google.maps.Point(neAlertLeft, neAlertTop)
        );

        var sw = projection.getProjection().fromContainerPixelToLatLng(
	        new google.maps.Point(swAlertLeft, swAlertTop)
        );

        return new google.maps.LatLngBounds(
	        new google.maps.LatLng(sw.jb, sw.kb),
	        new google.maps.LatLng(ne.jb, ne.kb)
        );
    }

	/* Public Functions
	*********************/
	var getById = function(id) {

	};

	var getByUserId = function(userId) {

	};

	var saveAlert = function(name, isArea) {
		if(isArea == 'true') {
			alert('Alert Saved!\nName: ' + name + '\nBounds: ' + Bottomless.filthifyByType('bounds', _calculateBounds()));
		} else {
			var selectedShapes = ShapeFact.getSelectedShapes();
			var stringToAlert = 'AlertSaved!\nName: ' + name + '\nShapes: ';
			for(var i=0; i < selectedShapes.length; i++) {
				stringToAlert += selectedShapes[i].id + ', ';
			}
			alert(stringToAlert);
		}
		// do some shit
	};

	var setAlertBox = function(element) {
		alertBox = element;
	};

	var setProjection = function(overlay) {
		projection = overlay;
	};

	return {
		getById: getById,
		getbyUserId: getByUserId,
		saveAlert: saveAlert,
		setAlertBox: setAlertBox,
		setProjection: setProjection
	}

});

/**********************************/
/** Alert Bounding Box Directive **/
/**********************************/
alertsMod.directive('alertBoxDir', function(AlertsFact) {
	return {
		restrict: 'EA',
		templateUrl: 'views/alert-box.html',
//		controller: 'AlertBoxCtrl',
		link: function(scope, element, attrs) {
			var alertBox = element.children().eq(1).children();
			AlertsFact.setAlertBox(alertBox);

			var ogTop = alertBox.position().top;
			var ogLeft = alertBox.position().left;
			// TODO: Needs to be calculated
			var mapHeight = 1000;
			var mapWidth = 1000;

			alertBox.resizable({
				handles: 'ne, se, sw, nw',
				minHeight: 100,
				minWidth: 100,
				containment: 'parent',
				resize: function (event, ui) {
					var width = ui.element.width() + 2;
					var height = ui.element.height() + 2;
					var overlay = element.children().eq(0);
					var uiElement = ui.element;

					overlay.width(width);
					overlay.height(height);

					if(uiElement.position().top == ogTop ) {
						var newBottom = mapHeight - height - parseInt(overlay.css('border-top-width'));
						overlay.css('border-bottom-width', newBottom + 'px');
					}else {
						var newTop = mapHeight - height - parseInt(overlay.css('border-bottom-width'));
						overlay.css('border-top-width', newTop + 'px');
					}

					if (uiElement.position().left == ogLeft) {
						var newRight = mapWidth - width - parseInt(overlay.css('border-left-width'));
						overlay.css('border-right-width', newRight + 'px');
					} else {
						var newLeft = mapWidth - width - parseInt(overlay.css('border-right-width'));
						overlay.css('border-left-width', newLeft + 'px');
					}

					ogTop = uiElement.position().top;
					ogLeft = uiElement.position().left;

				}
			});


		}
	}
});

// TODO: MAybe a separate module? But I don't think so cause shapes are really about alerts so fuck dat shit
/*****************/
/** Shape Model **/
/*****************/
function Shape(data, map) {
	/* Variables
	**************/
	this.id = data['id'];
	this.map = map;
	this.name = data['n'];
	this.polygon = new ShapePolygon(data['s'], this.map);

	/* Functions
	**************/
	this.Draw = function() {
		this.polygon.setMap(this.map);
		if(this.polygon.isSelected) this.polygon.Select();
	};

	this.Initiate = function () {
		var that = this;
		google.maps.event.addListener(this.polygon, 'mouseover', function () {
			that.polygon.Mouseover();
		});

		google.maps.event.addListener(this.polygon, 'mouseout', function () {
			that.polygon.Mouseout();
		});

		google.maps.event.addListener(this.polygon, 'click', function () {
			that.polygon.ToggleSelect();
		});
	};

	this.Remove = function () {
		if(this.polygon != null) this.polygon.setMap(null);
	};

	/* Initiate
	*************/
	this.Initiate();
}

function ShapePolygon(points, map) {
	/* Variables
	**************/
	this.isSelected = false;
	this.options = {
		fillOpacity: 0.2,
		fillColor: '#666',
		strokeColor: '#666',
		strokeOpacity: 0.8,
		strokeWeight: 3
	};
	this.optionsHover = {
		strokeColor: '#2789b1',
		fillColor: '#2789b1',
		zIndex: 10
	};
	this.optionsSelected = {
		fillColor: '#EC4F2F',
		strokeColor: '#EC4F2F'
	};
	this.points = $.parseJSON(points);

	/* Functions
	**************/
	this.CreatePolygonArray = function (data) {
		var rings = [];
		for (var r = 0; r < data.length; r++) {
			var points = [];
			for (var p = 0; p < data[r].length; p++) {
				points.push(new google.maps.LatLng(data[r][p]["y"], data[r][p]["x"]))
			}
			rings.push(points);
		}
		this.setPaths(rings);
	};

	this.Deselect = function () {
		if (!this.isSelected) {
			return;
		}

		this.isSelected = false;
		this.setOptions(this.options);
	};

	this.Initiate = function () {
		this.setOptions(this.options);
		this.CreatePolygonArray(this.points);
		this.setMap(map);
	};

	this.Mouseover = function () {
		if (!this.isSelected) {
			this.setOptions(this.optionsHover);
		}
	};

	this.Mouseout = function () {
		if (!this.isSelected) {
			this.setOptions(this.options);
		}
	};

	this.Select = function () {
		if (this.isSelected) {
			return;
		}

		this.isSelected = true;
		this.setOptions(this.optionsSelected);
	};

	this.ToggleSelect = function () {
		if (this.isSelected) {
			this.Deselect();
		} else this.Select();
	};

	/* Initiate
	 *************/
	this.Initiate();
}
ShapePolygon.prototype = new google.maps.Polygon();

/*******************/
/** Shape Factory **/
/*******************/
alertsMod.factory('ShapeFact', function() {

	/* Variables
	**************/
	var map;
	var previousBnds;
	var shapes = [];

	/* Public Functions
	*********************/
	var clearShapes = function() {
		for(var i=0; i < shapes.length; i++) {
			shapes[i].Remove();
		}
	};

	var getSelectedShapes = function () {
		var result = [];
		for(var i=0; i < shapes.length; i++) {
			if(shapes[i].polygon.isSelected) result.push(shapes[i]);
		}
		return result;
	};

	var getShapes = function (bounds) {
		if(previousBnds != null && previousBnds === bounds && shapes.length > 0) {
			for(var i=0; i < shapes.length; i++) {
				shapes[i].Draw();
			}
		}else {
			shapes = [];
			previousBnds = bounds;
			for (var i = 0; i < shapeData.length; i++) {
				shapes.push(new Shape(shapeData[i], map));
			}
		}

		return shapes;
	};

	var setMap = function(instance) {
		map = instance;
	};

	return {
		clearShapes: clearShapes,
		getSelectedShapes: getSelectedShapes,
		getShapes: getShapes,
		setMap: setMap
	}

});

/*********************/
/** Shape Directive **/
/*********************/
alertsMod.directive('ShapeDir', function() {
	return {
		restrict: 'EA'
	}
});




function ProjectionHelperOverlay(map) {
	this.ready = false;

    google.maps.OverlayView.call(this);
    this.setMap(map);
}

ProjectionHelperOverlay.prototype = new google.maps.OverlayView();
ProjectionHelperOverlay.prototype.onAdd = function() {};
ProjectionHelperOverlay.prototype.onRemove = function() {};
ProjectionHelperOverlay.prototype.draw = function () {
	if (!this.ready) {
		this.ready = true;
		google.maps.event.trigger(this, 'ready');
	}
};



