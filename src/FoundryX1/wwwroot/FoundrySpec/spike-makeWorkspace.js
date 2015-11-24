
var foApp = angular.module('foApp', []);

(function (app, fo, undefined) {

 

    app.controller('workspaceController', function () {

        var self = this;
        this.title = 'Foundry Version ' + fo.version;
        this.spike = 'Workspace';

        var rect = fo.establishType('spike::rectangle', {
            width: 10,
            height: 20,
            area: function () { return this.width * this.height; },
        }, fo.makeComponent);

        var space = fo.makeModelWorkspace('steve');
        var ref = space.asReference(); //should force a GUID

        var model = space.rootModel;
        var obj1 = fo.makeComponent({ X: 100 }).unique();
        for (var i = 0; i < 5; i++) {
            var obj2 = fo.makeComponent({ Y: 200 + i, I: i }).unique();
            obj1.capture(obj2);
        }

        model.capture(obj1);

        for (var i = 0; i < 5; i++) {
            var obj2 = rect.newInstance().unique();
            obj1.capture(obj2);
        };



        this.answer1 = fo.tools.stringify(space, undefined, 3);


        this.answer2 = space.modelAsPayload();


    });

}(foApp, Foundry));