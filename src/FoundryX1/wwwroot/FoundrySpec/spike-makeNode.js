
var foApp = angular.module('foApp', []);

(function (app, fo, undefined) {
    app.controller('workspaceController', function () {

        var jake;

        this.title = 'Foundry Version ' + fo.version;
        this.spike = 'makeNode';

        var spec = {
            id: function id () { //this will compute once if the name matches the key
                //return fo.tools.createID(this.myName);
                return fo.tools.generateUUID();
            },
            width: 3,
            height: 2,
            area: function () {
                return this.width * this.height;
            },
            isNode: function () {
                return this.isType('Node');
            },
            isJake: function () {
                return this.isType('Jake');
            },
            isNodeInstance: function () {
                return this.isInstanceOf(fo.Node);
            },
            isJakeInstance: function () {
                return this.isInstanceOf(jake);
            },

            isChild: function () {
                return this.myParent ? true : false;
            },
        }

        var obj = fo.makeNode(spec);

        var makeSquare = function (properties, subcomponents, parent) {
            return fo.makeNode(fo.tools.union(spec, properties));
        }

        jake = fo.defineClass('jake', fo.Node, spec, function (properties, subcomponents, parent) {
            this.base.call(this, properties, subcomponents, parent);         
            return this;
        });

        var list = [obj, makeSquare({ height: 3 }), new jake({ height: 4, x: 20 })];
        obj.addSubcomponent(new jake());
        obj.addSubcomponent(new jake());

        this.answer1 = fo.tools.stringify(list, undefined, 3);
        this.answer2 = fo.tools.stringify(list, undefined, 3);

    });

}(foApp, Foundry));