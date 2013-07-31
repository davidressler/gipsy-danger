/*************************************/
/**         CLUSTER MODULE          **/
/*************************************/

var cluster = angular.module('ClusterMod', []);

/*********************/
/** Cluster Factory **/
/*********************/
cluster.factory('ClusterFact', function($rootScope, PropertiesFact) {
	/* Variables */
	var clusters = [];
	var poop = 'hello';
	var map;
	var that = this;

	/* Private Functions */
	function _clearMap() {
		for(var i=0; i < clusters.length; i++) {
			clusters[i].Remove();
		}
		clusters = [];
	}


	/* Public Functions */
	function _createClusters(clusterDict) {
		_clearMap();
		for(var i=0; i < clusterDict.length; i++) {
			clusters.push(new Cluster(clusterDict[i], map, PropertiesFact));
		}
	}

	var getClusters = function(bounds) {
		console.log(bounds);
		console.log(map);
		_createClusters(clusterData);
		return clusters;
	};

	var hideAllListingCells = function() {
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
		setMap: setMap,
		poop: poop
	}

});

//TODO: PUT OBJECT IN SEPARATE FILE
function Cluster(data, map, PropertiesFact){
	/* Variables
	**************/
	this.count = data['c'];
	this.center = new google.maps.LatLng(data["la"], data["ln"]);
	this.div = null;
	this.favorite = false;
	this.fresh = false;
	this.properties = data['l'];
	this.propertiesDiv = null;
	this.map = map;
	this.viewed = false;

	/* Functions
	**************/
	this.Click = function () {
		this.ShowListings();
	};

	this.HideListings = function () {
		if(this.propertiesDiv != null) this.propertiesDiv.style.display = 'none';
	};

	this.Initiate = function () {
		google.maps.OverlayView.call(this);
		this.setMap(this.map);
	};

	this.Mouseover = function () {
		alert('hey');
	};

	this.Remove = function () {
		this.setMap(null);
	};

	this.ShowListings = function () {
		if(this.propertiesDiv == null) {
			console.log('hey');
			this.propertiesDiv = document.createElement('div');
			this.propertiesDiv.style.position = 'absolute';
			this.propertiesDiv.style.left = this.div.style.left;
			this.propertiesDiv.style.top = this.div.style.top;
			this.propertiesDiv.style.display = 'block';
			for (var i = 0; i < this.properties.length; i++) {
				var property = PropertiesFact.getById(this.properties[i][0], this.properties[i][1]);
				this.propertiesDiv.appendChild(property.DrawCell());
			}
			document.body.appendChild(this.propertiesDiv);
		} else {
			this.propertiesDiv.style.display = 'block';
		}

	};

	/* Initiate
	*************/
	this.Initiate();

}
Cluster.prototype = new google.maps.OverlayView();
Cluster.prototype.onAdd = function () {
	var that = this;

	this.div = document.createElement('div');
	this.div.className = 'cluster-bg';

	var innerDiv = document.createElement('div');
	innerDiv.className = 'cluster cluster-fresh';

	var span = document.createElement('span');
	span.innerHTML = this.count;
	innerDiv.appendChild(span);
	this.div.appendChild(innerDiv);

	var panes = this.getPanes();
	panes.overlayMouseTarget.appendChild(this.div);

	this.div.onclick = function () {
		that.Click();
	};

};
Cluster.prototype.draw = function () {
	var position = this.getProjection().fromLatLngToDivPixel(this.center);

	this.div.style.left = (position.x) + "px";
	this.div.style.top = (position.y) + "px";
};
Cluster.prototype.onRemove = function () {
	this.div.parentNode.removeChild(this.div);
	this.div = null;
};