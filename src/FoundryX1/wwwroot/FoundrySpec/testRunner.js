
describe("Foundry: Block Node", function () {
    var block;

    var blockSpec = {
        height: 1,
        width: 2,
        baseArea: function () { return this.width * this.height },
        depth: 3,
        side1Area: function () { return this.width * this.depth },
        side2Area: function () { return this.height * this.depth },
        volume: function () { return this.baseArea * this.depth },
        surfaceArea: function () { return 2.0 * this.baseArea + 2.0 * this.side1Area + 2.0 * this.side2Area },
    };

    beforeEach(function() {
        block = fo.makeNode(blockSpec);
    });

    it("should should have the right sided base", function() {
        expect(block.height).toEqual(1);
        expect(block.width).toEqual(2);
        expect(block.depth).toEqual(3);
    });

    it("should compute the right volume", function () {
        var height = 1;
        var width = 2;
        var depth = 3;

        expect(block.baseArea).toEqual(height * width);
        expect(block.side1Area).toEqual(width * depth);
        expect(block.side2Area).toEqual(height * depth);
    });

    it("should compute the right surfaceArea", function () {
        expect(block.volume).toEqual(1 * 2 * 3);
    });

    it("should recompute when the values change", function () {
        var height = 10;
        var width = 2;
        var depth = 3;

        block.height = height;
        expect(block.volume).toEqual(height * width * depth);
        expect(block.baseArea).toEqual(height * width);
        expect(block.side1Area).toEqual(width * depth);
        expect(block.side2Area).toEqual(height * depth);


        height = 5;
        block.height = height;
        expect(block.volume).toEqual(height * width * depth);
        expect(block.baseArea).toEqual(height * width);
        expect(block.side1Area).toEqual(width * depth);
        expect(block.side2Area).toEqual(height * depth);

        //fo.trace.reportDependencyNetwork(block);

    });

});

describe("Foundry: Block DTO Perf", function () {
    var block;

    var blockSpec = {
        height: 1,
        width: 2,
        baseArea: function () { return this.width * this.height },
        depth: 3,
        side1Area: function () { return this.width * this.depth },
        side2Area: function () { return this.height * this.depth },
        volume: function () { return this.baseArea * this.depth },
        surfaceArea: function () { return 2.0 * this.baseArea + 2.0 * this.side1Area + 2.0 * this.side2Area },
    };

    beforeEach(function () {
        //var myTime = performance.now();
        //console.info("start at =" + myTime / 1000)
    });

    //http://www.html5rocks.com/en/tutorials/webperformance/usertiming/      
    afterEach(function () {
        var measures = window.performance.getEntriesByType('measure');
        measures.forEach(function (item) {
            console.info(item.name + " duration =" + item.duration / 1000)
        });

        performance.clearMarks();
        performance.clearMeasures();
    });

    var total = 3;

    it("DTO make 3", function () {

        performance.mark('start');
        var list = [];
        for (var i = 0; i < total; i++) {
            var block = fo.makeDTO(blockSpec);
            list.push(block);
        }
        performance.mark('end');

        expect(list.length).toEqual(total);

        performance.measure('DTO make ' + total, 'start', 'end');

    });

    it("DTO make 300", function () {

        total = total * 100;
        performance.mark('start');
        var list = [];
        for (var i = 0; i < total; i++) {
            var block = fo.makeDTO(blockSpec);
            list.push(block);
        }
        performance.mark('end');

        expect(list.length).toEqual(total);

        performance.measure('DTO make ' + total, 'start', 'end');

    });

    it("DTO make 30000", function () {

        total = total * 100;
        performance.mark('start');
        var list = [];
        for (var i = 0; i < total; i++) {
            var block = fo.makeDTO(blockSpec);
            list.push(block);
        }
        performance.mark('end');

        expect(list.length).toEqual(total);

        performance.measure('DTO make ' + total, 'start', 'end');

    });
 
});

