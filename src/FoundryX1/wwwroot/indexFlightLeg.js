
/// <reference path="../wwwroot/foundry.js" />

var foApp = angular.module('foApp', []);

(function (app, fo, ops, undefined) {

    app.controller('viewerController', function (dataService, ontologyService, render3DService) {

        var url = '../mock/sampleFlights.json';

        ops.registerGroup('inStats', function(item) {
            return item.airline;
        });

        ops.registerGroup('outStats', function(item) {
            return item.airline;

        });

        var airportDB = ontologyService.airportDB;
        var flightDB = ontologyService.flightDB
 

        var element = document.getElementById('earth');
        render3DService.init(element);
        render3DService.animate();

        render3DService.addGlobe();


        dataService.getData(url).then(function (data) {

            data.items.forEach(function (item) {
                ontologyService.createFlightObject1(item);
            });


            self.flights = fo.tools.stringify(flightDB.items, undefined, 3);
            self.airports = fo.tools.stringify(airportDB.items, undefined, 3);

            airportDB.forEachMember(function (port) {
                //var depart = port.getLink('hasDepartures').myMembers;
                var inStats = ops.applyGrouping(port.hasDepartures, 'inStats');
                var outStats = ops.applyGrouping(port.hasArrivals, 'outStats');
            });

            render3DService.loadModel('707', 'models/707.js')
            .then(function (planeModel) {

                render3DService.renderAirports(airportDB.items);
                render3DService.renderFlights(flightDB.items);
                render3DService.renderFlightPaths(flightDB.items);

            });


        }, function (reason) {
        });

    });


})(foApp,Foundry, Foundry.listOps);

