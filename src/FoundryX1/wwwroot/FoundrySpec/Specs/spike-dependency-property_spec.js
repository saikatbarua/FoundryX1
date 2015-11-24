/// <reference path="../../jasmine-2.0.0/jasmine.js" />


describe("Foundry: Dependency Value", function () {
    var block;


    beforeEach(function () {
        var blockSpec = {
            A: 3,
            B: 2,
            C: function () { return this.A * this.B },
            D: function () { return this.A + this.B },
            E: function () { return this.D - this.C },
        };
        block = fo.makeComponent(blockSpec);
    });

    it("should have valid defaults", function () {
        expect(fo.tools.isaComponent(block)).toBe(true);
    });

    it("should have vaid properties (Direct Reference)", function () {
        expect(fo.tools.isaProperty(block._managed.A)).toBe(true);
        expect(fo.tools.isaProperty(block._managed.B)).toBe(true);
        expect(fo.tools.isaProperty(block._managed.C)).toBe(true);
        expect(fo.tools.isaProperty(block._managed.D)).toBe(true);
        expect(fo.tools.isaProperty(block._managed.E)).toBe(true);
    });

    it("should have valid default values", function () {
        expect(block.A).toEqual(3);
        expect(block.B).toEqual(2);
        expect(block.C).toEqual(6);
        expect(block.D).toEqual(5);
        expect(block.E).toEqual(-1);
    });

    it("should have recompute", function () {
        expect(block.A).toEqual(3);
        block.A = 2;
        expect(block.E).toEqual(0);
    });

    it("should have track dependencies", function () {
        expect(block.E).toEqual(-1);
        expect(block._managed.A.thisInformsTheseValues.length).toBe(2);
        expect(block._managed.E.thisValueDependsOn.length).toBe(2);

        block.A = 2;
        expect(block._managed.A.thisInformsTheseValues.length).toBe(0);
        expect(block._managed.E.thisValueDependsOn.length).toBe(0);

        block.E;
        expect(block._managed.A.thisInformsTheseValues.length).toBe(2);
        expect(block._managed.E.thisValueDependsOn.length).toBe(2);
    });

    it("should have track and allow for overrides", function () {
        expect(block.E).toEqual(-1);
        expect(block._managed.A.thisInformsTheseValues.length).toBe(2);
        expect(block._managed.D.thisInformsTheseValues.length).toBe(1);
        expect(block._managed.D.thisValueDependsOn.length).toBe(2);
        expect(block._managed.E.thisValueDependsOn.length).toBe(2);

        block.D = 7;
        expect(block._managed.A.thisInformsTheseValues.length).toBe(1);
        expect(block._managed.E.thisValueDependsOn.length).toBe(1);
        expect(block._managed.D.thisValueDependsOn.length).toBe(0);

        block.E;
        expect(block._managed.A.thisInformsTheseValues.length).toBe(1);
        expect(block._managed.D.thisInformsTheseValues.length).toBe(1);
        expect(block._managed.D.thisValueDependsOn.length).toBe(0);
        expect(block._managed.E.thisValueDependsOn.length).toBe(2);
        expect(block.E).toEqual(1);
    });

    it("should have track and allow overrides to smash", function () {
        expect(block.E).toEqual(-1);

        block.D = 7;
        expect(block._managed.A.thisInformsTheseValues.length).toBe(1);
        expect(block._managed.E.thisValueDependsOn.length).toBe(1);
        expect(block._managed.D.thisValueDependsOn.length).toBe(0);

        block.E;
        expect(block._managed.A.thisInformsTheseValues.length).toBe(1);
        expect(block._managed.D.thisInformsTheseValues.length).toBe(1);
        expect(block._managed.D.thisValueDependsOn.length).toBe(0);
        expect(block._managed.E.thisValueDependsOn.length).toBe(2);
        expect(block.E).toEqual(1);

        block._managed.D.smash();
        expect(block._managed.A.thisInformsTheseValues.length).toBe(1);
        expect(block._managed.D.thisValueDependsOn.length).toBe(0);
        expect(block._managed.D.thisInformsTheseValues.length).toBe(0);
        expect(block._managed.E.thisValueDependsOn.length).toBe(1);


        block.E;
        expect(block._managed.D.thisInformsTheseValues.length).toBe(1);
        expect(block._managed.D.thisValueDependsOn.length).toBe(2);
        expect(block._managed.E.thisValueDependsOn.length).toBe(2);
        expect(block.E).toEqual(-1);
    });
});