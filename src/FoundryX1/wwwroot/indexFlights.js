
/// <reference path="../wwwroot/foundry.js" />

var foApp = angular.module('foApp', []);

(function (app, fo, ops, undefined) {

    app.controller('viewerController', function (dataService, ontologyService, render3DService) {

        var url = '../mock/sampleFlights.json';


        var airportDB = ontologyService.airportDB;
        var flightDB = ontologyService.flightDB
 

        var element = document.getElementById('earth');
        render3DService.init(element);
        render3DService.animate();
        render3DService.addGlobe();

        var EARTH_RADIUS = 637;
        var radius = EARTH_RADIUS + 20;

        //http://www.smartjava.org/content/render-open-data-3d-world-globe-threejs
        // convert the positions from a lat, lon to a position on a sphere.
        function latLongToVector3(lat, lon, radius, height) {
            var phi = (lat) * Math.PI / 180;
            var theta = (lon - 180) * Math.PI / 180;

            var x = -(radius + height) * Math.cos(phi) * Math.cos(theta);
            var y = (radius + height) * Math.sin(phi);
            var z = (radius + height) * Math.cos(phi) * Math.sin(theta);

            return new THREE.Vector3(x, y, z);
        }

        function renderModel(list, modelDef) {
            list.forEach(function (item) {
                var model = modelDef.create();
                model.position(latLongToVector3(item.latitude, item.longitude, radius, item.currentAltitude | 0));

                var phi = (item.latitude) * Math.PI / 180;
                var theta = (item.longitude) * Math.PI / 180;

                model.rotateOnY(theta);
            });

        }


        dataService.getData(url).then(function (data) {

            data.items.forEach(function (item) {
                ontologyService.createFlightObject1(item);
            });


            self.flights = fo.tools.stringify(flightDB.items, undefined, 3);
            self.airports = fo.tools.stringify(airportDB.items, undefined, 3);


            render3DService.primitive('block', {})
            .then(function (block) {

                airportDB.items.forEach(function (item) { 
                    var model = block.create();
                    model.position(latLongToVector3(item.latitude, item.longitude, radius, item.currentAltitude | 0));
                });

            });

            render3DService.loadModel('707', 'models/707.js')
            .then(function (planeModel) {

                renderModel(flightDB.items, planeModel);
                //render3DService.renderFlightPaths(flightDB.items);

            });


        }, function (reason) {
        });

    });


})(foApp, Foundry, Foundry.listOps);

