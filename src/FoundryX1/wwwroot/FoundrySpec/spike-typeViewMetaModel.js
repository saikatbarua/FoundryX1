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