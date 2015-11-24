
/// <reference path="../wwwroot/foundry.js" />

var foApp = angular.module('foApp', []);




foApp.controller('viewerController', function ($scope, $log, dataService) {

       var color = [0xff0000, 0x00ff00, 0x0000ff, 0x111111];


        function getLongLat(str) {
            var pos = str.split(',');
            return {
                lng: parseFloat(pos[0]),
                lat: parseFloat(pos[1]),
            }
        }

        function getLongLatPath(str) {
            var pos = str.split(',');
            var total = pos.length / 2;

            var path = [];
            for (var i = 0; i < total; i += 2) {
                var point = {
                    lng: parseFloat(pos[i]),
                    lat: parseFloat(pos[i+1]),
                }
                path.push(point)
            }
            return path;
        }

        function sphere(lon, lat, radius) {
            var cosLat = Math.cos(lat * Math.PI / 180.0);
            var sinLat = Math.sin(lat * Math.PI / 180.0);
            var cosLon = Math.cos(lon * Math.PI / 180.0);
            var sinLon = Math.sin(lon * Math.PI / 180.0);

            var rad = radius ? radius : 500.0;
            return [rad * cosLat * cosLon, rad * cosLat * sinLon, rad * sinLat];
        }

        var airportDB = fo.db.getEntityDB('spike::airport');
        fo.establishType('spike::airport', {
            id: 'xxx',
            name: 'xxx',
            geo: 'xxx',
            loc: function () {
                return getLongLat(this.geo);
            },
            pos: function () {
                return sphere(this.loc.lng, this.loc.lat, 490);
            },
            label: function () { return this.name; },
            group: 1,
        });

        var airplaneDB = fo.db.getEntityDB('spike::airplane');
        fo.establishType('spike::airplane', {
            id: 'xxx',
            name: 'xxx',
            geo: 'xxx',
            geoPath: 'xxx',
            loc: function () {
                return getLongLat(this.geo);
            },
            pos: function () {
                return sphere(this.loc.lng, this.loc.lat, 490);
            },
            label: function () { return this.name; },
            group: 1,

        });


        function createFlightObject(item) {

            var depart = {
                id: new String(item.dprtr_lctn_id),
                name: item.dprtr_arprt,
                geo: item.dprtr_arprt_geo_pnt_strng,
            };

            var portFrom = airportDB.establishInstance(depart, item.dprtr_lctn_id);
 
            var arrive = {
                id: new String(item.arrvl_lctn_id),
                name: item.arrvl_arprt,
                geo: item.arrvl_arprt_geo_pnt_strng,
            };

            var portTo = airportDB.establishInstance(arrive, item.arrvl_lctn_id);

            var plane = {
                id: item.arcrft_id,
                name: item.flght_nbr,
                geo: item.crrnt_lctn_pnt_strng,
                geoPath: item.crrnt_pth_strng,
            };

            var flight = airplaneDB.establishInstance(plane, item.arcrft_id);

            var rel = fo.establishLink(flight, 'departsAirport|hasDepartures', portFrom);
            var rel = fo.establishLink(flight, 'arrivesAirport|hasArrivals', portTo);

        }


        var url = '../mock/sampleFlights.json';

        dataService.getData(url).then(function (result) {

            var list = result.items.slice(0, 10);

            list.forEach(createFlightObject);

            var nodeList = [].concat(airportDB.items).concat(airplaneDB.items);
            var edgeList = [];
            airplaneDB.items.forEach(function (plane) {
                edgeList.push({
                    from: plane.departsAirport.pluck('id')[0],
                    to: plane.id,
                });
                edgeList.push({
                    to: plane.arrivesAirport.pluck('id')[0],
                    from: plane.id,
                });
            })


            fo.publish('loaded', [nodeList, edgeList]);

            function drawAgain () {

                var nodeList = [].concat(airportDB.items).concat(airplaneDB.items);
                var nodes = new vis.DataSet(nodeList);

                var edgeList = [];
                airplaneDB.items.forEach(function (plane) {
                    edgeList.push({
                        from: plane.departsAirport.pluck('id')[0],
                        to: plane.id,
                    });
                    edgeList.push({
                        to: plane.arrivesAirport.pluck('id')[0],
                        from: plane.id,
                    });
                })

                // create an array with edges
                var edges = new vis.DataSet(edgeList);

                // create a network
                var container = document.getElementById('mynetwork');
                var data = {
                    nodes: nodes,
                    edges: edges
                };
                var options = {};
                var network = new vis.Network(container, data, options);



            };





        }, function (reason) {
        });

    // create an array with nodes
        //var nodes = new vis.DataSet([
        //  { id: 1, label: 'Node 1' },
        //  { id: 2, label: 'Node 2' },
        //  { id: 3, label: 'Node 3' },
        //  { id: 4, label: 'Node 4' },
        //  { id: 5, label: 'Node 5' }
        //]);

});