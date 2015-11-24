
var foApp = angular.module('foApp', []);

(function (app, fo, undefined) {
    app.controller('workspaceController', function () {

        this.title = 'Foundry Version ' + fo.version;
        this.spike = 'factory';

        //var shape = fo.defineClass('shape',
        //    fo.Node,
        //    {
        //        idx: function () { return 400 },
        //        isShapeInstance: function () {
        //            return this.isInstanceOf(shape);
        //        },
        //    },
        //    function (properties, subcomponents, parent) {
        //        this.base.call(this, properties, subcomponents, parent);
        //        return this;
        //    }
        //);

        var rect = fo.establishType('spike::rectangle', {
            width: 10,
            height: 20,
            area: function() { return this.width * this.height; },
        });

        var block = fo.establishType('spike::block', {
            width: 10,
            height: 20,
            depth: 30,
        });

        var defs = fo.tools.asArray(fo.typeDictionaryWhere(), function (key, value) {
            return value.getSpec();
        });

        this.answer1 = fo.tools.stringify(defs, undefined, 3);

        var keys = fo.typeDictionaryKeys();
        var list = keys.map(function (item) {
            return fo.newInstance(item, { time: new Date() });
        })
        this.answer2 = fo.tools.stringify(list, undefined, 3);

    });

}(foApp, Foundry));