describe("Foundry: Block Node Perf", function () {
    var block;

    var blockSpec = {
        height: 1,
        width: 2,
        baseArea: function () { return this.width * this.height },
        depth: 3,
        side1Area: function () { return this.width * this.depth },
        side2Area: function () { return this.height * this.depth },
        volume: function () { return this.baseArea * this.depth },
        surfaceArea: function () { return 2.0 * this.baseArea + 2.0 * this.side1Area + 2.0 * this.side2Area },
    };

    beforeEach(function () {
        //var myTime = performance.now();
        //console.info("start at =" + myTime / 1000)
    });

    //http://www.html5rocks.com/en/tutorials/webperformance/usertiming/      
    afterEach(function () {
        var measures = window.performance.getEntriesByType('measure');
        measures.forEach(function (item) {
            console.info(item.name + " duration =" + item.duration / 1000)
        });

        performance.clearMarks();
        performance.clearMeasures();
    });

    var total = 3;

    it("Node make 3", function () {

        performance.mark('start');
        var list = [];
        for (var i = 0; i < total; i++) {
            var block = fo.makeNode(blockSpec);
            list.push(block);
        }
        performance.mark('end');

        expect(list.length).toEqual(total);

        performance.measure('Node make ' + total, 'start', 'end');

    });

    it("Node make 300", function () {

        total = total * 100;
        performance.mark('start');
        var list = [];
        for (var i = 0; i < total; i++) {
            var block = fo.makeNode(blockSpec);
            list.push(block);
        }
        performance.mark('end');

        expect(list.length).toEqual(total);

        performance.measure('Node make ' + total, 'start', 'end');

    });

    it("Node make 30000", function () {

        total = total * 100;
        performance.mark('start');
        var list = [];
        for (var i = 0; i < total; i++) {
            var block = fo.makeNode(blockSpec);
            list.push(block);
        }
        performance.mark('end');

        expect(list.length).toEqual(total);

        performance.measure('Node make ' + total, 'start', 'end');

    });

});


describe("Foundry: Block Component Perf", function () {
    var block;

    var blockSpec = {
        height: 1,
        width: 2,
        baseArea: function () { return this.width * this.height },
        depth: 3,
        side1Area: function () { return this.width * this.depth },
        side2Area: function () { return this.height * this.depth },
        volume: function () { return this.baseArea * this.depth },
        surfaceArea: function () { return 2.0 * this.baseArea + 2.0 * this.side1Area + 2.0 * this.side2Area },
    };

    beforeEach(function () {
        //var myTime = performance.now();
        //console.info("start at =" + myTime / 1000)
    });

    //http://www.html5rocks.com/en/tutorials/webperformance/usertiming/      
    afterEach(function () {
        var measures = window.performance.getEntriesByType('measure');
        measures.forEach(function (item) {
            console.info(item.name + " duration =" + item.duration / 1000)
        });

        performance.clearMarks();
        performance.clearMeasures();
    });

    var total = 3;

    it("Component make 3", function () {

        performance.mark('start');
        var list = [];
        for (var i = 0; i < total; i++) {
            var block = fo.makeComponent(blockSpec);
            list.push(block);
        }
        performance.mark('end');

        expect(list.length).toEqual(total);

        performance.measure('Component make ' + total, 'start', 'end');

    });

    it("Component make 300", function () {

        total = total * 100;
        performance.mark('start');
        var list = [];
        for (var i = 0; i < total; i++) {
            var block = fo.makeComponent(blockSpec);
            list.push(block);
        }
        performance.mark('end');

        expect(list.length).toEqual(total);

        performance.measure('Component make ' + total, 'start', 'end');

    });

    it("Component make 30000", function () {

        total = total * 100;
        performance.mark('start');
        var list = [];
        for (var i = 0; i < total; i++) {
            var block = fo.makeComponent(blockSpec);
            list.push(block);
        }
        performance.mark('end');

        expect(list.length).toEqual(total);

        performance.measure('Component make ' + total, 'start', 'end');

    });

});


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
/// <reference path="../../jasmine-2.0.0/jasmine.js" />


