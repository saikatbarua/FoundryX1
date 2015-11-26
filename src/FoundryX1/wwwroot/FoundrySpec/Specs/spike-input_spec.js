/// <reference path="../../jasmine-2.0.0/jasmine.js" />

describe("Foundry: input", function () {
    var blockType;


    beforeEach(function () {
        blockType = fo.establishType('spike::block', {
            width: 10,
            height: 20,
            depth: 40,
            area: function () { return this.width * this.height; },
            volume: function () { return this.width * this.height * this.depth; },
        });

        fo.meta.establishMetadata('spike::block', {
            width: { userEdit: true,  type: 'number', formula: 20 },
            length: { userEdit: true, type: 'number', formula: 20 },
            height: { formula: 30 },
            depth: { type: 'number', formula: 30 },
        });

    });

    afterEach(function () {
        fo.db.deleteEntityDB('spike::block');
        fo.removeType('spike::block');
        fo.meta.removeMetadata('spike::block');
    });

    it("should be able to create a block", function () {
        var obj = blockType.newInstance();

        expect(obj).toBeDefined();
        expect(obj.myType).toBeDefined();
        expect(obj.width).toEqual(10);
        expect(obj.volume).toEqual(10 * 20 * 40);
    });

    it("should be able to get inputs", function () {
        var obj = blockType.newInstance();

        var props = obj.userInputs();
        expect(props).toBeDefined();
        expect(props.length).toEqual(2);
        expect(props.width).toBeDefined();
    });


});