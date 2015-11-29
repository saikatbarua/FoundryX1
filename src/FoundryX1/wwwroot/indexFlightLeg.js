
/// <reference path="../wwwroot/foundry.js" />

var foApp = angular.module('foApp', []);

(function (app, fo, ops, undefined) {

    app.controller('viewerController', function (dataService, ontologyFlightService, render3DService) {

        var url = '../mock/sampleFlights.json';

        ops.registerGroup('inStats', function(item) {
            return item.airline;
        });

        ops.registerGroup('outStats', function(item) {
            return item.airline;

        });

        var airportDB = ontologyFlightService.airportDB;
        var flightDB = ontologyFlightService.flightDB
 

        render3DService.init('earth');
        render3DService.animate();

        render3DService.addGlobe();
        var EARTH_RADIUS = 637;


        function renderModel(list, modelDef) {
            list.forEach(function (item) {
                var model = modelDef.create();

                var pos = render3DService.llToPosition(item.latitude, item.longitude, EARTH_RADIUS, item.currentAltitude | 0);
                model.position(pos);

                model.rotateOnY(item.longitude * Math.PI / 180);
                model.rotateOnZ((270 + item.latitude) * Math.PI / 180)

            });

        }


        dataService.getData(url).then(function (data) {

            data.items.forEach(function (item) {
                ontologyFlightService.createFlightLeg(item);
            });


            self.flights = fo.tools.stringify(flightDB.items, undefined, 3);
            self.airports = fo.tools.stringify(airportDB.items, undefined, 3);

            airportDB.forEachMember(function (port) {
                //var depart = port.getLink('hasDepartures').myMembers;
                var inStats = ops.applyGrouping(port.hasDepartures, 'inStats');
                var outStats = ops.applyGrouping(port.hasArrivals, 'outStats');
            });

            render3DService.loadPrimitive('block', {})
            .then(function (block) {

                airportDB.items.forEach(function (item) {
                    var model = block.create();

                    var pos = render3DService.llToPosition(item.latitude, item.longitude, EARTH_RADIUS, 20);
                    model.position(pos);
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


})(foApp,Foundry, Foundry.listOps);

