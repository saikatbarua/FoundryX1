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