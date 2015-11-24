
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