


(function (app, fo, tools, undefined) {

    var locationDB = fo.db.getEntityDB('VaaS::geoLocation');
    fo.establishType('VaaS::geoLocation', {
        latitude: 0,
        longitude: 0,
        altitude: 0,
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

    var nodeDB = fo.db.getEntityDB('VaaS::node');
    fo.establishType('VaaS::node', {
        dateTimeUtc: new Date(),
        place: {},
    });


    // angular service directive
    app.service('ontologyLocationService', function () {
        this.locationDB = locationDB;
        this.placeDB = placeDB;
        this.nodeDB = nodeDB;

 

    });

})(foApp, Foundry, Foundry.tools);