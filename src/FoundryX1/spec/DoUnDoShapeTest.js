﻿/// <reference path="../Scripts/jasmine-1.3.1/jasmine.js" />

/// <reference path="../Foundry/Foundry.trace.js" />
/// <reference path="../Foundry/Foundry.core.js" />
/// <reference path="../Foundry/Foundry.rules.factory.js" />
/// <reference path="../Scripts/moment.min.js" />

/// <reference path="../Apprentice/easeljs-0.7.0.min.js" />
/// <reference path="../tweenjs/Tween.js" />

/// <reference path="../Foundry/Foundry.rules.filtering.js" />
/// <reference path="../Foundry/Foundry.undo.js" />
/// <reference path="../Foundry/Foundry.canvas.js" />
/// <reference path="../Foundry/Foundry.canvas.structure.js" />
/// <reference path="../Foundry/Foundry.canvas.page2D.js" />
/// <reference path="../Foundry/Foundry.canvas.shape2D.js" />
/// <reference path="../Foundry/Foundry.canvas.multipagedocument.js" />
/// <reference path="../Foundry/Foundry.canvas.pagepreview.js" />

describe("Do UnDo: Shapes", function () {
    var root;
    var buffer;

    beforeEach(function () {

        root = fo.construct('Page');
        list = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
        var i = 0;

        list.forEach(function (item) {
            var hour = i; i++;
            var time = new moment();

            var comp = fo.construct('Shape2D', {
                name: item,
                number: hour,
                hour: time.add('h', hour),
            });

            root.addSubcomponent(comp);
        });

        //inprovement in keeping geoms around now require we use a shape
        //but is should be ok if it does not have a stage..
        buffer = fo.construct('Page');

        //this shows that a 'generic' component can be a place to store a shape
        //no harm in not requiring a root page...
        //buffer = fo.construct('Component');


        function beforeReparent(payload) {
            var newParent = payload.newParent;
            var child = payload.child;

            //now do the parenting
            var oldParent = newParent.captureSubcomponent(child);

            payload.oldParent = oldParent;

            return payload;
        }
        function undoReparent(payload) {
            //now do the reparenting based on the payload

            var oldParent = payload.oldParent;
            var child = payload.child;
            var index = payload.index;
            oldParent.captureInsertSubcomponent(index, child);

            return payload;
        }

        fo.undo.clear();
        fo.undo.registerActions('Reparent', beforeReparent, undoReparent);

    });


    it("should be able first verify the model", function () {
        expect(root).toBeDefined();
        expect(root.Subcomponents.count).toBe(11);

        expect(buffer).toBeDefined();
        expect(buffer.Subcomponents.count).toBe(0);

        var item = root.Subcomponents.item(3);
        expect(item.name).toBe('three');
        expect(item.myParent).toBe(root);

        buffer.captureSubcomponent(item);

        expect(root.Subcomponents.count).toBe(10);
        expect(item.myParent).toBe(buffer);

        expect(buffer.Subcomponents.count).toBe(1);

    });


    it("should be able undo reparenting", function () {

        expect(root).toBeDefined();
        expect(root.Subcomponents.count).toBe(11);
        expect(buffer).toBeDefined();
        expect(buffer.Subcomponents.count).toBe(0);

        var item = root.Subcomponents.item(3);
        var payload = { newParent: buffer, child: item, index: item.myIndex() };

        var undo = fo.undo.do('Reparent', payload);

        expect(item.myParent).toBe(buffer);
        expect(root.Subcomponents.count).toBe(10);

        fo.undo.unDo(undo);

        expect(item.myParent).toBe(root);
        expect(root.Subcomponents.count).toBe(11);
        expect(buffer.Subcomponents.count).toBe(0);


    });

    it("should return child to the original result", function () {

        expect(root).toBeDefined();
        expect(root.Subcomponents.count).toBe(11);
        expect(buffer).toBeDefined();
        expect(buffer.Subcomponents.count).toBe(0);

        var item = root.Subcomponents.item(3);
        var payload = { newParent: buffer, child: item, index: item.myIndex() };

        var undo = fo.undo.do('Reparent', payload);

        expect(item.myParent).toBe(buffer);
        expect(root.Subcomponents.count).toBe(10);

        fo.undo.unDo(undo);

        expect(item.myParent).toBe(root);
        expect(root.Subcomponents.count).toBe(11);
        expect(buffer.Subcomponents.count).toBe(0);

        //only because the reparent handler forces this..
        var sameItem = root.Subcomponents.item(3);
        expect(sameItem).toBe(item);


    });



 


});