describe("Foundry: Array as a property", function () {
     var obj;

    beforeEach(function () {
        var x = {
            items: [1, 2, 3, 4, 5],
            stringItems: ['washington', 'bush',  'addams', 'jefferson', 'bush' ]
        };
        obj = fo.makeComponent(x);
        return obj;
    });

    it("should be a components", function () {
        expect(fo.tools.isaComponent(obj)).toBe(true);

        expect(Object.keys(obj.propertyManager()).length).toEqual(2);
        expect(obj.subcomponents).not.toBeDefined();
    });

    it("have managed items list", function () {
        expect(obj.items).toBeDefined();
        expect(obj.items.isEmpty()).toBe(false);
        expect(obj.items.length).toEqual(5);

        expect(fo.tools.isArray(obj.items)).toBe(true);
    });

    it("can map", function () {
        var list = obj.items.map(function (item) {
            return item + 1;
        });

        expect(list.count).toBeUndefined();
        expect(list.length).toEqual(5);
    });

    it("can reduce", function () {
        var result = obj.items.reduce(function (a, b) {
            return a += b;
        }, 0);

        expect(result).toEqual(15);
        expect(obj.items.length).toEqual(5);
    });

    it("should be able to compute min", function () {
        expect(obj.items.min()).toEqual(1);
    });

    it("should be able to compute max", function () {
        expect(obj.items.max()).toEqual(5);
    });

    it("should be able to find index of first", function () {
        var index = obj.items.indexOfFirst(function (item) {
            return item == 3;
        });

        expect(index).toEqual(2);

        var index = obj.stringItems.indexOfFirst(function (item) {
            return item == 'bush';
        });

        expect(index).toEqual(1);

    });

    it("should be able to find itemByIndex", function () {
        expect(obj.items.itemByIndex(2)).toEqual(3);
        expect(obj.stringItems.itemByIndex(2)).toEqual('addams');

        expect(obj.stringItems.itemByIndex(12)).toBeUndefined();
        expect(obj.stringItems.itemByIndex(-2)).toBeUndefined();
    });

    it("should be able to compute distinctItems", function () {
        expect(obj.items.distinctItems().length).toEqual(5);
        expect(obj.stringItems.distinctItems().length).toEqual(4);
    });

    it("should be able to addNoDupe", function () {
        expect(obj.items.distinctItems().length).toEqual(5);

        obj.items.addNoDupe(4)
        expect(obj.items.length).toEqual(5);

        obj.items.addNoDupe(40)
        expect(obj.items.length).toEqual(6);

        obj.items.addNoDupe(3)
        expect(obj.items.length).toEqual(6);
    });
});


describe("ASync Loader", function () {

    beforeEach(function() {
    });

    it("should be able to compute", function() {
    });


});
/// <reference path="../../jasmine-2.0.0/jasmine.js" />



describe("Foundry: Collections in Components", function () {
    var obj;

    //this works correctly and creates a new collection every thime
    beforeEach(function () {

        obj = fo.makeComponent({
            people: fo.makeCollection(),
        });
        return obj;
    });

    it("should map into managed properties", function () {
        var coll = obj.people;
        expect(fo.tools.isaCollection(coll)).toBe(true);
    });

    it("should have the owner of the host property", function () {
        var coll = obj.people;
        expect(coll.myParent).toEqual(obj);
    });


    it("should have count == 0 if empty", function () {
        expect(obj.people.count).toEqual(0);
        expect(obj.people.isEmpty()).toEqual(true);
    });

    it("should compute isEmpty and isNotEmpty correctly", function () {
        expect(obj.people.count).toEqual(0);
        expect(obj.people.isEmpty()).toEqual(true);
        expect(obj.people.isNotEmpty()).toEqual(false);

        var item = "Orange";
        obj.people.push(item);

        expect(obj.people.count).toEqual(1);
        expect(obj.people.isEmpty()).toEqual(false);
        expect(obj.people.isNotEmpty()).toEqual(true);

        obj.people.clear();
        expect(obj.people.count).toEqual(0);
        expect(obj.people.isEmpty()).toEqual(true);
        expect(obj.people.isNotEmpty()).toEqual(false);
    });

    it("should the right count on demand when adding items", function () {
        expect(obj.people.isEmpty()).toEqual(true);
        expect(obj.people.count).toEqual(0);

        //fo.trace.reportDependencyNetwork(obj);

        var item = "Orange";
        obj.people.push(item);

        expect(obj.people.count).toEqual(1);

        var item = "Apple";
        obj.people.push(item);

        expect(obj.people.count).toEqual(2);
    });

    it("should the right count on demand when removing items", function () {
        expect(obj.people.isEmpty()).toEqual(true);
        expect(obj.people.count).toEqual(0);

        var item = "Orange";
        obj.people.push(item);

        var item = "Apple";
        obj.people.push(item);

        var item = obj.people.elements[1];
        obj.people.remove(item);

        expect(obj.people.count).toEqual(1);

        var item = obj.people.elements[0];
        obj.people.remove(item);

        expect(obj.people.count).toEqual(0);

    });

    it("should be able to add a list of numbers", function () {
        expect(obj.people.length).toEqual(0);
        expect(obj.people.isEmpty()).toEqual(true);
        expect(obj.people.isNotEmpty()).toEqual(false);

        obj.people.add(10);
        expect(obj.people.sumOver()).toEqual(10);

        obj.people.add(20);
        expect(obj.people.sumOver()).toEqual(30);
        expect(obj.people.length).toEqual(2);

        obj.people.add([2, 5, 4, 1]);

        expect(obj.people.length).toEqual(6);
        expect(obj.people.count).toEqual(6);
        expect(obj.people.sumOver()).toEqual(42);
    });

});
/// <reference path="../../jasmine-2.0.0/jasmine.js" />


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
/// <reference path="../../jasmine-2.0.0/jasmine.js" />


