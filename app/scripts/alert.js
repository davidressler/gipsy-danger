/*************************************/
/**         ALERTS MODULE           **/
/*************************************/

var alertsMod = angular.module('AlertsMod', []);

/********************/
/** Alerts Factory **/
/********************/
alertsMod.factory('AlertsFact', function($rootScope, $http) {

	/* Public Functions */
	var getById = function(id) {

	};

	var getByUserId = function(userId) {

	};

	var saveAlert = function(data) {
		$rootScope.$broadcast('AlertSaved');
	};

	return {
		getById: getById,
		getbyUserId: getByUserId,
		saveAlert: saveAlert
	}

});

/**********************************/
/** Alert Bounding Box Directive **/
/**********************************/
alertsMod.directive('alertBoxDir', function() {
	return {
		restrict: 'EA',
		templateUrl: 'views/alert-box.html',
		controller: 'AlertBoxCtrl',
		link: function(scope, element, attrs) {
			var alertBox = element.children().eq(1).children();
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

				},
				stop: function() {
					google.maps.event.trigger(hackProjection, 'resize');
				}
				// TODO: Depends on map interactions; probably needs to happen
//				create: function() {
//					google.maps.event.trigger(hackProjection, 'resize');
//				}
			});


		}
	}
});

/***********************************/
/** Alert Bounding Box Controller **/
/***********************************/
alertsMod.controller('AlertBoxCtrl', function($scope, $rootScope) {

	/* Scope Functions */
	$scope.getBounds = function () {
		var bounds = google.maps.event.trigger($rootScope.map, 'getAlertBounds');
		console.log(bounds);
	};

});


// TODO: MAybe a separate module? But I don't think so cause shapes are really about alerts so fuck dat shit
/*****************/
/** Shape Model **/
/*****************/
function Shape() {
	//TOtally making this up lalala TODO: Figure this shit out
	this.bounds;
	this.center;
}

/*******************/
/** Shape Factory **/
/*******************/
alertsMod.factory('ShapeFact', function() {

	/* Public Functions */
	var getShapes = function (data) {

	};

	return {
		getShapes: getShapes
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