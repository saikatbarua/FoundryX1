/// <reference path="../../jasmine-2.0.0/jasmine.js" />

describe("Foundry: network", function () {
    var airportDB;
    var airportType;
    var departs;
    var arrives;

    beforeEach(function () {
        airportDB = fo.db.getEntityDB('spike::airport');
        airportType = fo.establishType('spike::airport', {
            myGuid: function myGuid() {
                return this.myName + '::' + fo.tools.generateUUID();
            },
            myName: 'xxx',
        });

        flightDB = fo.db.getEntityDB('spike::flight');
        flightType = fo.establishType('spike::flight', {
            myGuid: function myGuid() {
                return this.myName + '::' + fo.tools.generateUUID();
            },
            myName: 'yyy',
        });

        departs = fo.establishRelationship('spike::departsAirport|spike::hasDepartures');
        arrives = fo.establishRelationship('spike::arrivesAirport|spike::hasArrivals');

    });

    afterEach(function () {
        fo.db.deleteEntityDB('spike::airport');
        fo.db.deleteEntityDB('spike::flight');
        fo.removeType('spike::airport');
        fo.removeType('spike::flight');
    });

    it("should be able to create an airport", function () {
        var lax = airportDB.establishInstance({ myName: 'LAX' });

        expect(lax).toBeDefined();
        expect(lax.myType).toBeDefined();
        expect(lax.myName).toEqual('LAX');
    });

    it("should be able to create an flight", function () {
        var flight = flightDB.establishInstance({ myName: 'AA1357' });

        expect(flight).toBeDefined();
        expect(flight.myType).toBeDefined();
        expect(flight.myName).toEqual('AA1357');
    });

    it("should be able to relate airports flight", function () {
        var flight = flightDB.establishInstance({ myName: 'AA1357' });
        var lax = airportDB.establishInstance({ myName: 'LAX' });
        var jfk = airportDB.establishInstance({ myName: 'JFK' });

        expect(flight).toBeDefined();
        expect(lax).toBeDefined();
        expect(jfk).toBeDefined();

        departs.apply(flight, jfk);

        expect(flight.departsAirport).toBeDefined();
        expect(jfk.hasDepartures).toBeDefined();
    });


    it("should be able to unrelate airports flight", function () {
        var flight = flightDB.establishInstance({ myName: 'AA1357' });
        var lax = airportDB.establishInstance({ myName: 'LAX' });
        var jfk = airportDB.establishInstance({ myName: 'JFK' });

        expect(flight).toBeDefined();
        expect(lax).toBeDefined();
        expect(jfk).toBeDefined();

        departs.apply(flight, jfk);

        expect(flight.departsAirport).toBeDefined();
        expect(jfk.hasDepartures).toBeDefined();

        departs.undo(flight, jfk);

        expect(flight.departsAirport).not.toBeDefined();
        expect(jfk.hasDepartures).not.toBeDefined();


    });

});