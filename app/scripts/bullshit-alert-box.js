var alertBounds = new google.maps.LatLngBounds(
		        new google.maps.LatLng(opts.center.jb - .01, opts.center.kb - .01),
		        new google.maps.LatLng(opts.center.jb +.01, opts.center.kb + .01 )
	      );

	      var alertBox = new google.maps.Rectangle({
		      bounds: alertBounds,
		      editable: true,
		      strokeColor: '#F23C17',
		      fillColor: '#FFF',
		      strokeWeight: 2
	      });

	        alertBox.setMap(_instance);



	        setTimeout(function() {
		        console.log(alertBounds);
		        console.log(_instance.getBounds());

		        var mapBounds = _instance.getBounds();
		        var bounds1 = [[
			        new google.maps.LatLng(alertBounds.ba.b, alertBounds.fa.b),
			        new google.maps.LatLng(alertBounds.ba.d, alertBounds.fa.b),
			        new google.maps.LatLng(alertBounds.ba.d, alertBounds.fa.d),
			        new google.maps.LatLng(alertBounds.ba.b, alertBounds.fa.d)
		        ], [
			        new google.maps.LatLng(mapBounds.ba.b, mapBounds.fa.b),
			        new google.maps.LatLng(mapBounds.ba.b, mapBounds.fa.d),
			        new google.maps.LatLng(mapBounds.ba.d, mapBounds.fa.d),
			        new google.maps.LatLng(mapBounds.ba.d, mapBounds.fa.b)
		        ]];

//		        var bounds2 = [
//			        new google.maps.LatLng(mapBounds.ba.d, mapBounds.fa.b),
//			        new google.maps.LatLng(mapBounds.ba.b, mapBounds.fa.b),
//			        new google.maps.LatLng(alertBounds.ba.b, alertBounds.fa.b),
//			        new google.maps.LatLng(alertBounds.ba.d, alertBounds.fa.b)
//		        ];

		        var poly1 = new google.maps.Polygon({
			        paths: bounds1,
			        strokeWeight: 0
		        });

//		        var poly2 = new google.maps.Polygon({
//			        paths: bounds2,
//			        strokeWeight: 0
//		        });

		        poly1.setMap(_instance);
//		        poly2.setMap(_instance);

	        }, 500);


	        google.maps.event.addListener(alertBox, 'bounds_changed', function() {
		       $('img[src$="undo_poly.png"]').hide();
	        });