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