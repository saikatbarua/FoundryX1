/// <reference path="../../jasmine-2.0.0/jasmine.js" />

describe("Foundry: Entity Storage", function () {

    var specId = 'storage::block';
    var blockDB;
    var blockType;

    var db = fo.db;

    beforeEach(function () {
        blockDB = db.getEntityDB(specId);
        blockDB.idFunction = function (item) { return item.height };

        blockType = fo.establishType(specId, {
            height: 1,
            width: 2,
            baseArea: function () { return this.width * this.height },
            depth: 3,
            side1Area: function () { return this.width * this.depth },
            side2Area: function () { return this.height * this.depth },
            volume: function () { return this.baseArea * this.depth },
            surfaceArea: function () { return 2.0 * this.baseArea + 2.0 * this.side1Area + 2.0 * this.side2Area },
        }, fo.makeComponent);
    });

    afterEach(function () {
        db.deleteEntityDB(specId);
        fo.removeType(specId);
    });

    it("should have the right sided length and the right volume", function() {
        var height = 1;
        var width = 2;
        var depth = 3;        
        

        var block = blockDB.establishInstance({
            height: height,
            width: width,
            depth: depth,
        });

        expect(block.height).toEqual(height);
        expect(block.width).toEqual(width);
        expect(block.depth).toEqual(depth);

        expect(block.baseArea).toEqual(height * width);
        expect(block.side1Area).toEqual(width * depth);
        expect(block.side2Area).toEqual(height * depth);
        expect(block.volume).toEqual(height * depth * width);

        block.height = height = 3;
        expect(block.height).toEqual(height);
        expect(block.volume).toEqual(height * depth * width);

    });

    function createBlocks(count) {

        for (var i = 1; i <= count; i++) {
            //call new so that item is stored in dictionary
            var block = blockDB.establishInstance({
                height: i,
                width: i,
                depth: i,
            });
        };
    }

    it("should fill a dictionary with 20 items that are unique", function () {
        var dict = db.getEntityDB(specId);

        var total = 20;
        createBlocks(total);
        var hash = db.getEntityDBLookup(specId);

        var list1 = db.getEntityDBKeys(specId);
        expect(list1.length).toEqual(total);

        var list = fo.tools.asArray(hash)
        expect(list.length).toEqual(total);

        createBlocks(total);
        var list2 = db.getEntityDBKeys(specId);
        expect(list2.length).toEqual(total);


        //because uniquness constraint forces no new items to be created
        //the results should be the same
        for (var i = 0; i < list1.length; i++) {
            var b1 = list1[i];
            var b2 = list2[i];
            expect(b1 === b2).toBe(true);
        }
    });

    it("should be able to delete dictionary", function () {

        var total = 20;
        createBlocks(total);

        db.deleteEntityDB(specId);
        var list3 = db.getEntityDBAsArray(specId);
        expect(list3.length).toEqual(0);


    });

    it("should be able to save dictionary to isolated storage", function () {

        var total = 20;
        createBlocks(total);

        var success = db.saveAllEntityDB(specId);
        expect(success).toEqual(true);

        db.deleteEntityDB(specId);


    });

    it("should be able to restore dictionary to isolated storage", function () {

        db.deleteEntityDB(specId);

        var success = db.restoreAllEntityDB(specId);
        expect(success).toEqual(true);


        var total = 20;
        var list1 = db.getEntityDBAsArray(specId);
        expect(list1.length).toEqual(total);
    });

    it("should be able get dictionary as an array", function () {

        var total = 20;
        createBlocks(total);


        var total = 20;
        var list1 = db.getEntityDBAsArray(specId);
        expect(list1.length).toEqual(total);
    });

  
});