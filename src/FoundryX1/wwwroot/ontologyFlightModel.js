/// <reference path="foundry/foundry.core.listops.js" />
/// <reference path="foundry/foundry.core.entitydb.js" />
/// <reference path="foundry/foundry.core.tools.js" />


(function (app, fo, tools, geoCalc, undefined) {

    Date.prototype.diffToMinutes = function (dt) {
        if (this > dt) {
            return Math.abs(this - dt) / 60000;
        }
        return -Math.abs(this - dt) / 60000;
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

        var path = [];
        for (var i = 0; i < pos.length; i += 2) {
            var point = {
                lng: parseFloat(pos[i]),
                lat: parseFloat(pos[i + 1]),
            }
            path.push(point)
        }
        return path;
    }

    function getLatLongPath(str) {
        var pos = str.split(',');

        var path = [];
        for (var i = 0; i < pos.length; i += 2) {
            var point = {
                lng: parseFloat(pos[i + 1]),
                lat: parseFloat(pos[i]),
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

 
    var airportDB = fo.db.getEntityDB('VaaS::airport');
    fo.establishType('VaaS::airport', {
        id: '-1',
        iataCode: '',
        icaoCode: '',
        faaCode: '',
        name: '',
        timeZone: '',
        geoLocation: { longitude: 0, latitude: 0},

        latitude: function () {
            return this.geoLocation.latitude;
        },
        longitude: function () {
            return this.geoLocation.longitude;
        },
        pos: function () {
            return sphere(this.longitude, this.latitude, 490);
        },
        departCount: function () {
            return this.hasDepartures ? this.hasDepartures.memberCount() : 0;
        },
        arrivalCount: function () {
            return this.hasArrivals ? this.hasArrivals.memberCount() : 0;
        },
        total: function () {
            return this.departCount + this.arrivalCount;
        }
     });

    var flightDB = fo.db.getEntityDB('VaaS::flight');
    fo.establishType('VaaS::flight', {
        id: '-1',
        aircraftId: '',
        equipment: '',
        flightNumber: '',
        geoLocation: function() {
            if (this.currentStatus) {
                return this.currentStatus.geoLocation;
            }
            return { longitude: 0, latitude: 0, altitude: 0 };
        },

        latitude: function () {
            return this.geoLocation.latitude || this.position[1];
        },
        longitude: function () {
            return this.geoLocation.longitude || this.position[0];
        },
        pos: function () {
            return sphere(this.longitude, this.latitude, 490);
        },


        currentHeading: function () {
            return (this.currentStatus && this.currentStatus.heading) | this.bearing;
        },

        currentAltitude: function () { return this.geoLocation.altitude; },
        name: function () {
            return '{0} ({1})'.format(this.aircraftId, this.equipment);
        },

        startPosition: function () {
            var port = this.departsAirport && this.departsAirport.first
            return port ? [port.longitude, port.latitude] : [0, 0];
        },

        endPosition: function () {
            var port = this.arrivesAirport && this.arrivesAirport.first
            return port ? [port.longitude, port.latitude] : [0, 0];
        },
        flightGroup: function () {
            if (this.percentComplete <= 0) {
                return 'not departed';
            }
            if (this.percentComplete >= 1) {
                return 'has arrived';
            }
            return 'enroute';
        },
        start: function () {
            return geoCalc.makeLatLon(this.startPosition[1], this.startPosition[0]);
        },
        end: function () {
            return geoCalc.makeLatLon(this.endPosition[1], this.endPosition[0]);
        },
        departureTimeUtc : new Date(),
        currentTime : new Date(),
        arrivalTimeUtc: new Date(),

        timeTillArrivalInMinutes: function () {
            return this.arrivalTimeUtc && this.currentTime ? this.arrivalTimeUtc.diffToMinutes(this.currentTime) : 0;
        },
        timeTillDepartureInMinutes: function () {
            return this.departureTimeUtc && this.currentTime ? this.departureTimeUtc.diffToMinutes(this.currentTime) : 0;
        },
        flightDurationInMinutes: function () {
            return this.arrivalTimeUtc && this.departureTimeUtc ? this.arrivalTimeUtc.diffToMinutes(this.departureTimeUtc) : 0;
        },
        minutesIntoFlight: function () {
            return this.departureTimeUtc && this.currentTime ? this.currentTime.diffToMinutes(this.departureTimeUtc) : 0;
        },
        percentComplete: function () {
            if (this.minutesIntoFlight <= 0) {
                return 0;
            }
            if (this.minutesIntoFlight >= this.flightDurationInMinutes) {
                return 1.0;
            }
            return this.minutesIntoFlight / this.flightDurationInMinutes;
        },

        bearing: function () {
            var dir = this.start.bearingTo(this.end);
            return dir;
        },
        distance: function () {
            var dist = this.start.distanceTo(this.end);
            return parseFloat( dist);
        },

        computedPosition: function () {
            if (this.timeTillDepartureInMinutes > 0) {
                return this.start;
            }
            else if (this.timeTillArrivalInMinutes < 0) {
                return this.end;
            }
            else {
                var point = this.start.destinationPoint(this.bearing, this.distance * this.percentComplete);
                return point;
            }
        },

        position: function () {
            var point = geoCalc.getPosition(this.computedPosition);
            return point;
        },

        route: function () {
            var route = [];
            var distance = this.distance;
            var bearing = this.bearing;
            var stepSize = this.distance / 100;
            var dist = 0;
            while (dist < distance) {
                point = this.start.destinationPoint(bearing, dist);
                var loc = geoCalc.getPosition(point);
                dist += stepSize;
                route.push(loc);
            }
            return route;
        }
 
    }, fo.makeComponent);

    var flightPathDB = fo.db.getEntityDB('VaaS::flightPath');
    var flightPathType = fo.establishType('VaaS::flightPath', {
        pathId: "101",
        pathName: "IAD-LAX",
        //pathPoints: "38.94771, -77.46086, 38.84041, -79.19684, 38.81983, -80.11928, 38.76366, -81.79762, 38.75411, -82.02617, 38.64950, -84.31064, 38.69853, -85.17029, 38.70933, -85.37568, 38.75936, -86.44017, 38.83921, -88.97117, 38.84222, -89.11973, 38.86069, -90.48237, 38.69192, -91.74258, 38.63622, -92.13093, 38.34489, -94.04219, 38.27208, -94.48825, 38.17995, -96.80516, 38.15021, -97.37527, 37.91900, -100.72501, 37.34917, -105.81553, 36.74839, -108.09889, 36.31252, -110.35197, 36.12131, -111.26959, 35.62471, -113.54447, 34.94446, -115.96759, 34.79703, -116.46292, 34.54847, -117.14948, 33.94313, -118.40892",
        pathPoints: "38.94771, -77.46086, 33.94313, -118.40892",
        points: function () {
            var pts = getLatLongPath(this.pathPoints);
            return pts;
        }
    });

    var departs = fo.establishRelationship('spike::departsAirport|spike::hasDepartures');
    var arrives = fo.establishRelationship('spike::arrivesAirport|spike::hasArrivals');


    function createFlightLeg(item) {

        if (item.dprtr_lctn_id == item.arrvl_lctn_id) return;

        var loc = getLongLat(item.dprtr_arprt_geo_pnt_strng);
        var depart = {
            id: item.dprtr_lctn_id,
            name: item.dprtr_arprt,
            latitude: loc.lat,
            longitude: loc.lng,
        };

        var portFrom = airportDB.establishInstance(depart, item.dprtr_lctn_id);

        loc = getLongLat(item.arrvl_arprt_geo_pnt_strng);
        var arrive = {
            id: item.arrvl_lctn_id,
            name: item.arrvl_arprt,
            latitude: loc.lat,
            longitude: loc.lng,
        };

        var portTo = airportDB.establishInstance(arrive, item.arrvl_lctn_id);

        var plane = {
            id: item.arcrft_id,
            name: item.flght_nbr,
            geo: item.crrnt_lctn_pnt_strng,
            geoPath: item.crrnt_pth_strng,
            currentAltitude: 8,

        };

        var flight = flightDB.establishInstance(plane, item.arcrft_id);

        departs.apply(flight, portFrom);
        arrives.apply(flight, portTo);

    }

    function createMockFlightObject(item) {

        var geo = getLongLat(item.departureairportgeo);
        var depart = {
            id: item.departureairportid,
            iataCode: item.departureairportiatacode,
            name: item.departureairport,
            latitude: geo.lat,
            longitude: geo.lng,
        };

        var portFrom = airportDB.establishInstance(depart, depart.id).unique();

        geo = getLongLat(item.arrivalairportgeo);
        var arrive = {
            id: item.arrivalairportid,
            iataCode: item.arrivalairportiatacode,
            name: item.arrivalairport,
            latitude: geo.lat,
            longitude: geo.lng,
        };

        var portTo = airportDB.establishInstance(arrive, arrive.id).unique();



        var plane = {
            id: item.id,
            aircraftid: item.aircraftid,
            conveyanceNumber: item.flightnumber,
            carrierId: item.carrierid,
            airline: item.airline,
            iataCode: item.carrieriatacode,
            icaoCode: item.carriericaocode,
            equipment: item.equipment,
            currentLocationTime: new Date(item.currentlocationtime),
            geo: item.currentlocationgeo,
            currentHeading: item.currentheading,
            currentAltitude: item.currentaltitude,
        };

        var flight = flightDB.establishInstance(plane, item.id).unique();


        var rel = fo.establishLink(flight, 'departsAirport|hasDepartures', portFrom);
        var rel = fo.establishLink(flight, 'arrivesAirport|hasArrivals', portTo);


    }

    function createTripLegs(item) {
        if (!item.departureNode || !item.arrivalNode) {
            return;
        }


        var depart = item.departureNode.location;
        if (!depart) return;


        var arrive = item.arrivalNode.location;
        if (!arrive) return;


        var portFrom = airportDB.establishInstance(depart, depart.id).unique();
        var portTo = airportDB.establishInstance(arrive, arrive.id).unique();


        var flightSpec = {
            id: item.id,
            aircraftId: item.aircraftId,
            equipment: item.equipment,
            currentStatus: item.currentStatus,

            carrier: item.carrier,
            currentTimeUtc: new Date(item.currentStatus.dateTimeUtc),

            arrivalTimeUtc: new Date(item.arrivalNode.dateTimeUtc),
            departureTimeUtc: new Date(item.departureNode.dateTimeUtc),



        };

        var flight = flightDB.establishInstance(flightSpec, item.aircraftId).unique();


        var rel = fo.establishLink(flight, 'departsAirport|hasDepartures', portFrom);
        var rel = fo.establishLink(flight, 'arrivesAirport|hasArrivals', portTo);


    }

    // angular service directive
    app.service('ontologyFlightService', function () {
        this.createMockFlightObject = createMockFlightObject;
        this.createFlightLeg = createFlightLeg;

        this.createTripLegs = createTripLegs;

        this.flightDB = fo.db.getEntityDB('VaaS::flight');
        this.airportDB = fo.db.getEntityDB('VaaS::airport');

    });

})(foApp, Foundry, Foundry.tools, GeoCalc);