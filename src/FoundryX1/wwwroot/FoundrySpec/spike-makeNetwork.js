
var foApp = angular.module('foApp', []);
// angular service directive
foApp.service('dataService', function ($http, $q) {
    this.getData = function (url) {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: url,
        }).
     success(function (data, status, headers, config) {
         deferred.resolve(data)
     }).
     error(function (data, status, headers, config) {
         deferred.reject(data);
     });
        return deferred.promise;
    }
});


(function (app, fo, undefined) {
    app.controller('workspaceController', function (dataService, $rootScope) {

        this.title = 'Foundry Version ' + fo.version;
        this.spike = 'makeNetwork';

        var spec = {
            myGuid: function myGuid() {
                return this.myName + '::' + fo.tools.generateUUID();
            }
        }

 
 


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
                    lat: parseFloat(pos[i + 1]),
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
            myGuid: function myGuid() {
                return this.myName + '::' + fo.tools.generateUUID();
            },            
            id: 'xxx',
            myName: 'xxx',
            geo: 'xxx',
            loc: function () {
                return getLongLat(this.geo);
            },
            pos: function () {
                return sphere(this.loc.lng, this.loc.lat, 490);
            },
        });

        var airplaneDB = fo.db.getEntityDB('spike::airplane');
        fo.establishType('spike::airplane', {
            myGuid: function myGuid() {
                return this.myName + '::' + fo.tools.generateUUID();
            },            
            id: 'xxx',
            myName: 'xxx',
            geo: 'xxx',
            geoPath: 'xxx',
            loc: function () {
                return getLongLat(this.geo);
            },
            pos: function () {
                return sphere(this.loc.lng, this.loc.lat, 490);
            },
        });





        function createFlightObject(item) {

            var depart = {
                id: item.dprtr_lctn_id,
                myName: item.dprtr_arprt,
                geo: item.dprtr_arprt_geo_pnt_strng,
            };

            var portFrom = airportDB.establishInstance(depart, item.dprtr_lctn_id);

            var arrive = {
                id: item.arrvl_lctn_id,
                myName: item.arrvl_arprt,
                geo: item.arrvl_arprt_geo_pnt_strng,
            };

            var portTo = airportDB.establishInstance(arrive, item.arrvl_lctn_id);

            var plane = {
                id: item.arcrft_id,
                myName: item.flght_nbr,
                geo: item.crrnt_lctn_pnt_strng,
                //geoPath: item.crrnt_pth_strng,
            };

            var flight = airplaneDB.establishInstance(plane, item.arcrft_id);

            var rel = fo.establishLink(flight, 'departsAirport|hasDepartures', portFrom);
            var rel = fo.establishLink(flight, 'arrivesAirport|hasArrivals', portTo);


            //var departs = fo.establishRelationship('spike::departsAirport|spike::hasDepartures');
            //var arrives = fo.establishRelationship('spike::arrivesAirport|spike::hasArrivals');

            //var x = departs.relate(flight, portFrom);
            //var y = arrives.relate(flight, portTo);


            return flight;


        }



        var url = '../mock/sampleFlights.json';
        var self = this;

        dataService.getData(url).then(function (result) {

            var list = result.items.slice(0, 50); 

            list.forEach(createFlightObject)
            self.answer1 = fo.tools.stringify(airportDB.items, undefined, 3);
            self.answer2 = fo.tools.stringify(airplaneDB.items, undefined, 3);
            
            $rootScope.apply();
        }, function (reason) {
            alert('error ' + reason);
        });




    });

}(foApp, Foundry));