describe("Foundry: Collections Dynamic", function () {
    var obj;

    //this works correctly
    beforeEach(function () {
        obj = fo.makeComponent({});
        return obj;
    });


    it("should be able to create collection dynamically", function () {
        obj.establishCollection('Connections')
        expect(fo.tools.isaCollection(obj.Connections)).toBe(true);
    });

    it("should function normally", function () {
        var col = obj.establishCollection('Connections');
        for (var i = 0; i < 10; i++) {
            col.push(fo.makeComponent({ x: i }));
        }
        expect(fo.tools.isaCollection(obj.Connections)).toBe(true);
        expect(col.count).toEqual(10);
        expect(col.isEmpty()).toEqual(false);
        expect(col.isNotEmpty()).toEqual(true);

    });

    it("should be able to initialize", function () {
        var col = [];
        for (var i = 0; i < 10; i++) {
            col.push(fo.makeComponent({ x: i }));
        }

        obj.establishCollection('Connections', col);

        expect(fo.tools.isaCollection(obj.Connections)).toBe(true);
        expect(obj.Connections.count).toEqual(10);
        expect(obj.Connections.isEmpty()).toEqual(false);
        expect(obj.Connections.isNotEmpty()).toEqual(true);

    });


    it("should be able to initialize a custom mapping as a property", function () {
        var col = [];
        for (var i = 0; i < 10; i++) {
            col.push(fo.makeComponent({ x: i }));
        }

        var spec = {
            itemsGE5: function () {
                var result = this.filter(function (item) {
                    return item.x >= 5;
                });
                return result;
            }
        }

        obj.establishCollection('Connections', col, spec);

        expect(fo.tools.isaCollection(obj.Connections)).toBe(true);
        expect(obj.Connections.itemsGE5).toBeDefined();
        expect(obj.Connections.itemsGE5.count).toEqual(5);
    });


    it("should be able to initialize, compute a custom mapping as a property, then add and see value change", function () {
        var col = [];
        for (var i = 0; i < 10; i++) {
            col.push(fo.makeComponent({ x: i }));
        }

        var spec = {
            itemsGE5: function () {
                var result = this.filter(function (item) {
                    return item.x >= 5;
                });
                return result;
            }
        }

        obj.establishCollection('Connections', col, spec);

        expect(fo.tools.isaCollection(obj.Connections)).toBe(true);
        expect(obj.Connections.itemsGE5.count).toEqual(5);

        var col = obj.Connections;
        for (var i = 0; i < 10; i++) {
            col.push(fo.makeComponent({ x: i }));
        }

        expect(obj.Connections.itemsGE5.count).toEqual(10);

    });



});
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
/// <reference path="../../jasmine-2.0.0/jasmine.js" />


