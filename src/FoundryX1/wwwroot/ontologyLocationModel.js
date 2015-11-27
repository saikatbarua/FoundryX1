


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
        dateTimeUtc: { userEdit: true, type: 'datetime' },
        place: { userEdit: true, type: 'VaaS::node' },
        description: { userEdit: true, type: 'string' },
    });


    // angular service directive
    app.service('ontologyLocationService', function () {
        this.locationDB = locationDB;
        this.placeDB = placeDB;
        this.nodeDB = nodeDB;

 

    });

})(foApp, Foundry, Foundry.tools);