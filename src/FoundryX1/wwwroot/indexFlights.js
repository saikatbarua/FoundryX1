
/// <reference path="../wwwroot/foundry.js" />

var foApp = angular.module('foApp', []);

(function (app, fo, ops, undefined) {

    app.controller('workspaceController', function (dataService, ontologyFlightService, render3DService, renderTimeLineService) {

        var url = '../mock/flightHeadings.json';

        function randomNumber(min, max) {
            var result = Math.floor((Math.random() * (max - min)) + min);
            return result;
        }

        var airportDB = ontologyFlightService.airportDB;
        var flightDB = ontologyFlightService.flightDB
 
        renderTimeLineService.init('timeLine');

        render3DService.init('earth');
        render3DService.addGlobe();
        render3DService.animate();

        var EARTH_RADIUS = 637;

        //http://www.smartjava.org/content/render-open-data-3d-world-globe-threejs

        function renderModel(list, modelDef) {
            list.forEach(function (item) {
                var model = modelDef.create();

                var pos = render3DService.latLongToVector3(item.latitude, item.longitude, EARTH_RADIUS, 0 * item.currentAltitude | 0);
                model.position(pos);

                model.rotateOnY(item.longitude * Math.PI / 180);
                model.rotateOnZ((270 + item.latitude) * Math.PI / 180);
                item.model = model;
                if (item.percentComplete <= 0 || item.percentComplete >= 1) {
                    model.hide();
                }
            });

        }

        var simulationTime = (new Date()).addMinutes(0);
        function noop() {
        }

        function flightTimeline() {
            var finished = true;
            simulationTime = simulationTime.addMinutes(2);
            flightDB.items.forEach(function (item) {
                var model = item.model;
                if (!model) return;
                item.currentTime = simulationTime;
                if (item.percentComplete <= 0) {
                    model.hide()
                    finished = false;
                } else if (item.percentComplete >= 1) {
                    model.hide()
                } else {
                    finished = false;
                    var loc = item.position;
                    var pos = render3DService.latLongToVector3(loc[1], loc[0], EARTH_RADIUS, 20);
                    model.position(pos);

                    //model.rotateToY(loc[0] * Math.PI / 180);
                    //model.rotateToZ((270 + loc[1]) * Math.PI / 180);

                    model.show()
                }
            });

            if (finished) {
                render3DService.setAnimation(noop);
            }
        }

        //render3DService.setAnimation(noop);

        this.doPlay = function () {
            simulationTime = (new Date()).addMinutes(-90);
            render3DService.setAnimation(flightTimeline);
        }

        this.doStart = function () {
            simulationTime = (new Date()).addMinutes(0);
            flightTimeline();
        }

        this.doStep = function () {
            flightTimeline();
        }
        dataService.getData(url).then(function (data) {

            data.items.forEach(function (item) {
                //if (flightDB.items.length > 1) return;
                ontologyFlightService.createMockFlightObject(item);
            });

            flightDB.items.forEach(function (flight) {
                flight.departureTimeUtc = (new Date()).addMinutes(randomNumber(-90, 100));
                flight.currentTime = new Date();
                flight.arrivalTimeUtc = (new Date()).addMinutes(randomNumber(-10, 400));
            });

            self.flights = fo.tools.stringify(flightDB.items, undefined, 3);
            self.airports = fo.tools.stringify(airportDB.items, undefined, 3);

            renderTimeLineService.renderFlights(flightDB.items);



            render3DService.loadPrimitive('block', {})
            .then(function (block) {

                airportDB.items.forEach(function (item) { 
                    var model = block.create();

                    var pos = render3DService.latLongToVector3(item.latitude, item.longitude, EARTH_RADIUS, 20);
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


})(foApp, Foundry, Foundry.listOps);