describe("Foundry: Entity Filter and Sort Test", function () {

    var defEvent = fo.establishType('Entity::Event', {
        createDate: "<createDate>",
        name: "<name>",
        status: "<status>",
    }, fo.makeComponent);

    var defPerson = fo.establishType('Entity::Person', {
        lastName: "<lastName>",
        firstName: "<firstName>",
        genderCode: "<genderCode>",
        name: function () {
            return this.firstName + ' ' + this.lastName;
        }
    }, fo.makeComponent);


    var defLocation = fo.establishType('Entity::Location', {
        addressLine: "<addressLine>",
        city: "<city>",
        stateCode: "<stateCode>",
        countryCode: "<countryCode>",
        address: function () {
            return '{0}, {1} {2} {3}'.format(this.addressLine, this.city, this.stateCode, this.countryCode);
        }
    }, fo.makeComponent);


    var model;

    var data = {
        events: [
            {
                name: 'fall',
                status: 'open',
                subSpec: [
                    {
                        firstName: 'payton',
                        lastName: 'manning',
                        genderCode: 'M',
                        subSpec: [
                                {
                                    addressLine: '123 main st',
                                    city: 'Denver',
                                    stateCode: 'CO',
                                },
                                {
                                    addressLine: '678 market st',
                                    city: 'dallas',
                                    stateCode: 'Tx',
                                },
                            ]
                        },
                    {
                        firstName: 'eli',
                        lastName: 'manning',
                        genderCode: 'M',
                        subSpec: [
                                {
                                    addressLine: '123 park av',
                                    city: 'new york',
                                    stateCode: 'NY',
                                },
                        ]
                    },
                ]
            },
            {
                name: 'spring',
                status: 'open',
                subSpec: [
                    {
                        firstName: 'payton',
                        lastName: 'manning',
                        genderCode: 'M',
                        subSpec: [
                                {
                                    addressLine: '123 main st',
                                    city: 'Denver',
                                    stateCode: 'CO',
                                },
                                {
                                    addressLine: '678 main st',
                                    city: 'indianapolis',
                                    stateCode: 'IN',
                                },
                        ]
                    },
                    {
                        firstName: 'eli',
                        lastName: 'manning',
                        genderCode: 'M',
                        subSpec: [
                                {
                                    addressLine: '678 market st',
                                    city: 'dallas',
                                    stateCode: 'Tx',
                                },
                        ]
                    },
                ]
            },
            {
                name: 'summer',
                status: 'closed',
                subSpec: [
                    {
                        firstName: 'payton',
                        lastName: 'manning',
                        genderCode: 'M',
                        subSpec: [
                                {
                                    addressLine: '123 main st',
                                    city: 'Denver',
                                    stateCode: 'CO',
                                },
                                {
                                    addressLine: '678 main st',
                                    city: 'indianapolis',
                                    stateCode: 'IN',
                                },
                        ]
                    },
                    {
                        firstName: 'eli',
                        lastName: 'manning',
                        genderCode: 'M',
                        subSpec: [
                                {
                                    addressLine: '123 park av',
                                    city: 'new york',
                                    stateCode: 'NY',
                                },
                        ]
                    },
                ]
            },
            {
                name: 'winter',
                status: 'closed',
                subSpec: [
                    {
                        firstName: 'payton',
                        lastName: 'manning',
                        genderCode: 'M',
                        subSpec: [
                                {
                                    addressLine: '123 main st',
                                    city: 'Denver',
                                    stateCode: 'CO',
                                },
                                {
                                    addressLine: '678 main st',
                                    city: 'indianapolis',
                                    stateCode: 'IN',
                                },
                        ]
                    },
                    {
                        firstName: 'david',
                        lastName: 'tyree',
                        genderCode: 'M',
                        subSpec: [
                                {
                                    addressLine: '123 park av',
                                    city: 'new york',
                                    stateCode: 'NY',
                                },
                        ]
                    },
                    {
                        firstName: 'betty',
                        lastName: 'rubble',
                        genderCode: 'F',
                        subSpec: [
                                {
                                    addressLine: '123 park av',
                                    city: 'San Ramon',
                                    stateCode: 'CA',
                                },
                        ]
                    },
                    {
                        firstName: 'wilma',
                        lastName: 'flintstone',
                        genderCode: 'F',
                        subSpec: [
                                {
                                    addressLine: '123 park av',
                                    city: 'Los Angles',
                                    stateCode: 'CA',
                                },
                        ]
                    },
                ]
            },
        ]
    }


    beforeEach(function() {
        model = fo.makeComponent();

        data.events.forEach(function (eventData) {
            var event = defEvent.newInstance(eventData);

            eventData.subSpec.forEach(function (personData) {
                var person = defPerson.newInstance(personData);
                event.capture(person);

                personData.subSpec.forEach(function (locationData) {
                    var location = defLocation.newInstance(locationData);
                    person.capture(location);
                });
            });
            model.capture(event);
        })
     
    });

    it("verify counts", function () {

        var events = model.selectComponents(function (item) { return item.isOfType('Event') });
        var people = model.selectComponents(function (item) { return item.isOfType('Person') });
        var locations = model.selectComponents(function (item) { return item.isOfType('Location') });

        expect(events.count).toEqual(4);
        expect(people.count).toEqual(10);
        expect(locations.count).toEqual(14);
    });

    it("be able to filter based on root entity", function () {
        var events = model.selectComponents(function (item) { return item.isOfType('Event') });

        var filter = 'status(open)';
        var filteredEvent = fo.listOps.applyFilter(events, filter)

        expect(filteredEvent.count).toEqual(2);
    });

    it("be able to filter based on parent entity", function () {
        var person = model.selectComponents(function (item) { return item.isOfType('Person') });

        var filter = 'firstName(david)';
        var filteredPeople = fo.listOps.applyFilter(person, filter)

        expect(filteredPeople.count).toEqual(1);
    });

    it("be able to filter based on child entity", function () {
        var location = model.selectComponents(function (item) { return item.isOfType('Location') });

        var filter = 'stateCode(tx)';
        var filteredLocation = fo.listOps.applyFilter(location, filter)

        expect(filteredLocation.count).toEqual(2);

        filteredLocation = fo.listOps.applyFilter(location, 'city(denver)')
        expect(filteredLocation.count).toEqual(4);

    });


    it("be able to find the parents of the results", function () {
        var location = model.selectComponents(function (item) { return item.isOfType('Location') });

        var filteredLocation = fo.listOps.applyFilter(location, 'stateCode(tx)')
        expect(filteredLocation.count).toEqual(2);

        var parents = filteredLocation.mapCollectNoDupe(function (item) {
            var rootParent = item.findParentWhere(function (parent) { return parent.isOfType('Event') });
            return rootParent;
        });

        expect(parents.count).toEqual(2);
    });


    it("be able to find the distinct parents of the results", function () {
        var location = model.selectComponents(function (item) { return item.isOfType('Location') });

        var filteredLocation = fo.listOps.applyFilter(location, 'stateCode(ca)')
        expect(filteredLocation.count).toEqual(2);

        var parents = filteredLocation.mapCollectNoDupe(function (item) {
            var rootParent = item.findParentWhere(function (parent) { return parent.isOfType('Event') });
            return rootParent;
        });

        expect(parents.count).toEqual(1);
    });

    it("be able to find the same result fromt distinct parents", function () {
        var location = model.selectComponents(function (item) { return item.isOfType('Location') });

        var filteredLocation = fo.listOps.applyFilter(location, 'stateCode(ca)')
        expect(filteredLocation.count).toEqual(2);

        var parents = filteredLocation.mapCollectNoDupe(function (item) {
            var rootParent = item.findParentWhere(function (parent) { return parent.isOfType('Event') });
            return rootParent;
        });

        expect(parents.count).toEqual(1);

        var singleLocation = parents.selectComponents(function (item) { return item.isOfType('Location') });
        var filteredLocation = fo.listOps.applyFilter(location, 'stateCode(ca)')
        expect(filteredLocation.count).toEqual(2);

    });

});
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
/// <reference path="../../jasmine-2.0.0/jasmine.js" />

