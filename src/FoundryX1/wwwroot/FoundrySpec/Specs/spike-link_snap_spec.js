/// <reference path="../../jasmine-2.0.0/jasmine.js" />

describe("Foundry: links and snaps", function () {

    beforeEach(function() {
    });

    afterEach(function () {
    });



    it("should be able to establish a relation and use reference", function () {
        var obj1 = fo.makeNode();
        var obj2 = fo.makeNode();

        fo.establishLink(obj1, 'toRightOf|toLeftOf', obj2);

        expect(obj1.toRightOf.first).toEqual(obj2);
        expect(obj2.toLeftOf.first).toEqual(obj1);

        expect(obj1.toRightOf.last).toEqual(obj2);
        expect(obj2.toLeftOf.last).toEqual(obj1);

        fo.removeLink(obj1, 'toRightOf|toLeftOf', obj2);
        expect(obj1.toRightOf).not.toBeDefined();
        expect(obj2.toLeftOf).not.toBeDefined();
    });


    it("should be able to reference link", function () {
        var obj1 = fo.makeNode();
        var obj2 = fo.makeNode();

        fo.establishLink(obj1, 'toRightOf|toLeftOf', obj2);

        var other2 = obj1.getLink('toRightOf').first;
        var other1 = obj2.getLink('toLeftOf').first;
        expect(other2).toEqual(obj2);
        expect(other1).toEqual(obj1);

        fo.removeLink(obj1, 'toRightOf|toLeftOf', obj2);
        var other2 = obj1.getLink('toRightOf').first;
        var other1 = obj2.getLink('toLeftOf').first;

        expect(other2).not.toBeDefined();
        expect(other1).not.toBeDefined();
    });

    it("should be able to establish snap and use reference", function () {
        var obj1 = fo.makeNode();
        var obj2 = fo.makeNode();

        fo.establishSnap(obj1, 'toRightOf|toLeftOf', obj2);

        expect(obj1.toRightOf).toEqual(obj2);
        expect(obj2.toLeftOf).toEqual(obj1);

        expect(obj1.toRightOf).toEqual(obj2);
        expect(obj2.toLeftOf).toEqual(obj1);

        fo.removeSnap(obj1, 'toRightOf|toLeftOf', obj2);
        expect(obj1.toRightOf).not.toBeDefined();
        expect(obj2.toLeftOf).not.toBeDefined();
    });

    it("should be able to reference snap", function () {
        var obj1 = fo.makeNode();
        var obj2 = fo.makeNode();

        fo.establishSnap(obj1, 'toRightOf|toLeftOf', obj2);

        var other2 = obj1.getSnap('toRightOf');
        var other1 = obj2.getSnap('toLeftOf');
        expect(other2).toEqual(obj2);
        expect(other1).toEqual(obj1);

        fo.removeSnap(obj1, 'toRightOf|toLeftOf', obj2);
        var other2 = obj1.getSnap('toRightOf');
        var other1 = obj2.getSnap('toLeftOf');

        expect(other2.toLeftOf).not.toBeDefined();
        expect(other1.toRightOf).not.toBeDefined();


        expect(other2).toEqual({});
        expect(other1).toEqual({});
    });

});