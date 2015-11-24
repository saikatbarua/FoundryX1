/// <reference path="../../jasmine-2.0.0/jasmine.js" />

describe("Foundry: meta", function () {

    var metaName = 'spike::rectangle';

    beforeEach(function() {
        fo.meta.establishMetadata(metaName, {
            width: { type: 'number', formula: 20 },
            height: { type: 'number', formula: 30 },
            area: { formula: function area() { return this.width * this.height; } },
        });

        fo.meta.establishMetadata('spike::box', {
            width: { type: 'number', formula: 20 },
            height: { formula: 30 },
            depth: { type: 'number', formula: 30 },
        });
    });

    afterEach(function () {
        fo.meta.removeMetadata(metaName);
    });

    it("should be able to find meta data", function () {
        var meta = fo.meta.findMetadata(metaName);
        expect(meta.height).not.toBeUndefined();
        expect(meta.width).not.toBeUndefined();
        expect(meta.area).not.toBeUndefined();
    });

    it("should be able to remove meta data", function () {
        var meta = fo.meta.findMetadata(metaName);
        expect(meta).not.toBeUndefined();

        fo.meta.removeMetadata(metaName);
        var meta = fo.meta.findMetadata(metaName);
        expect(meta).toBeUndefined();

    });

    it("should be able to be used to create a new Node", function () {
        var meta = fo.meta.findMetadata(metaName);
        expect(meta).toBeDefined();

        var spec = fo.tools.applyOverKeyValue(meta, function (key, value) {
            return value.formula;
        });

        var block = fo.makeNode(spec);
        expect(block.area).toEqual(block.height * block.width);
    });

    it("should be able to get collection based in where clause", function () {
        var found = fo.meta.metadataDictionaryWhere(function (key, value) {
            return value.height && value.height.type && value.height.type.matches('number');
        });
        expect(found[metaName]).toBeDefined();
        expect(found['spike::box']).not.toBeDefined();
    });

    it("should be able to clear all meta data", function () {
        fo.meta.metadataDictionaryClear();
        var meta = fo.meta.findMetadata(metaName);
        expect(meta).not.toBeDefined();
    });


    it("should be able merge meta by second establish", function () {
        fo.meta.metadataDictionaryClear();

        fo.meta.establishMetadata('spike::box', {
            width: { type: 'number', formula: 20 },
        });

        fo.meta.establishMetadata('spike::box', {
            height: { formula: 30 },
        });

        fo.meta.establishMetadata('spike::box', {
            depth: { type: 'number', formula: 30 },
        });

        var meta = fo.meta.findMetadata('spike::box');
        expect(meta).toBeDefined();

        expect(meta.height).toBeDefined();
        expect(meta.width).toBeDefined();
        expect(meta.depth).toBeDefined();

    });


    it("should be able extend meta properties by second establish", function () {
        fo.meta.metadataDictionaryClear();

        fo.meta.establishMetadata('spike::box', {
            width: { type: 'number' },
        });

        fo.meta.establishMetadata('spike::box', {
            width: { formula: 30 },
        });

        fo.meta.establishMetadata('spike::box', {
            width: { formula: 500 },
        });

        var meta = fo.meta.findMetadata('spike::box');
        expect(meta).toBeDefined();

        expect(meta.width).toBeDefined();
        expect(meta.width.type).toBeDefined();
        expect(meta.width.type).toEqual('number');
        expect(meta.width.formula).toBeDefined();
        expect(meta.width.formula).toEqual(500);

    });



});