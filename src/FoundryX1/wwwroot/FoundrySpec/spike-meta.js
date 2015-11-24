
var foApp = angular.module('foApp', []);

(function (app, fo, undefined) {
    app.controller('workspaceController', function () {

        this.title = 'Foundry Version ' + fo.version;
        this.spike = 'meta';

        var rect = fo.meta.establishMetadata('spike::rectangle', {
            width: {type: 'number'},
            height: { type: 'number' },
            area: { formula: function area() { return this.width * this.height; } },
        });

        var block = fo.meta.establishMetadata('spike::block', {
            width: { type: 'number' },
            height: { type: 'number' },
            depth: { type: 'number' },
        });


        this.answer1 = fo.tools.stringify(rect, undefined, 3);
        this.answer2 = fo.tools.stringify(fo.meta.getAllTypes(), undefined, 3);

    });

}(foApp, Foundry));