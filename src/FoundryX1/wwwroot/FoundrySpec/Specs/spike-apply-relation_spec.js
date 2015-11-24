

describe("Foundry: relationships", function () {

    var right = 'spike::ToRight|spike::ToWrong';
    var righty = 'spike::ToRight';

    var left = 'spike::ToLeft|spike::ToRight';
    var lefty = 'spike::ToLefty|spike::ToRight';

    beforeEach(function () {
        fo.establishRelationship(left);
        fo.establishRelationship(lefty);
        fo.establishRelationship(right);
        fo.establishRelationship(righty);
    });

    afterEach(function () {
        fo.removeRelationship(left);
        fo.removeRelationship(lefty);
        fo.removeRelationship(right);
        fo.removeRelationship(righty);
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

    it("should be able to apply a relation", function () {
        var obj1 = fo.makeNode();
        expect(obj1.myType).toBeDefined();

        var obj2 = fo.makeNode();
        expect(obj2.myType).toBeDefined();

        fo.relate(left, obj1, obj2);

        expect(obj1.ToLeft.first).toEqual(obj2);
        expect(obj2.ToRight.first).toEqual(obj1);
    });

    it("should be able to apply a simular relation left lefty", function () {
        var obj1 = fo.makeNode();
        expect(obj1.myType).toBeDefined();

        var obj2 = fo.makeNode();
        expect(obj2.myType).toBeDefined();

        var obj3 = fo.makeNode();
        expect(obj3.myType).toBeDefined();

        fo.relate(left, obj1, obj2);
        fo.relate(lefty, obj1, obj3);

        expect(obj1.ToLeft.first).toEqual(obj2);
        expect(obj1.ToLefty.first).toEqual(obj3);
        expect(obj2.ToRight.first).toEqual(obj1);
    });

    it("should be able to apply a simular relation right righty", function () {
        var obj1 = fo.makeNode();
        expect(obj1.myType).toBeDefined();

        var obj2 = fo.makeNode();
        expect(obj2.myType).toBeDefined();

        var obj3 = fo.makeNode();
        expect(obj3.myType).toBeDefined();

        fo.relate(right, obj1, obj2);
        fo.relate(righty, obj1, obj3);

        expect(obj1.ToRight.first).toEqual(obj2);
        expect(obj1.ToRight.last).toEqual(obj3);
        expect(obj2.ToWrong.first).toEqual(obj1);
    });
});