describe("Foundry: network", function () {
    var airportDB;
    var airportType;
    var departs;
    var arrives;

    beforeEach(function () {
        airportDB = fo.db.getEntityDB('spike::airport');
        airportType = fo.establishType('spike::airport', {
            myGuid: function myGuid() {
                return this.myName + '::' + fo.tools.generateUUID();
            },
            myName: 'xxx',
        });

        flightDB = fo.db.getEntityDB('spike::flight');
        flightType = fo.establishType('spike::flight', {
            myGuid: function myGuid() {
                return this.myName + '::' + fo.tools.generateUUID();
            },
            myName: 'yyy',
        });

        departs = fo.establishRelationship('spike::departsAirport|spike::hasDepartures');
        arrives = fo.establishRelationship('spike::arrivesAirport|spike::hasArrivals');

    });

    afterEach(function () {
        fo.db.deleteEntityDB('spike::airport');
        fo.db.deleteEntityDB('spike::flight');
        fo.removeType('spike::airport');
        fo.removeType('spike::flight');
    });

    it("should be able to create an airport", function () {
        var lax = airportDB.establishInstance({ myName: 'LAX' });

        expect(lax).toBeDefined();
        expect(lax.myType).toBeDefined();
        expect(lax.myName).toEqual('LAX');
    });

    it("should be able to create an flight", function () {
        var flight = flightDB.establishInstance({ myName: 'AA1357' });

        expect(flight).toBeDefined();
        expect(flight.myType).toBeDefined();
        expect(flight.myName).toEqual('AA1357');
    });

    it("should be able to relate airports flight", function () {
        var flight = flightDB.establishInstance({ myName: 'AA1357' });
        var lax = airportDB.establishInstance({ myName: 'LAX' });
        var jfk = airportDB.establishInstance({ myName: 'JFK' });

        expect(flight).toBeDefined();
        expect(lax).toBeDefined();
        expect(jfk).toBeDefined();

        departs.apply(flight, jfk);

        expect(flight.departsAirport).toBeDefined();
        expect(jfk.hasDepartures).toBeDefined();
    });


    it("should be able to unrelate airports flight", function () {
        var flight = flightDB.establishInstance({ myName: 'AA1357' });
        var lax = airportDB.establishInstance({ myName: 'LAX' });
        var jfk = airportDB.establishInstance({ myName: 'JFK' });

        expect(flight).toBeDefined();
        expect(lax).toBeDefined();
        expect(jfk).toBeDefined();

        departs.apply(flight, jfk);

        expect(flight.departsAirport).toBeDefined();
        expect(jfk.hasDepartures).toBeDefined();

        departs.undo(flight, jfk);

        expect(flight.departsAirport).not.toBeDefined();
        expect(jfk.hasDepartures).not.toBeDefined();


    });

});

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


