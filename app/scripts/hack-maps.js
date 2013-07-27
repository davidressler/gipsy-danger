/**!
 * The MIT License
 * 
 * Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * angular-google-maps
 * https://github.com/nlaplante/angular-google-maps
 * 
 * @author Nicolas Laplante https://plus.google.com/108189012221374960701
 */


//function AlertBoxOverlay(bounds, map) {
//
//	this.bounds_ = bounds;
//	this.map_ = map;
//
//	this.div_ = null;
//
//	this.setMap(map);
//
//}
//
//AlertBoxOverlay.prototype = new google.maps.OverlayView();
//AlertBoxOverlay.prototype.onAdd = function() {
//	var div = document.createElement('div');
//	div.className = 'alert-box-overlay';
//
//	this.div_ = div;
//
//	var panes = this.getPanes();
//	panes.overlayLayer.appendChild(div);
//
//};
//AlertBoxOverlay.prototype.draw = function() {
//	var overlayProjection = this.getProjection();
//
//	var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
//	var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
//
//	var div = this.div_;
//	div.style.left = sw.x + 'px';
//	div.style.top = ne.y + 'px';
//	div.style.width = (ne.x - sw.x) + 'px';
//	div.style.height = (sw.y - ne.y) + 'px';
//
//};
var ready = false;

    //--Google Maps Overlay Hack--//
    //--CLEAN UP YOUR API GOOGLE!--//
    function ProjectionHelperOverlay(map) {

        google.maps.OverlayView.call(this);
        this.setMap(map);
    }

ProjectionHelperOverlay.prototype = new google.maps.OverlayView();
		ProjectionHelperOverlay.prototype.onAdd = function() {};
		ProjectionHelperOverlay.prototype.onRemove = function() {};
		ProjectionHelperOverlay.prototype.draw = function () {
			if (!ready) {
				ready = true;
				google.maps.event.trigger(this, 'ready');
			}
		};


