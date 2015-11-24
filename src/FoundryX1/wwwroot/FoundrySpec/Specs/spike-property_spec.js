

describe("Foundry: Property Calculation", function () {
    var obj;
    var firstname= "George";
    var lastname = "Washington";

    var nameSpec = {
        fname: "George",
        lname: "Washington",
        fullname: function () {
            return this.fname + ' ' + this.lname
        },
    };

    beforeEach(function() {
        obj = fo.makeComponent(nameSpec);
        var manager = obj.propertyManager();

    });

    it("should be able to compute", function() {
        expect(obj.fname).toEqual(firstname);
        expect(obj.lname).toEqual(lastname);
        expect(obj.fullname).toEqual(firstname + ' ' + lastname);
    });

    it("store managed properties in the component", function () {
        expect(obj.fname).toBeDefined();
        expect(obj.lname).toBeDefined();
        expect(obj.fullname).toBeDefined();

        var manager = obj.propertyManager();
        expect(manager.fname).toBeDefined();
        expect(manager.lname).toBeDefined();
        expect(manager.fullname).toBeDefined();
    });

    it("change the status of the calculation when computed", function () {
        var manager = obj.propertyManager();
        expect(manager.fullname.status).toBeUndefined();
        expect(obj.fullname).toBeDefined();
        expect(manager.fullname.status).toBeDefined();
        expect(manager.fullname.status).toEqual('calculated');
    });

    it("should smash to undefined and recompute on demand", function () {
        var manager = obj.propertyManager();
        expect(obj.fullname).toBeDefined();
        expect(manager.fullname.status).toEqual('calculated');

        var differentlastname = "Plimpton";
        obj.lname = differentlastname;
        expect(manager.fullname.status).toBeUndefined();

        expect(obj.fullname).toEqual(firstname + ' ' + differentlastname);
        expect(manager.fullname.status).toEqual('calculated');
    });

    it("should allow the computed to be overridden and recompute on smashing", function () {
        var manager = obj.propertyManager();
        expect(obj.fullname).toEqual(firstname + ' ' + lastname);

        var newName = "Bill Clinton";
        obj.fullname = newName;
        expect(obj.fullname).toEqual(newName);

        var differentlastname = "Plimpton";
        obj.lname = differentlastname;
        expect(obj.fullname).toEqual(newName);

        obj.getManagedProperty('fullname').smash();
        expect(manager.fullname.status).toBeUndefined();

        expect(obj.fullname).toEqual(firstname + ' ' + differentlastname);


    });

});