describe("Foundry: Property Calculation", function () {
    var obj;
    var firstname= "George";
    var lastname = "Washington";

    var nameSpec = {
        fname: "George",
        lname: "Washington",
        fullname: function () {
            return this.fname + ' ' + this.lname
        },
    };

    beforeEach(function() {
        obj = fo.makeComponent(nameSpec);
        var manager = obj.propertyManager();

    });

    it("should be able to compute", function() {
        expect(obj.fname).toEqual(firstname);
        expect(obj.lname).toEqual(lastname);
        expect(obj.fullname).toEqual(firstname + ' ' + lastname);
    });

    it("store managed properties in the component", function () {
        expect(obj.fname).toBeDefined();
        expect(obj.lname).toBeDefined();
        expect(obj.fullname).toBeDefined();

        var manager = obj.propertyManager();
        expect(manager.fname).toBeDefined();
        expect(manager.lname).toBeDefined();
        expect(manager.fullname).toBeDefined();
    });

    it("change the status of the calculation when computed", function () {
        var manager = obj.propertyManager();
        expect(manager.fullname.status).toBeUndefined();
        expect(obj.fullname).toBeDefined();
        expect(manager.fullname.status).toBeDefined();
        expect(manager.fullname.status).toEqual('calculated');
    });

    it("should smash to undefined and recompute on demand", function () {
        var manager = obj.propertyManager();
        expect(obj.fullname).toBeDefined();
        expect(manager.fullname.status).toEqual('calculated');

        var differentlastname = "Plimpton";
        obj.lname = differentlastname;
        expect(manager.fullname.status).toBeUndefined();

        expect(obj.fullname).toEqual(firstname + ' ' + differentlastname);
        expect(manager.fullname.status).toEqual('calculated');
    });

    it("should allow the computed to be overridden and recompute on smashing", function () {
        var manager = obj.propertyManager();
        expect(obj.fullname).toEqual(firstname + ' ' + lastname);

        var newName = "Bill Clinton";
        obj.fullname = newName;
        expect(obj.fullname).toEqual(newName);

        var differentlastname = "Plimpton";
        obj.lname = differentlastname;
        expect(obj.fullname).toEqual(newName);

        obj.getManagedProperty('fullname').smash();
        expect(manager.fullname.status).toBeUndefined();

        expect(obj.fullname).toEqual(firstname + ' ' + differentlastname);


    });

});
/// <reference path="../../jasmine-2.0.0/jasmine.js" />