(function () {


  /*
   * Utility functions
   */

  /**
   * Check if 2 floating point numbers are equal
   * 
   * @see http://stackoverflow.com/a/588014
   */
  function floatEqual (f1, f2) {
    return (Math.abs(f1 - f2) < 0.000001);
  }
  
  /* 
   * Create the model in a self-contained class where map-specific logic is 
   * done. This model will be used in the directive.
   */
  
  var MapModel = (function () {
    
    var _defaults = { 
        zoom: 8,
        draggable: false,
        container: null
      };
    
    /**
     * 
     */
    function PrivateMapModel(opts) {

        var _instance = null,
        _markers = [],  // caches the instances of google.maps.Marker
        _handlers = [], // event handlers
        _windows = [],  // InfoWindow objects
        o = angular.extend({}, _defaults, opts),
        that = this,
        currentInfoWindow = null;

      this.center = opts.center;
      this.zoom = o.zoom;
      this.draggable = o.draggable;
      this.dragging = false;
      this.selector = o.container;
      this.markers = [];
      this.options = o.options;
      
      this.draw = function () {
        
        if (that.center == null) {
          // TODO log error
          return;
        }
        
        if (_instance == null) {
          
          // Create a new map instance

		google.maps.visualRefresh = true;

          _instance = new google.maps.Map(that.selector, angular.extend(that.options, {
            center: that.center,
            zoom: that.zoom,
            draggable: that.draggable,
            mapTypeId : google.maps.MapTypeId.ROADMAP,
	        disableDefaultUI: true
          }));

	        this.map = _instance;


	        setTimeout(function() {
//		        var overlay = new google.maps.OverlayView();
//		        overlay.draw = function () {
//		        };
//		        overlay.setMap(_instance);
//		        console.log(overlay.getProjection());
//
//		        var coordinates = overlay.getProjection().fromContainerPixelToLatLng(
//			        new google.maps.Point(92, 61)
//		        );
//
//		        console.log(coordinates.lat + ", " + coordinates.lng);



	        }, 1000);




			var rect;

	        hackProjection = new ProjectionHelperOverlay(_instance);


	        google.maps.event.addListener(hackProjection, 'ready', function () {

		       var alertBounds = _calculateBounds();

		        rect = new google.maps.Rectangle({
			        bounds: alertBounds,
			        fillColor: 'yellow',
			        strokeColor: 'green'
		        });

//		        rect.setMap(_instance);



//		        for(var i=0; i < 25; i++) {
//			        var num = Math.random();
//			        var clusterBounds = new google.maps.LatLng(opts.center.jb + num, opts.center.kb + num);
//			        console.log(clusterBounds);
//
//			        var cluster = new ClusterHelperOverlay(clusterBounds, _instance);
//		        }



	        });




	        function _calculateBounds() {
		        var alertBox = $('.alert-box');

		        var neAlertTop = alertBox.position().top;
		        var neAlertLeft = alertBox.position().left + alertBox.width() + 2;
		        var swAlertTop = alertBox.position().top + alertBox.height() + 2;
		        var swAlertLeft = alertBox.position().left;

		        var ne = hackProjection.getProjection().fromContainerPixelToLatLng(
			        new google.maps.Point(neAlertLeft, neAlertTop)
		        );

		        var sw = hackProjection.getProjection().fromContainerPixelToLatLng(
			        new google.maps.Point(swAlertLeft, swAlertTop)
		        );

		        var alertBounds = new google.maps.LatLngBounds(
			        new google.maps.LatLng(sw.jb, sw.kb),
			        new google.maps.LatLng(ne.jb, ne.kb)
		        );

		        return alertBounds;
	        }

	        google.maps.event.addListener(hackProjection, 'resize', function() {
		        rect.setBounds(_calculateBounds());
	        });


	        google.maps.event.addListener(_instance, 'idle', function() {
		        rect.setBounds(_calculateBounds());


	        });





//	        var alertBounds = new google.maps.LatLngBounds(
//		        new google.maps.LatLng(opts.center.jb - .01, opts.center.kb - .01),
//		        new google.maps.LatLng(opts.center.jb + .01, opts.center.kb + .01)
//	        );
//
//	        var alertBox = new google.maps.Rectangle({
//		        bounds: alertBounds,
//		        editable: true,
//		        strokeColor: '#F23C17',
//		        fillColor: '#FFF',
//		        strokeWeight: 2
//	        });
//
//	        alertBox.setMap(_instance);
//
//			var poly1;
//	        setTimeout(function () {
//		        function _calculateBounds() {
//			        var alertBounds = alertBox.getBounds();
//			        var mapBounds = _instance.getBounds();
//			        var bounds1 = [
//				        [
//					        new google.maps.LatLng(alertBounds.ba.b, alertBounds.fa.b),
//					        new google.maps.LatLng(alertBounds.ba.d, alertBounds.fa.b),
//					        new google.maps.LatLng(alertBounds.ba.d, alertBounds.fa.d),
//					        new google.maps.LatLng(alertBounds.ba.b, alertBounds.fa.d)
//				        ],
//				        [
//					        new google.maps.LatLng(mapBounds.ba.b, mapBounds.fa.b),
//					        new google.maps.LatLng(mapBounds.ba.b, mapBounds.fa.d),
//					        new google.maps.LatLng(mapBounds.ba.d, mapBounds.fa.d),
//					        new google.maps.LatLng(mapBounds.ba.d, mapBounds.fa.b)
//				        ]
//			        ];
//
//			        return bounds1;
//		        }
//
//
//		        var poly1 = new google.maps.Polygon({
//			        paths: _calculateBounds(),
//			        strokeWeight: 0
//		        });
//
//		        poly1.setMap(_instance);
//
//		        google.maps.event.addListener(alertBox, 'bounds_changed', function () {
//			        $('img[src$="undo_poly.png"]').hide();
//			        poly1.setPath(_calculateBounds());
//		        });
//
//	        }, 500);




          google.maps.event.addListener(_instance, "dragstart",
              
              function () {
                that.dragging = true;
              }
          );
          
          google.maps.event.addListener(_instance, "idle",
              
              function () {
                that.dragging = false;
              }
          );
          
          google.maps.event.addListener(_instance, "drag",
              
              function () {
                that.dragging = true;   
              }
          );  
          
          google.maps.event.addListener(_instance, "zoom_changed",
              
              function () {
                that.zoom = _instance.getZoom();
                that.center = _instance.getCenter();
              }
          );
          
          google.maps.event.addListener(_instance, "center_changed",
              
              function () {
                  that.center = _instance.getCenter();
              }
          );
          
          // Attach additional event listeners if needed
          if (_handlers.length) {
            
            angular.forEach(_handlers, function (h, i) {
              
              google.maps.event.addListener(_instance, 
                  h.on, h.handler);
            });
          }

//			    var mapLat = _instance.getBounds().ba.d;
//		        var mapLon = _instance.getBounds().fa.b;
//
//		        console.log('mapLat', mapLat);
//		        console.log('mapLon', mapLon);
//
//
//
//		        var alertBox = $('.alert-box');
//		        var mapOffset = $('.angular-google-map').offset();
//		        var alertOffset = alertBox.offset();
//
//		        function newLat(lat, left, left2) {
//			        return (lat * left2) / left;
//		        }
//
//		        function newLon(alertTop, mapLon, mapTop) {
//			        return (alertTop * mapLon) / mapTop;
//		        }
//
//		        var alertNwLat = newLat(mapLat, mapOffset.left, alertOffset.left);
//		        var alertSeLat = newLat(mapLat, mapOffset.left, alertOffset.left + alertBox.width());
//		        var alertNwLon = newLon(alertOffset.top, mapLon, mapOffset.top);
//		        var alertSeLon = newLon(alertOffset.top + alertBox.height(), mapLon, mapOffset.top);
//
//
//				console.log(alertNwLat);
//		        console.log(alertSeLat);console.log(alertNwLon);console.log(alertSeLon);


//		        var alertBounds = new google.maps.LatLngBounds(
//			        new google.maps.LatLng(opts.center.jb - .01, opts.center.kb - .01),
//			        new google.maps.LatLng(opts.center.jb + .01, opts.center.kb + .01)
//		        );
//
//		        var alertBox = new google.maps.Rectangle({
//			        bounds: alertBounds,
//			        editable: true,
//			        strokeColor: '#F23C17',
//			        fillColor: '#FFF',
//			        strokeWeight: 2
//		        });
//
//		        alertBox.setMap(_instance);


//			        function _calculateBounds() {
//				        var mapBounds = _instance.getBounds();
//				        var alertBounds = alertBox.getBounds();
//				        var bounds1 = [
//					        [
//						        new google.maps.LatLng(alertBounds.ba.b, alertBounds.fa.b),
//						        new google.maps.LatLng(alertBounds.ba.d, alertBounds.fa.b),
//						        new google.maps.LatLng(alertBounds.ba.d, alertBounds.fa.d),
//						        new google.maps.LatLng(alertBounds.ba.b, alertBounds.fa.d)
//					        ],
//					        [
//						        new google.maps.LatLng(mapBounds.ba.b, mapBounds.fa.b),
//						        new google.maps.LatLng(mapBounds.ba.b, mapBounds.fa.d),
//						        new google.maps.LatLng(mapBounds.ba.d, mapBounds.fa.d),
//						        new google.maps.LatLng(mapBounds.ba.d, mapBounds.fa.b)
//					        ]
//				        ];
//				        return bounds1;
//			        }
//
//
//
//			        //		        var bounds2 = [
//			        //			        new google.maps.LatLng(mapBounds.ba.d, mapBounds.fa.b),
//			        //			        new google.maps.LatLng(mapBounds.ba.b, mapBounds.fa.b),
//			        //			        new google.maps.LatLng(alertBounds.ba.b, alertBounds.fa.b),
//			        //			        new google.maps.LatLng(alertBounds.ba.d, alertBounds.fa.b)
//			        //		        ];
//
//			        var poly1 = new google.maps.Polygon({
//				        paths: _calculateBounds(),
//				        strokeWeight: 0
//			        });
//
//			        //		        var poly2 = new google.maps.Polygon({
//			        //			        paths: bounds2,
//			        //			        strokeWeight: 0
//			        //		        });
//
//			        poly1.setMap(_instance);
//			        //		        poly2.setMap(_instance);
//
//					var mapBounds = _instance.getBounds();
//					google.maps.event.addListener(_instance, 'dragstart', function() {
//
//						var map = _instance.getBounds();
//						var alert = alertBox.getBounds();
//
//						var newBounds = new google.maps.LatLngBounds(
//							new google.maps.LatLng(opts.center.jb - .01, opts.center.kb - .01),
//							new google.maps.LatLng(opts.center.jb + .01, opts.center.kb + .01)
//						);
//
//			        });
//			        google.maps.event.addListener(_instance, 'dragend', function () {
//				        mapBounds = _instance.getBounds();
//			        });
//
//			        google.maps.event.addListener(alertBox, 'bounds_changed', function () {
//				        $('img[src$="undo_poly.png"]').hide();
//				        poly1.setPaths(_calculateBounds());
//			        });
//
//		        }, 500);



        }
        else {
          
          // Refresh the existing instance
          google.maps.event.trigger(_instance, "resize");
          
          var instanceCenter = _instance.getCenter();
          
          if (!floatEqual(instanceCenter.lat(), that.center.lat())
            || !floatEqual(instanceCenter.lng(), that.center.lng())) {
              _instance.setCenter(that.center);
          }

          if (_instance.getZoom() != that.zoom) {
            _instance.setZoom(that.zoom);
          }
        }
      };
      
      this.fit = function () {
        if (_instance && _markers.length) {
          
          var bounds = new google.maps.LatLngBounds();
          
          angular.forEach(_markers, function (m, i) {
            bounds.extend(m.getPosition());
          });
          
          _instance.fitBounds(bounds);
        }
      };
      
      this.on = function(event, handler) {
        _handlers.push({
          "on": event,
          "handler": handler
        });
      };
      
      this.addMarker = function (lat, lng, icon, infoWindowContent, label, url,
          thumbnail) {
        
        if (that.findMarker(lat, lng) != null) {
          return;
        }
        
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: _instance,
          icon: icon
        });
        
        if (label) {
          
        }
        
        if (url) {
          
        }

        if (infoWindowContent != null) {
          var infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
          });

          google.maps.event.addListener(marker, 'click', function() {
            if (currentInfoWindow != null) {
              currentInfoWindow.close();
            }
            infoWindow.open(_instance, marker);
            currentInfoWindow = infoWindow;
          });
        }
        
        // Cache marker 
        _markers.unshift(marker);
        
        // Cache instance of our marker for scope purposes
        that.markers.unshift({
          "lat": lat,
          "lng": lng,
          "draggable": false,
          "icon": icon,
          "infoWindowContent": infoWindowContent,
          "label": label,
          "url": url,
          "thumbnail": thumbnail
        });
        
        // Return marker instance
        return marker;
      };      
      
      this.findMarker = function (lat, lng) {
        for (var i = 0; i < _markers.length; i++) {
          var pos = _markers[i].getPosition();
          
          if (floatEqual(pos.lat(), lat) && floatEqual(pos.lng(), lng)) {
            return _markers[i];
          }
        }
        
        return null;
      };  
      
      this.findMarkerIndex = function (lat, lng) {
        for (var i = 0; i < _markers.length; i++) {
          var pos = _markers[i].getPosition();
          
          if (floatEqual(pos.lat(), lat) && floatEqual(pos.lng(), lng)) {
            return i;
          }
        }
        
        return -1;
      };
      
      this.addInfoWindow = function (lat, lng, html) {
        var win = new google.maps.InfoWindow({
          content: html,
          position: new google.maps.LatLng(lat, lng)
        });
        
        _windows.push(win);
        
        return win;
      };
      
      this.hasMarker = function (lat, lng) {
        return that.findMarker(lat, lng) !== null;
      };  
      
      this.getMarkerInstances = function () {
        return _markers;
      };
      
      this.removeMarkers = function (markerInstances) {
        
        var s = this;
        
        angular.forEach(markerInstances, function (v, i) {
          var pos = v.getPosition(),
            lat = pos.lat(),
            lng = pos.lng(),
            index = s.findMarkerIndex(lat, lng);
          
          // Remove from local arrays
          _markers.splice(index, 1);
          s.markers.splice(index, 1);
          
          // Remove from map
          v.setMap(null);
        });
      };
    }
    
    // Done
    return PrivateMapModel;
  }());
  
  // End model
  
  // Start Angular directive
  
  var googleMapsModule = angular.module("google-maps", []);

  /**
   * Map directive
   */
  googleMapsModule.directive("googleMap", ["$log", "$timeout", "$filter", '$rootScope', 'ClusterFact', function ($log, $timeout,
      $filter, $rootScope, ClusterFact) {

    var _m;

    var controller = function ($scope, $element) {
      
      _m = $scope.map;
      
      self.addInfoWindow = function (lat, lng, content) {
        _m.addInfoWindow(lat, lng, content);
      };
    };

    controller.$inject = ['$scope', '$element'];
    
    return {
      restrict: "ECA",
      priority: 100,
      transclude: true,
      template: "<div class='angular-google-map' ng-transclude></div>",
      replace: false,
      scope: {
        center: "=center", // required
        markers: "=markers", // optional
        latitude: "=latitude", // required
        longitude: "=longitude", // required
        zoom: "=zoom", // required
        refresh: "&refresh", // optional
        windows: "=windows", // optional
        events: "=events",
	    options: "=options"
      },
      controller: controller,      
      link: function (scope, element, attrs, ctrl) {
        
        // Center property must be specified and provide lat & 
        // lng properties
        if (!angular.isDefined(scope.center) ||
            (!angular.isDefined(scope.center[0]) ||
                !angular.isDefined(scope.center[1]))) {
        	
          $log.error("angular-google-maps: could not find a valid center property");          
          return;
        }
        
        if (!angular.isDefined(scope.zoom)) {
        	$log.error("angular-google-maps: map zoom property not set");
        	return;
        }
        
        angular.element(element).addClass("angular-google-map");

        // Parse options
        var opts = {options: {}};
        if (scope.options) {
          opts.options = angular.fromJson(scope.options);
        }
        
        // Create our model
        _m = new MapModel(angular.extend(opts, {
          container: element[0],            
          center: new google.maps.LatLng(scope.center[0], scope.center[1]),
          draggable: attrs.draggable == "true",
          zoom: scope.zoom
        }));

        _m.on("drag", function () {

          var c = _m.center;

          $timeout(function () {
            
            scope.$apply(function (s) {
              scope.center[0] = c.lat();
              scope.center[1] = c.lng();
            });

          if (scope.events.hasOwnProperty('drag') && angular.isFunction(scope.events['drag'])) {
	          scope.events['drag']();
          }

          });
        });
      
        _m.on("zoom_changed", function () {
          
          if (scope.zoom != _m.zoom) {
            
            $timeout(function () {
              
              scope.$apply(function (s) {
                scope.zoom = _m.zoom;
              });

	          if(scope.events.hasOwnProperty('zoom_changed') && angular.isFunction(scope.events['zoom_changed'])) {
		          scope.events['zoom_changed'](_m);
	          }

            });
          }
        });
      
        _m.on("center_changed", function () {
          var c = _m.center;
        
          $timeout(function () {
            
            scope.$apply(function (s) {
              
              if (!_m.dragging) {
                scope.center[0] = c.lat();
                scope.center[1] = c.lng();
              }
            });
          });
        });


          _m.on("idle", function () {
              $timeout(function () {
	              var num = Math.random();
	              var data = [];
	              for(var i=0; i < 25; i++){
		              var result = {};
		              result['c'] = i;
		              if(i % 2 == 0) {
			              result['la'] = _m.center.lat() - (i * 0.01);

		              }else {
			              result['la'] = _m.center.lat() + (i * 0.01);

		              }

		              if(i % 3 == 0) {
			              result['ln'] = _m.center.lng() - (i * 0.01);
		              } else {
			              result['ln'] = _m.center.lng() + (i * 0.01);
		              }

		              result['l'] = [];
		              data.push(result);

	              }

	              ClusterFact.createClusters(data, _m.map);

                  if (scope.events.hasOwnProperty('idle') && angular.isFunction(scope.events['idle'])) {
                      scope.events['idle'](_m);
                  }
              });
          });

          _m.on("bounds_changed", function () {
              $timeout(function () {
                  if (scope.events.hasOwnProperty('bounds_changed') && angular.isFunction(scope.events['bounds_changed'])) {
                      scope.events['bounds_changed'](_m);
                  }
              });
          });

          _m.on("dragstart", function () {
              $timeout(function () {
                  if (scope.events.hasOwnProperty('dragstart') && angular.isFunction(scope.events['dragstart'])) {
                      scope.events['dragstart'](_m);
                  }
              });
          });

          _m.on("dragend", function () {
              $timeout(function () {
                  if (scope.events.hasOwnProperty('dragend') && angular.isFunction(scope.events['dragend'])) {
                      scope.events['dragend'](_m);
                  }
              });
          });


//        if (angular.isDefined(scope.events)) {
//          for (var eventName in scope.events) {
//            if (scope.events.hasOwnProperty(eventName) && angular.isFunction(scope.events[eventName])) {
//              _m.on(eventName, function () {
//                scope.events[eventName].apply(scope, [_m, eventName, arguments]);
//              });
//            }
//          }
//        }
        
        if (attrs.markClick == "true") {
          (function () {
            var cm = null;
            
            _m.on("click", function (e) {                         
              if (cm == null) {
                
                cm = {
                  latitude: e.latLng.lat(),
                  longitude: e.latLng.lng() 
                };
                
                scope.markers.push(cm);
              }
              else {
                cm.latitude = e.latLng.lat();
                cm.longitude = e.latLng.lng();
              }
              
              
              $timeout(function () {
                scope.latitude = cm.latitude;
                scope.longitude = cm.longitude;
                scope.$apply();
              });
            });
          }());
        }
        
        // Put the map into the scope
        scope.map = _m;
        
        // Check if we need to refresh the map
        if (angular.isUndefined(scope.refresh())) {
          // No refresh property given; draw the map immediately
          _m.draw();
        }
        else {
          scope.$watch("refresh()", function (newValue, oldValue) {
            if (newValue && !oldValue) {
              _m.draw();
            }
          });
        }
        
        // Markers
        scope.$watch("markers", function (newValue, oldValue) {
          
          $timeout(function () {
            
            angular.forEach(newValue, function (v, i) {
              if (!_m.hasMarker(v.latitude, v.longitude)) {
                _m.addMarker(v.latitude, v.longitude, v.icon, v.infoWindow);
              }
            });
            
            // Clear orphaned markers
            var orphaned = [];
            
            angular.forEach(_m.getMarkerInstances(), function (v, i) {
              // Check our scope if a marker with equal latitude and longitude. 
              // If not found, then that marker has been removed form the scope.
              
              var pos = v.getPosition(),
                lat = pos.lat(),
                lng = pos.lng(),
                found = false;
              
              // Test against each marker in the scope
              for (var si = 0; si < scope.markers.length; si++) {
                
                var sm = scope.markers[si];
                
                if (floatEqual(sm.latitude, lat) && floatEqual(sm.longitude, lng)) {
                  // Map marker is present in scope too, don't remove
                  found = true;
                }
              }
              
              // Marker in map has not been found in scope. Remove.
              if (!found) {
                orphaned.push(v);
              }
            });

            orphaned.length && _m.removeMarkers(orphaned);           
            
            // Fit map when there are more than one marker. 
            // This will change the map center coordinates
            if (attrs.fit == "true" && newValue && newValue.length > 1) {
              _m.fit();
            }
          });
          
        }, true);
        
        
        // Update map when center coordinates change
        scope.$watch("center", function (newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          
          if (!_m.dragging) {
            _m.center = new google.maps.LatLng(newValue[0],
                newValue[1]);
            _m.draw();
          }
        }, true);
        
        scope.$watch("zoom", function (newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          
          _m.zoom = newValue;
          _m.draw();
        });
      }
    };
  }]);  
}());