/// <reference path="../../jasmine-2.0.0/jasmine.js" />

describe("Foundry: dto", function () {

    beforeEach(function() {
        fo.establishType('spike::dto', {
            width: 20,
            height: 30,
            area: function area() { return this.width * this.height; },
        }, fo.makeDTO);


    });

    afterEach(function () {
        fo.removeType('spike::dto');
    });

    it("should be able to make a DTO", function () {
        var obj = fo.makeDTO({
            name: 'steve',
            birthDate: new Date(1958, 9, 22),
            age: function () {
                return Date.now() - this.birthDate;
            }
        })

        expect(obj.name).toBeDefined();
        expect(obj.birthDate).toBeDefined();
        expect(obj.age).toBeDefined();

    });

    it("should be able to save properties as JSON", function () {
        var obj = fo.makeDTO({
            name: 'steve',
            birthDate: new Date(1958, 9, 22),
            age: function () {
                return Date.now() - this.birthDate;
            }
        })

        var json = JSON.stringify(obj);
        var result = JSON.parse(json);

        expect(result.name).toBeDefined();
        expect(result.birthDate).toBeDefined();
        expect(result.age).not.toBeDefined();

    });

    it("should be able to make a DTO from Type", function () {
        var obj = fo.findType('spike::dto').makeDefault();

        expect(obj.width).toBeDefined();
        expect(obj.height).toBeDefined();
        expect(obj.area).toBeDefined();
        expect(obj.owner).not.toBeDefined();

        var instanceType = obj.isInstanceOf(fo.DTO);
        expect(instanceType).toEqual(true);


    });

    it("should be able to make a DTO from extended Type", function () {
        var obj = fo.extendType('spike::dto', {
            owner: 'steve'
        }).makeDefault();

        expect(obj.width).toBeDefined();
        expect(obj.height).toBeDefined();
        expect(obj.area).toBeDefined();
        expect(obj.owner).toBeDefined();

        var instanceType = obj.isInstanceOf(fo.DTO);
        expect(instanceType).toEqual(true);


    });

    it("should be able merge type definition via by second establishType", function () {

        fo.establishType('spike::box', {
            width: { type: 'number', formula: 20 },
        });

        fo.establishType('spike::box', {
            height: { formula: 30 },
        });

        var type = fo.establishType('spike::box', {
            depth: { type: 'number', formula: 30 },
        });

        expect(type).toBeDefined();
        var spec = type.spec;

        expect(spec.height).toBeDefined();
        expect(spec.width).toBeDefined();
        expect(spec.depth).toBeDefined();

    });

});