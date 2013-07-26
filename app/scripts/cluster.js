/*************************************/
/**         CLUSTER MODULE          **/
/*************************************/

var cluster = angular.module('ClusterMod', []);

/*********************/
/** Cluster Factory **/
/*********************/
cluster.factory('ClusterFact', function($rootScope) {
	/* Variables */
	var clusters = [];

	/* Private Functions */
	function Cluster(data, map){
		this._count = data['c'];
		this._center = new google.maps.LatLng(data["la"], data["ln"]);
		this._div = null;
		this._favorite = false;
		this._fresh = false;
		this._listings = data['l'];
		this._map = map;
		this._viewed = false;

		//TODO: Not sure if this line is necessary
		google.maps.OverlayView.call(this);
		this.setMap(map);
	}
	Cluster.prototype = new google.maps.OverlayView();
	Cluster.prototype.onAdd = function () {
		this._div = document.createElement('div');
		this._div.className = 'cluster-bg';

		var innerDiv = document.createElement('div');
		innerDiv.className = 'cluster cluster-fresh';

		var span = document.createElement('span');
		span.innerHTML = this._count || '4';
		innerDiv.appendChild(span);
		this._div.appendChild(innerDiv);

		var panes = this.getPanes();
		panes.overlayMouseTarget.appendChild(this._div);

	};
	Cluster.prototype.draw = function () {
		var position = this.getProjection().fromLatLngToDivPixel(this._center);

		this._div.style.left = (position.x) + "px";
		this._div.style.top = (position.y) + "px";
	};
	Cluster.prototype.onRemove = function () {
		this._div.parentNode.removeChild(this._div);
		this._div = null;
	};
	//TODO: Not sure if these two are necessary
	Cluster.prototype.hide = function () {
		this.setMap(null);
	};
	Cluster.prototype.show = function () {
		this.setMap(this._map);
	};

	function _clearMap() {
		for(var i=0; i < clusters.length; i++) {
			clusters[i].setMap(null);
		}
		clusters = [];
	}


	/* Public Functions */
	var createClusters = function(clusterDict, map) {
		_clearMap();
		console.log(map);
		for(var i=0; i < clusterDict.length; i++) {
			clusters.push(new Cluster(clusterDict[i], map));
		}
	};

	var getClusters = function() {
		return clusters;
	};

	return {
		getClusters: getClusters,
		createClusters: createClusters
	}

});

