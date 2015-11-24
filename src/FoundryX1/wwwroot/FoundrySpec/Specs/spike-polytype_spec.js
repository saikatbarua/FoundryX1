
describe("Foundry: PolyType block", function () {
    var blockType;
    var block;


    beforeEach(function() {
        blockType = fo.establishType('spike::block', {
            height: 1,
            width: 2,
            baseArea: function () { return this.width * this.height },
            depth: 3,
            side1Area: function () { return this.width * this.depth },
            side2Area: function () { return this.height * this.depth },
            volume: function () { return this.baseArea * this.depth },
            surfaceArea: function () { return 2.0 * this.baseArea + 2.0 * this.side1Area + 2.0 * this.side2Area },
        });
    });


    afterEach(function () {
        fo.removeType('spike::block');
    });

    it("should create a new Instance", function () {
        var block = blockType.newInstance();

        expect(block.height).toEqual(1);
        expect(block.width).toEqual(2);
        expect(block.depth).toEqual(3);
        expect(block.volume).toEqual(1 * 2 * 3);
    });

    it("should just create", function () {
        var block = blockType.create();

        expect(block.height).toEqual(1);
        expect(block.width).toEqual(2);
        expect(block.depth).toEqual(3);
        expect(block.volume).toEqual(1 * 2 * 3);
    });

    it("should just create with change", function () {
        var block = blockType.create({
            properties: {
                height: function () { return this.depth;},
                width: function () { return this.depth; },
                isNodeInstance: function () {
                    return this.isInstanceOf(fo.Node);
                },
            }
        });

        expect(block.height).toEqual(3);
        expect(block.width).toEqual(3);
        expect(block.depth).toEqual(3);
        expect(block.volume).toEqual(3 * 3 * 3);
        expect(block.isNodeInstance).toEqual(true);

        block.height = 2;
        expect(block.volume).toEqual(3 * 2 * 3);

        block.height = function () { return this.depth * this.depth };
        expect(block.volume).toEqual(3 * 3 * 3 * 3);

    });


    it("should just create with change and reset base class", function () {
        var block = blockType.create({
            properties: {
                height: function () { return this.depth; },
                width: function () { return this.depth; },
                isComponentInstance: function () {
                    return this.isInstanceOf(fo.Component);
                },
            },
            construct: fo.makeComponent,
        });

        expect(block.height).toEqual(3);
        expect(block.width).toEqual(3);
        expect(block.depth).toEqual(3);
        expect(block.volume).toEqual(3 * 3 * 3);
        expect(block.isComponentInstance).toEqual(true);

        block.height = 2;
        expect(block.volume).toEqual(3 * 2 * 3);

        block.height = function () { return this.depth * this.depth };
        expect(block.volume).toEqual(3 * 3 * 3 * 3);

    });


});