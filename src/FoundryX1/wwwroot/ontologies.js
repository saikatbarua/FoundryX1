


(function (app, fo, tools, undefined) {

    fo.establishType('cad::block', {
        width: 10,
        height: 20,
        depth: 40,
        area: function () { return this.width * this.height; },
        volume: function () { return this.width * this.height * this.depth; },
    }, fo.makeComponent);

    fo.meta.establishMetadata('cad::block', {
        width: { userEdit: true, type: 'number', formula: 20 },
        height: { userEdit: true, type: 'number', formula: 30 },
        depth: { userEdit: true, type: 'number', formula: 30 },
    });

   fo.establishType('cad::plane', {
        width: 10,
        height: 20,
        depth: 40,
    }, fo.makeComponent);


    // angular service directive
   app.service('ontologyCADService', function (render3DService) {
        
       var self = this;


        var list = fo.typeDictionaryWhere(function (key,value) {
            return key.startsWith('cad::');
        });

        tools.forEachKeyValue(list, function (key, value) {
            var name = tools.getType(value);


            self[name] = value;
        });

        return self;
    });

})(foApp, Foundry, Foundry.tools);
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

        start: function () {
            return geoCalc.makeLatLon(this.startPosition[1], this.startPosition[0]);
        },
        end: function () {
            return geoCalc.makeLatLon(this.endPosition[1], this.endPosition[0]);
        },

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
            return dist;
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
        this.createTripLegs = createTripLegs;

        this.flightDB = fo.db.getEntityDB('VaaS::flight');
        this.airportDB = fo.db.getEntityDB('VaaS::airport');

    });

})(foApp, Foundry, Foundry.tools, GeoCalc);



(function (app, fo, tools, undefined) {

    var locationDB = fo.db.getEntityDB('VaaS::geoLocation');
    fo.establishType('VaaS::geoLocation', {
        latitude: 0,
        longitude: 0,
        altitude: 0,
    });


    fo.meta.establishMetadata('VaaS::geoLocation', {
        latitude: { userEdit: true, type: 'number' },
        longitude: { userEdit: true, type: 'number' },
        altitude: { userEdit: true, type: 'number' },
    });


    var placeDB = fo.db.getEntityDB('VaaS::place');
    fo.establishType('VaaS::place', {
        id: 1,
        name: '',
        geoLocation: {},

        address: '',
        city: '',
        county: '',
        zipCode: '',
    });

    fo.meta.establishMetadata('VaaS::place', {
        name: { userEdit: true, type: 'string' },
        address: { userEdit: true, type: 'string' },
        city: { userEdit: true, type: 'string' },
        state: { userEdit: true, type: 'string' },
        countyCode: { userEdit: true, type: 'string' },
        zipCode: { userEdit: true, type: 'string' },
        geoLocation: { userEdit: true, type: 'VaaS::place' },
    });

    var nodeDB = fo.db.getEntityDB('VaaS::node');
    fo.establishType('VaaS::node', {
        dateTimeUtc: new Date(),
        place: {},
        description: '',
    });

    fo.meta.establishMetadata('VaaS::node', {
        dateTimeUtc: { userEdit: true, type: 'datetime', sortOrder: 1 },
        place: { userEdit: true, type: 'VaaS::node', sortOrder: 10 },
        description: { userEdit: true, type: 'text', sortOrder: 2 },
    });


    // angular service directive
    app.service('ontologyLocationService', function () {
        this.locationDB = locationDB;
        this.placeDB = placeDB;
        this.nodeDB = nodeDB;

 

    });

})(foApp, Foundry, Foundry.tools);
(function (app, fo, tools, meta, undefined) {

    meta.establishMetadata('VaaS::airport', {
        id: {},
        iataCode: { ex: "IAD" },
        icaoCode: { ex: "KIAD" },
        faaCode: { ex: "IAD" },
        name: { ex: "WASHINGTON DULLES INTL" },
        timeZone: { ex: "America/New_York" },
        longitude: { ex: -77.4626686996784 },
        latitude: { ex: 38.9451065300027 },
        elevation: { ex: 313 }
    });

    meta.establishMetadata('VaaS::airport.services', {
        getAirports: {},
        getAirportsById: {},
    });

    meta.establishMetadata('VaaS::flight', {
        id: {},
        aircraftId: {ex: 'AA1357' },
        conveyanceNumber: { ex: '1357' },
        carrierCode: { ex: 'AA' },
        equipment: { ex: '747', make: 'boeing', model: '747-200' },


    });

    meta.establishMetadata('VaaS::TripLeg-1', {
        id: {},  //trip id
        aircraftId: { ex: 'AA1357' },
        conveyanceNumber: { ex: '1357' },
        carrierCode: { ex: 'AA' },
        equipment: { ex: '747', make: 'boeing', model: '747-200' },

        departureIataCode: { ex: 'JFL' },
        departureLocationId: { ex: '1111' },
        departureLocationLatitude: { ex: 38.9451065300027 },
        departureLocationLongitude: { ex: -77.4626686996784 },
        departureDateTimeUtc: { ex: '2015-11-02T16:40:10.904Z' },

        arrivalAirportIataCode: { ex: 'JFL' },
        arrivalAirport: { ex: "WASHINGTON DULLES INTL" },
        arrivalLocationId: { ex: '1111' },
        arrivalLocationLatitude: { ex: 38.9451065300027 },
        arrivalLocationLongitude: { ex: -77.4626686996784 },
        arrivalScheduledDateTime: { ex: '2015-11-02T16:40:10.904Z' },
        arrivalDateTimeUtc: { ex: '2015-11-02T16:40:10.904Z' },

    });

    meta.establishMetadata('VaaS::TripLeg-2', {
        id: {},  //trip id

        equipmentId: { ex: 'AA1357' },

        carrierId: { ex: '1145' },
        carrierCode: { ex: 'AA' },
        equipment: { ex: '747', make: 'boeing', model: '747-200' },

        departureDateTimeUtc: { ex: '2015-11-02T16:40:10.904Z' },
        departureLocation: {
            id: { ex: '1111' },
            iataCode: { ex: 'JFL' },
            latitude: { ex: 38.9451065300027 },
            longitude: { ex: -77.4626686996784 },
        },

        arrivalDateTimeUtc: { ex: '2015-11-02T16:40:10.904Z' },
        arrivalLocation: {
            id: { ex: '11551' },
            name: { ex: "WASHINGTON DULLES INTL" },
            iataCode: { ex: 'JFL' },
            latitude: { ex: 38.9451065300027 },
            longitude: { ex: -77.4626686996784 },
        }

    });

    // angular service directive
    app.service('ontologyMetaService', function () {


    });

})(foApp, Foundry, Foundry.tools, Foundry.meta);
/// <reference path="foundry/foundry.core.listops.js" />
/// <reference path="foundry/foundry.core.entitydb.js" />
/// <reference path="foundry/foundry.core.tools.js" />


