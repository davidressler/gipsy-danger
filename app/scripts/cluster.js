/*************************************/
/**         CLUSTER MODULE          **/
/*************************************/

var clusterMod = angular.module('ClusterMod', []);

/*********************/
/** Cluster Factory **/
/*********************/
clusterMod.factory('ClusterFact', function($rootScope, PropertiesFact, $compile) {
	/* Variables */
	var clusters = [];
	var map;

	/* Private Functions */
	function _clearMap() {
		for(var i=0; i < clusters.length; i++) {
			clusters[i].Remove();
		}
		clusters = [];
	}


	/* Public Functions */
	function _createClusters(clusterDict, $scope) {
		_clearMap();
		for(var i=0; i < clusterDict.length; i++) {
			clusters.push(new Cluster(clusterDict[i], map, $compile, $scope));
		}
		console.log(clusters);
	}

	var getClusters = function(bounds, $scope) {
		_createClusters(clusterData, $scope);
		console.log(clusters);
		return clusters;
	};

	var hideAllListingCells = function() {
		console.log('hidingggg', clusters);
		for(var i=0; i < clusters.length; i++) {
			clusters[i].HideListings();
		}
	};

	var setMap = function(instance) {
		map = instance;
		$rootScope.$broadcast('UpdateClusters');
	};

	return {
		getClusters: getClusters,
		hideAllListingCells: hideAllListingCells,
		setMap: setMap
	}

});

clusterMod.directive('clusterDir', function(PropertiesFact, $compile) {
	return {
		restrict: 'EA',
		template: '<div class="cluster-bg"><div class="cluster cluster-fresh"><span></span></div></div>',
		controller: function($scope) {
			$scope.$on('CloseClusters', function() {
				$scope.showListings = false;
			});
		},
		link: function(scope, element, attrs) {
			function _createListingCell() {
				var div = angular.element(document.createElement('div'));

				div.css('position', 'absolute').css('top', element.children().eq(0).position().top - 40).css('left', element.children().eq(0).position().left + 50);
				div.attr('ng-show', 'showListings');
				var el = $compile(div)(scope);

				scope.properties.forEach(function(item){
					var property = PropertiesFact.getById(item[0], item[1]);
					if(property != null) {
						var newScope = scope.$new(false), cell;

						if(property.typeId == 1) {
							cell = angular.element(document.createElement('listing-cell-dir'));
							newScope.listing = property;
						} else if(property.typeId == 2) {
							cell = angular.element(document.createElement('building-cell-dir'));
							newScope.building = property;
						}

						var el = $compile(cell)(newScope);
						angular.element(div).append(cell);
						newScope.insertHere = el;
					}

				});

				angular.element(document.body).append(div);

				scope.insertHere = el;
				return div;
			}

			element.find('span').text(scope.count);

			var listingCell = null;

			element.click(function() {
				if (listingCell === null) _createListingCell();
				scope.$apply(function() {
					scope.showListings = true;
				});
			});

			element.hover(function() {
				if(listingCell === null) _createListingCell();
				scope.$apply(function(){
					scope.showListings = true;
				});
			}, function() {
				scope.$apply(function() {
					scope.showListings = false;
				});

			});

		}
	}
});

//TODO: DOESNT GO HERE
clusterMod.directive('listingCellDir', function() {
	return {
		restrict: 'EA',
		template: '<div style="background:white"><img style="float:left" ng-src="http://d2vzw4mx84c4xs.cloudfront.net/chafe/2/{{ listing.defaultPhoto }}.jpg"/><div style="float:left"><b>{{ listing.price }}</b>{{ listing.beds }} / {{ listing.baths }}<span style="display:block">{{ listing.locationTitle }}</span><span style="display:block">{{ listing.postDateEpoch }}</span></div><div style="clear:both"></div></div>',
		link: function(scope, element, attrs) {
			element.hover(function () {
				scope.$apply(function () {
					scope.$parent.showListings = true;
				});
			}, function () {
				scope.$apply(function () {
					scope.$parent.showListings = false;
				});

			});
		}
	}
});

//TODO: PUT OBJECT IN SEPARATE FILE
function Cluster(data, map, $compile, $scope){
	/* Variables
	**************/
	this.count = data['c'];
	this.center = new google.maps.LatLng(data["la"], data["ln"]);
	this.$compile = $compile;
	this.div = null;
	this.favorite = false;
	this.fresh = false;
	this.position = [];
	this.properties = data['l'];
	this.propertiesDiv = null;
	this.map = map;
	this.$scope = $scope;
	this.viewed = false;

	/* Functions
	**************/
	this.Click = function () {
		alert('hey');
	};

	this.HideListings = function () {
		console.log(this.propertiesDiv);
		if(this.propertiesDiv != null) {
			console.log(this);
			this.propertiesDiv.style.display = 'none';
		}
	};

	this.Initiate = function () {
		google.maps.OverlayView.call(this);
		this.setMap(this.map);
	};

	this.Mouseover = function () {
		this.ShowListings();
	};

	this.Remove = function () {
		this.setMap(null);
	};

	this.ShowListings = function () {
//		ClusterFact.$get().hideAllListingCells();
//		if(this.propertiesDiv == null) {
//			this.propertiesDiv = document.createElement('div');
//			this.propertiesDiv.style.position = 'absolute';
//			this.propertiesDiv.style.left = this.div.style.left;
//			this.propertiesDiv.style.top = this.div.style.top;
//			this.propertiesDiv.style.display = 'block';
//			for (var i = 0; i < this.properties.length; i++) {
//				var property = PropertiesFact.getById(this.properties[i][0], this.properties[i][1]);
//				this.propertiesDiv.appendChild(property.DrawCell());
//			}
//			document.body.appendChild(this.propertiesDiv);
//		} else {
//			this.propertiesDiv.style.display = 'block';
//		}

	};

	/* Initiate
	*************/
	this.Initiate();

}
Cluster.prototype = new google.maps.OverlayView();
Cluster.prototype.onAdd = function () {
	this.div = angular.element(document.createElement('cluster-dir'));

	var scope = this.$scope.$new(true);
	scope.count = this.count;
	scope.showListings = false;
	scope.properties = this.properties;

	var el = this.$compile(this.div)(scope);

	var panes = this.getPanes();
	angular.element(panes.overlayMouseTarget).append(this.div);

	scope.insertHere = el;


};
Cluster.prototype.draw = function () {
	var position = this.getProjection().fromLatLngToDivPixel(this.center);

	this.div[0].firstChild.style.left = (position.x) + "px";
	this.div[0].firstChild.style.top = (position.y) + "px";
};
Cluster.prototype.onRemove = function () {
	this.div.parentNode.removeChild(this.div);
	this.div = null;
};