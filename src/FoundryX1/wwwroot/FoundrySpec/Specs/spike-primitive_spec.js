/// <reference path="../../jasmine-2.0.0/jasmine.js" />

describe("Foundry: primitives", function () {

    beforeEach(function() {
    });

    afterEach(function () {
    });

    it("should be able to call new fo.DTO", function () {
        var obj = new fo.DTO();
        expect(obj.myType).toBeDefined();

        var instanceType = obj.isInstanceOf(fo.DTO);
        expect(instanceType).toEqual(true);
    });

    it("should be able to call fo.makeDTO", function () {
        var obj = fo.makeDTO();
        expect(obj.myType).toBeDefined();

        var instanceType = obj.isInstanceOf(fo.DTO);
        expect(instanceType).toEqual(true);
    });


    it("should be able to call new fo.Node", function () {
        var obj = new fo.Node();
        expect(obj.myType).toBeDefined();

        var instanceType = obj.isInstanceOf(fo.Node);
        expect(instanceType).toEqual(true);
    });

    it("should be able to call fo.makeNode", function () {
        var obj = fo.makeNode();
        expect(obj.myType).toBeDefined();

        var instanceType = obj.isInstanceOf(fo.Node);
        expect(instanceType).toEqual(true);
    });


    it("should be able to call new fo.Link", function () {
        var obj = new fo.Link();
        expect(obj.myType).toBeDefined();

        var instanceType = obj.isInstanceOf(fo.Link);
        expect(instanceType).toEqual(true);

        instanceType = obj.isInstanceOf(fo.Node);
        expect(instanceType).toEqual(true);
    });

    it("should be able to call fo.makeLink", function () {
        var obj = fo.makeLink();
        expect(obj.myType).toBeDefined();

        var instanceType = obj.isInstanceOf(fo.Link);
        expect(instanceType).toEqual(true);

        instanceType = obj.isInstanceOf(fo.Node);
        expect(instanceType).toEqual(true);
    });

    it("should be able to create 1 way snap", function () {
        var obj1 = fo.makeNode();
        expect(obj1.myType).toBeDefined();

        var obj2 = fo.makeNode();
        expect(obj2.myType).toBeDefined();

        var result = fo.establishSnap(obj1, 'toRightOf|toLeftOf', obj2);
        expect(result.relation).toBeDefined();
        expect(result.inverse).toBeDefined();

        expect(obj1.toRightOf).toEqual(obj2);
        expect(obj2.toLeftOf).toEqual(obj1);

    });

    it("should be able to remove 1 way snap", function () {
        var obj1 = fo.makeNode();
        expect(obj1.myType).toBeDefined();

        var obj2 = fo.makeNode();
        expect(obj2.myType).toBeDefined();

        fo.establishSnap(obj1, 'toRightOf|toLeftOf', obj2);

        expect(obj1.toRightOf).toEqual(obj2);
        expect(obj2.toLeftOf).toEqual(obj1);

        fo.removeSnap(obj1, 'toRightOf|toLeftOf', obj2);
        expect(obj1.toRightOf).not.toBeDefined();
        expect(obj2.toLeftOf).not.toBeDefined();

    });



    it("should be able to create 1 way relation", function () {
        var obj1 = fo.makeNode();
        expect(obj1.myType).toBeDefined();

        var obj2 = fo.makeNode();
        expect(obj2.myType).toBeDefined();

        var result = fo.establishLink(obj1, 'hasObject', obj2);
        expect(result.relation).toBeDefined();
        expect(result.inverse).not.toBeDefined();


        var instanceType = result.relation.isInstanceOf(fo.Link);
        expect(instanceType).toEqual(true);
    });

    it("should be able to remove 1 way relation", function () {
        var obj1 = fo.makeNode();
        expect(obj1.myType).toBeDefined();

        var obj2 = fo.makeNode();
        expect(obj2.myType).toBeDefined();

        var result = fo.makeRelation(obj1, 'hasObject', obj2);
        expect(result).toBeDefined();
        expect(result.isInstanceOf(fo.Link)).toEqual(true);

        var result = fo.unMakeRelation(obj1, 'hasObject', obj2);
        expect(result).toBeDefined();
        expect(result.isInstanceOf(fo.Link)).toEqual(true);
    });

    it("should be able to create 2 way relation", function () {
        var obj1 = fo.makeNode();
        expect(obj1.myType).toBeDefined();

        var obj2 = fo.makeNode();
        expect(obj2.myType).toBeDefined();

        var result = fo.establishLink(obj1, 'ToLeft|ToRight', obj2);
        expect(result.relation).toBeDefined();
        expect(result.inverse).toBeDefined();


        var instanceType = result.relation.isInstanceOf(fo.Link);
        expect(instanceType).toEqual(true);
        instanceType = result.inverse.isInstanceOf(fo.Link);
        expect(instanceType).toEqual(true);
    });

    it("should be able to call new fo.Component", function () {
        var obj = new fo.Component();
        expect(obj.myType).toBeDefined();

        var instanceType = obj.isInstanceOf(fo.Component);
        expect(instanceType).toEqual(true);

        instanceType = obj.isInstanceOf(fo.Node);
        expect(instanceType).toEqual(true);
    });

    it("should be able to call fo.makeComponent", function () {
        var obj = fo.makeComponent();
        expect(obj.myType).toBeDefined();

        var instanceType = obj.isInstanceOf(fo.Component);
        expect(instanceType).toEqual(true);

        instanceType = obj.isInstanceOf(fo.Node);
        expect(instanceType).toEqual(true);
    });

    it("should be a component", function () {
        var parent = fo.makeComponent();
        var child = fo.makeComponent();


        var obj = fo.makeComponent({ myName: 'steve' }, [child], parent);

        expect(fo.tools.isaComponent(obj)).toBe(true);

        expect(obj.myName).toEqual('steve');
        expect(obj.myParent).toEqual(parent);

        expect(obj.subcomponents).toBeDefined();
        expect(obj.subcomponents.count).toEqual(1);
        expect(obj.subcomponents.item(0)).toEqual(child);
    });

});