(function (app, fo, undefined) {

    var tools = fo.tools;

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

    // convert the positions from a lat, lon to a position on a sphere.
    function latLongToVector3(lat, lon, radius, heigth) {
        var phi = (lat) * Math.PI / 180;
        var theta = (lon - 180) * Math.PI / 180;

        var x = -(radius + heigth) * Math.cos(phi) * Math.cos(theta);
        var y = (radius + heigth) * Math.sin(phi);
        var z = (radius + heigth) * Math.cos(phi) * Math.sin(theta);

        return [x, y, z];
    }
 
    var airportDB = fo.db.getEntityDB('VaaS::airport');
    fo.establishType('VaaS::airport', {
        id: '1',
        iataCode: 'xxx',
        name: 'xxx',
        geo: '0,0',
        loc: function () {
            return getLongLat(this.geo);
        },
        latitude: function () {
            return this.loc.lat;
        },
        longitude: function () {
            return this.loc.lng;
        },
        pos: function () {
            return latLongToVector3(this.loc.lng, this.loc.lat, 490);
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
        id: 'xxx',
        flightNumber: 'xxx',
        carrierId: 'cc',
        airline: 'cc',

        iataCode: 'xxx',
        icaoCode: 'xxx',
        currentLocationtime: new Date(),
        equipment: '',
        geo: 'xxx',
        currentHeading: 'xxx',
        currentAltitude: 'yyy',
        name: function () {
            return this.id;
        },
        loc: function () {
            return getLongLat(this.geo);
        },
        latitude: function () {
            return this.loc.lat;
        },
        longitude: function () {
            return this.loc.lng;
        },
        pos: function () {
            return sphere(this.loc.lng, this.loc.lat, 490);
        },
    });

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



    function createFlightObject(item) {

        var loc = getLongLat(item.departureairportgeo);
        var depart = {
            id: item.departureairportid,
            iataCode: item.departureairportiatacode,
            name: item.departureairport,
            latitude: loc.lat,
            longitude: loc.lng,
        };

        var portFrom = airportDB.establishInstance(depart, depart.id).unique();

        loc = getLongLat(item.arrivalairportgeo);
        var arrive = {
            id: item.arrivalairportid,
            iataCode: item.arrivalairportiatacode,
            name: item.arrivalairport,
            latitude: loc.lat,
            longitude: loc.lng,
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
            currentAltitude: item.currentaltitude || 0,
        };

        var flight = flightDB.establishInstance(plane, item.id).unique();


        var rel = fo.establishLink(flight, 'departsAirport|hasDepartures', portFrom);
        var rel = fo.establishLink(flight, 'arrivesAirport|hasArrivals', portTo);


    }

    function createFlightObject1(item) {

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


        //var rel = fo.establishLink(flight, 'departsAirport|hasDepartures', portFrom);
        //var rel = fo.establishLink(flight, 'arrivesAirport|hasArrivals', portTo);


        //http://www.smartjava.org/content/render-open-data-3d-world-globe-threejs


    }



    var AORpointDB = fo.db.getEntityDB('VaaS::AORpoint');
    fo.establishType('VaaS::AORpoint', {
        region: "Buffalo",
        latitude: 42.003105734,
        longitude: -79.761659647,
        sortOrder: 2,
        position: function () {
            return [this.longitude, this.latitude];
        }
    });

    var AORRegionDB = fo.db.getEntityDB('VaaS::AORRegion');
    fo.establishType('VaaS::AORRegion', {
        region: "Buffalo",
        members: [],
        pointList: function () {
            var pnts = this.members.map(function (item) {
                var point = {
                    lng: item.longitude,
                    lat: item.latitude,
                    order: item.sortOrder,
                }
                return point;
            });
            return pnts;
        },
    });

    function createAORPoint(item) {

        var point = {
            region: item.ofo_rgn,
            latitude: item.latitude,
            longitude: item.longitude,
            sortOrder: item.sort_order,
            polygonId: item.poly_id,
        };

        AORpointDB.establishInstance(point);
    }

    function createRegions() {

        var groups = fo.listOps.applyGrouping(AORpointDB.items, 'region');
        tools.forEachKeyValue(groups, function (key, value) {
            var pollygons = fo.listOps.applyGrouping(value, 'polygonId');
            tools.forEachKeyValue(pollygons, function (id, points) {
                var sorted = fo.listOps.applySort(points, 'sortOrder(a)');
                var xName =  key + id;
                var region = {
                    region: xName,
                    members: sorted,
                };
                AORRegionDB.establishInstance(region, xName);
            });
        });
        return AORRegionDB.items;
    }

    var locationDB = fo.db.getEntityDB('VaaS::location');
    fo.establishType('VaaS::location', {
        id: 1,
        name: '',
        longitude: 0,
        latitude: 0,
        address: '',
        city: '',
        county: '',
        zipCode: '',
        comment: '',
        label: function () {
            return this.station + '  ' + this.address;
        },
     });

    function createRegionalOffices(item) {

        var location = {
            station: item.STA_NAME,
            stationCode: item.STA_NAME,
            stationType: item.STA_TYPE,

            sector: item.SEC_NAME,
            sectorCode: item.SEC_CODE,
            portCode: item.STA_CODE,

            address: item.PHYS_ADDR,
            city: item.CITY_NAME,
            county: item.CNTY_NAME,
            stateCode: item.STATE_ABBR,
            zipCode: item.PHYS_ZIP,

            latitude: parseFloat(item.LATITUDE),
            longitude: parseFloat(item.LONGITUDE),

            comment: item.COMMENT_,
        };
        return locationDB.establishInstance(location);

    }

    // angular service directive
    app.service('ontologyService', function () {
        this.createFlightObject = createFlightObject;
        this.createFlightObject1 = createFlightObject1;
        this.createAORPoint = createAORPoint;
        this.createRegions = createRegions;
        this.createRegionalOffices = createRegionalOffices;

        this.flightDB = fo.db.getEntityDB('VaaS::flight');
        this.airportDB = fo.db.getEntityDB('VaaS::airport');
        this.AORPointDB = fo.db.getEntityDB('VaaS::AORpoint');
        this.locationDB = fo.db.getEntityDB('VaaS::location');

        this.flightPath = function () {
            return flightPathType.newInstance();
        }

    });

})(foApp, Foundry);

var foApp = angular.module('foApp', []);

(function (app, fo, undefined) {

    app.filter('prettyJSON', function () {
        return function (obj) {
            if (fo.tools.isTyped(obj)) {
                return fo.tools.stringify(obj, undefined, 3);
            }
            return JSON.stringify(obj, undefined, 3);
        };
    });

    //app.filter('toImage', function () {
    //    return function (obj) {
    //        if (!obj) return;
    //        var icon = obj.type.myType.replace('::', '');
    //        icon = icon.toLowerCase();
    //        return "Pictures/" + icon + ".png";
    //    };
    //});

    app.controller('workspaceController', function () {
        var types = fo.getAllTypes(true);
        this.types = types;

        var relations = fo.getAllRelations(true);
        this.relations = relations;

        var meta = fo.meta.getAllTypes(true);
        this.meta = meta;

        this.title = 'Type View';
    });

}(foApp, Foundry));