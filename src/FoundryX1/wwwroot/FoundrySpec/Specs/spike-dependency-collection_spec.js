﻿/// <reference path="../../jasmine-2.0.0/jasmine.js" />


describe("Foundry: Dependency Collection", function () {
    var block;


    beforeEach(function () {
        var blockSpec = {
            A: fo.makeCollection(),
            B: 2,
            C: function () {
                return this.A.count + this.B
            },
        };
        block = fo.makeComponent(blockSpec);
    });

    it("should have valid defaults", function () {
        expect(fo.tools.isaComponent(block)).toBe(true);
    });

    it("should have vaid properties (Direct Reference)", function () {
        var manager = block.propertyManager();
        var collections = block.collectionManager();
        expect(fo.tools.isaCollection(collections.A)).toBe(true);
        expect(fo.tools.isaProperty(manager.B)).toBe(true);
        expect(fo.tools.isaProperty(manager.C)).toBe(true);
    });

    it("should have valid default values", function () {
        expect(fo.tools.isaCollection(block.A)).toBe(true);
        expect(block.B).toEqual(2);
        expect(block.C).toEqual(2);
    });

    it("should be able to add a new item and smash the count", function () {
        expect(fo.tools.isaCollection(block.A)).toBe(true);
        var manager = block.propertyManager();
        block.A.push("Hello")
        expect(block.B).toEqual(2);
        expect(manager.C.status).toBeUndefined();
        expect(block.C).toEqual(3);
    });

    it("should be able to add a new list and smash the count", function () {
        expect(fo.tools.isaCollection(block.A)).toBe(true);
        var manager = block.propertyManager();
        block.A.addList([1, 2, 3, 4, 5, "Hello"])
        expect(block.B).toEqual(2);
        expect(manager.C.status).toBeUndefined();
        expect(block.C).toEqual(8);
    });


    it("should be able clear list count", function () {
        expect(fo.tools.isaCollection(block.A)).toBe(true);
        var manager = block.propertyManager();
        block.A.addList([1, 2, 3, 4, 5, "Hello"])
        expect(block.A.counter.status).toBeUndefined();
        expect(block.C).toEqual(8);

        block.A.clear();
        expect(manager.C.status).toBeUndefined();
        expect(block.C).toEqual(2);

        expect(block.A.counter.status).toBe('calculated');
    });


    it("should be able not smash when second item is added or removed", function () {
        expect(fo.tools.isaCollection(block.A)).toBe(true);
        var manager = block.propertyManager();
        block.A.addList([1, 2, 3]);
        expect(block.A.counter.status).toBeUndefined();
        expect(manager.C.status).toBeUndefined();

        block.A.addList([4, 5, 6]);
        expect(block.A.counter.status).toBeUndefined();
        expect(manager.C.status).toBeUndefined();

        expect(block.C).toEqual(8);
        expect(manager.C.status).toBe('calculated');

        expect(block.A.sumOver()).toEqual(21);
    });


    //it("should have recompute", function () {
    //    expect(block.A).toEqual(3);
    //    block.A = 2;
    //    expect(block.E).toEqual(0);
    //});

    //it("should have track dependencies", function () {
    //    expect(block.E).toEqual(-1);
    //    expect(block._A.thisInformsTheseValues.length).toBe(2);
    //    expect(block._E.thisValueDependsOn.length).toBe(2);

    //    block.A = 2;
    //    expect(block._A.thisInformsTheseValues.length).toBe(0);
    //    expect(block._E.thisValueDependsOn.length).toBe(0);

    //    block.E;
    //    expect(block._A.thisInformsTheseValues.length).toBe(2);
    //    expect(block._E.thisValueDependsOn.length).toBe(2);
    //});

    //it("should have track and allow for overrides", function () {
    //    expect(block.E).toEqual(-1);
    //    expect(block._A.thisInformsTheseValues.length).toBe(2);
    //    expect(block._D.thisInformsTheseValues.length).toBe(1);
    //    expect(block._D.thisValueDependsOn.length).toBe(2);
    //    expect(block._E.thisValueDependsOn.length).toBe(2);

    //    block.D = 7;
    //    expect(block._A.thisInformsTheseValues.length).toBe(1);
    //    expect(block._E.thisValueDependsOn.length).toBe(1);
    //    expect(block._D.thisValueDependsOn.length).toBe(0);

    //    block.E;
    //    expect(block._A.thisInformsTheseValues.length).toBe(1);
    //    expect(block._D.thisInformsTheseValues.length).toBe(1);
    //    expect(block._D.thisValueDependsOn.length).toBe(0);
    //    expect(block._E.thisValueDependsOn.length).toBe(2);
    //    expect(block.E).toEqual(1);
    //});

    //it("should have track and allow overrides to smash", function () {
    //    expect(block.E).toEqual(-1);

    //    block.D = 7;
    //    expect(block._A.thisInformsTheseValues.length).toBe(1);
    //    expect(block._E.thisValueDependsOn.length).toBe(1);
    //    expect(block._D.thisValueDependsOn.length).toBe(0);

    //    block.E;
    //    expect(block._A.thisInformsTheseValues.length).toBe(1);
    //    expect(block._D.thisInformsTheseValues.length).toBe(1);
    //    expect(block._D.thisValueDependsOn.length).toBe(0);
    //    expect(block._E.thisValueDependsOn.length).toBe(2);
    //    expect(block.E).toEqual(1);

    //    block._D.smash();
    //    expect(block._A.thisInformsTheseValues.length).toBe(1);
    //    expect(block._D.thisValueDependsOn.length).toBe(0);
    //    expect(block._D.thisInformsTheseValues.length).toBe(0);
    //    expect(block._E.thisValueDependsOn.length).toBe(1);


    //    block.E;
    //    expect(block._D.thisInformsTheseValues.length).toBe(1);
    //    expect(block._D.thisValueDependsOn.length).toBe(2);
    //    expect(block._E.thisValueDependsOn.length).toBe(2);
    //    expect(block.E).toEqual(-1);
    //});
});