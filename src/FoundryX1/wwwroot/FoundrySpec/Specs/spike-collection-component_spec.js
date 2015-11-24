/// <reference path="../../jasmine-2.0.0/jasmine.js" />



describe("Foundry: Collections in Components", function () {
    var obj;

    //this works correctly and creates a new collection every thime
    beforeEach(function () {

        obj = fo.makeComponent({
            people: fo.makeCollection(),
        });
        return obj;
    });

    it("should map into managed properties", function () {
        var coll = obj.people;
        expect(fo.tools.isaCollection(coll)).toBe(true);
    });

    it("should have the owner of the host property", function () {
        var coll = obj.people;
        expect(coll.myParent).toEqual(obj);
    });


    it("should have count == 0 if empty", function () {
        expect(obj.people.count).toEqual(0);
        expect(obj.people.isEmpty()).toEqual(true);
    });

    it("should compute isEmpty and isNotEmpty correctly", function () {
        expect(obj.people.count).toEqual(0);
        expect(obj.people.isEmpty()).toEqual(true);
        expect(obj.people.isNotEmpty()).toEqual(false);

        var item = "Orange";
        obj.people.push(item);

        expect(obj.people.count).toEqual(1);
        expect(obj.people.isEmpty()).toEqual(false);
        expect(obj.people.isNotEmpty()).toEqual(true);

        obj.people.clear();
        expect(obj.people.count).toEqual(0);
        expect(obj.people.isEmpty()).toEqual(true);
        expect(obj.people.isNotEmpty()).toEqual(false);
    });

    it("should the right count on demand when adding items", function () {
        expect(obj.people.isEmpty()).toEqual(true);
        expect(obj.people.count).toEqual(0);

        //fo.trace.reportDependencyNetwork(obj);

        var item = "Orange";
        obj.people.push(item);

        expect(obj.people.count).toEqual(1);

        var item = "Apple";
        obj.people.push(item);

        expect(obj.people.count).toEqual(2);
    });

    it("should the right count on demand when removing items", function () {
        expect(obj.people.isEmpty()).toEqual(true);
        expect(obj.people.count).toEqual(0);

        var item = "Orange";
        obj.people.push(item);

        var item = "Apple";
        obj.people.push(item);

        var item = obj.people.elements[1];
        obj.people.remove(item);

        expect(obj.people.count).toEqual(1);

        var item = obj.people.elements[0];
        obj.people.remove(item);

        expect(obj.people.count).toEqual(0);

    });

    it("should be able to add a list of numbers", function () {
        expect(obj.people.length).toEqual(0);
        expect(obj.people.isEmpty()).toEqual(true);
        expect(obj.people.isNotEmpty()).toEqual(false);

        obj.people.add(10);
        expect(obj.people.sumOver()).toEqual(10);

        obj.people.add(20);
        expect(obj.people.sumOver()).toEqual(30);
        expect(obj.people.length).toEqual(2);

        obj.people.add([2, 5, 4, 1]);

        expect(obj.people.length).toEqual(6);
        expect(obj.people.count).toEqual(6);
        expect(obj.people.sumOver()).toEqual(42);
    });

});