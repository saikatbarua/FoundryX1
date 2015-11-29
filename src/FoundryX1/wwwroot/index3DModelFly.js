
/// <reference path="../wwwroot/foundry.js" />

var foApp = angular.module('foApp', []);



foApp.controller('viewerController', function (dataService, ontologyService, render3DService) {

    var EARTH_RADIUS = 637;

    render3DService.init('earth');
    render3DService.animate();
        
    render3DService.addGlobe();
        
    var planes = [];
    var radius = EARTH_RADIUS + 20;

    
    //render3DService.setAnimation(function () {
    //    //var angle = r * Math.PI / 180;
    //    //var pitch = (270 + r) * Math.PI / 180;
    //    var list = planes; //[0] ? [planes[0]] : []
    //    list.forEach(function (item) {
    //        var delta = item.speed * Math.PI / 180;
    //        item.angle += delta;

    //        item.positionXYZ(radius * Math.cos(item.angle), radius * Math.sin(item.angle), 0);
    //        item.rotateOnZ(delta);  //this will acumlate...

    //    });
    //});


    render3DService.setAnimation(function () {
        var list = planes; 
        list.forEach(function (plane) {
            var deltaLat = plane.speed;
            var deltaLng = plane.speed;

            plane.latitude += deltaLat;
            plane.longitude += deltaLng;

            var bearing = render3DService.llToBearing(plane.latitude - deltaLat, plane.longitude - deltaLng, plane.latitude, plane.longitude);


            var pos = render3DService.llToPosition(plane.latitude, plane.longitude, EARTH_RADIUS, 20);
            plane.position(pos);

            //these rotations are deltas from the last pos
            //plane.rotateOnZ(deltaLat * Math.PI / 180).rotateOnY(deltaLng * Math.PI / 180);

            plane
                .rotateClear()
                .rotateOnY((plane.longitude).toRad())
                .rotateOnZ((270 + plane.latitude).toRad());


        });
    });

    function positionModel(min, max, def){
        for (var lat = min; lat < max; lat += 15) {
            for (var lng = 0; lng < 180; lng += 45) {

                var plane = def.create();

                plane.latitude = lat;
                plane.longitude = lng;
                plane.speed = .1; //degrees per tick

                var pos = render3DService.llToPosition(plane.latitude, plane.longitude, EARTH_RADIUS, 20);
                plane
                    .position(pos)
                    .rotateClear()
                    .rotateOnY(plane.longitude.toRad())
                    .rotateOnZ((270 + plane.latitude).toRad());

                planes.push(plane);
            }
        }
    }

    render3DService.loadModel('707', 'models/707.js')
        .then(function(planeModel) {
            positionModel(0,90, planeModel);
            return render3DService.loadModel('beech99', 'models/beech99.js')
        })
        .then(function(planeModel) {
            positionModel(90,180, planeModel);
            return render3DService.loadModel('c-2a', 'models/c-2a.js')
        })
        .then(function(planeModel) {
            positionModel(90,180, planeModel);
        });
});