describe("Foundry: structure", function () {

    var dto, node, comp;

    var appJSON = [
         {
             appUrl: 'http://www.google.com',
             appGroup: '01:software',
         },
         {
             appUrl: 'https://www.microsoft.com',
             appGroup: '01:software',
         },
         {
             appUrl: 'https://www.apple.com',
             appGroup: '02:hardware',
         },
         {
             appUrl: 'https://www.amazon.com',
             appGroup: '02:hardware',
         },
    ];

    beforeEach(function () {
        dto = fo.makeDTO();
        node = fo.makeNode();
        comp = fo.makeComponent();

    });

    afterEach(function () {
    });

    it("should not be able to add subcomponent to a DTO", function () {
        var obj = fo.makeDTO({}, [dto]);

        expect(obj).toBeDefined();
        expect(obj.subcomponents).not.toBeDefined();
    });

    it("should be able to add subcomponent to a Node", function () {
        var obj = fo.makeNode({}, [node]);

        expect(obj).toBeDefined();
        expect(obj.subcomponents).toBeDefined();
        expect(obj.subcomponents.length).toEqual(1);
    });

    it("should be able to add subcomponent to a Component", function () {
        var obj = fo.makeComponent({}, [comp]);

        expect(obj).toBeDefined();
        expect(obj.subcomponents).toBeDefined();
        expect(obj.subcomponents.length).toEqual(1);

        obj.addSubcomponent(fo.makeComponent({}));
        expect(obj.subcomponents.length).toEqual(2);

    });


    it("build a structure with Nodes", function () {
        var labItem = fo.establishType('spike::labItem', {
            appUrl: '',
            appGroup: '0:lab',
        });

        var labGroupDB = fo.db.getEntityDB('spike::labGroup');
        var labGroup = fo.establishType('spike::labGroup', {
            groupName: '',
            isCollapsed: false,
        });


        var sortedList = fo.listOps.applySort(appJSON, 'appGroup(a);appUrl(a)')
        expect(sortedList.length).toEqual(4);

        var items = sortedList.map(function (item) {
            return labItem.newInstance(item);
        });
        expect(items.length).toEqual(4);

        var groups = fo.listOps.applyGrouping(items, 'appGroup');
        var apps = fo.tools.mapOverKeyValue(groups, function (key, value) {
            return labGroup.newInstance({ groupName: key }, value);
        });

        expect(apps.length).toEqual(2);

        apps.forEach(function (item) {
            expect(item.subcomponents.length).toEqual(2);
        });


        //self.restoreSession = function () {
        //    if (localStorage) {
        //        db.restoreAllEntityDB(labGroupDB.myName, 'vaaslabs');
        //    }
        //}

        ////self.restoreSession();

        //self.saveSession = function () {
        //    if (localStorage) {
        //        db.saveAllEntityDB(labGroupDB.myName, 'vaaslabs');
        //    }
        //}


    });

    it("build a structure with Components", function () {
        var labItem = fo.establishType('spike::labItem', {
            appUrl: '',
            appGroup: '0:lab',
        }, fo.makeComponent);

        var labGroupDB = fo.db.getEntityDB('spike::labGroup');
        var labGroup = fo.establishType('spike::labGroup', {
            groupName: '',
            isCollapsed: false,
        }, fo.makeComponent);



        var sortedList = fo.listOps.applySort(appJSON, 'appGroup(a);appUrl(a)')
        expect(sortedList.length).toEqual(4);

        var items = sortedList.map(function (item) {
            return labItem.newInstance(item);
        });
        expect(items.length).toEqual(4);

        var groups = fo.listOps.applyGrouping(items, 'appGroup');
        var apps = fo.tools.mapOverKeyValue(groups, function (key, value) {
            return labGroup.newInstance({ groupName: key }, value);
        });

        expect(apps.length).toEqual(2);

        apps.forEach(function (item) {
            expect(item.subcomponents.length).toEqual(2);
        });


        //self.restoreSession = function () {
        //    if (localStorage) {
        //        db.restoreAllEntityDB(labGroupDB.myName, 'vaaslabs');
        //    }
        //}

        ////self.restoreSession();

        //self.saveSession = function () {
        //    if (localStorage) {
        //        db.saveAllEntityDB(labGroupDB.myName, 'vaaslabs');
        //    }
        //}


    });
});