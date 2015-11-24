
var foApp = angular.module('foApp', []);

(function (app, fo, undefined) {
    app.controller('workspaceController', function () {

        this.title = 'Foundry Version ' + fo.version;
        this.spike = 'makeDTO: desigined to be the simplest/fastest in the chain';

        var spec = {
            id: (function id () { //this will compute once if the name matches the key
                //return fo.tools.createID(this.myName);
                return fo.tools.generateUUID();
            })(),
            width: 3,
            height: 2,
            area: function () {
                return this.width * this.height;
            },
            isDTOInstance: function () {
                return this.isInstanceOf(fo.DTO);
            },

        }

        var obj = fo.makeDTO(spec);

        var makeSquare = function (properties, subcomponents, parent) {
            return fo.makeDTO(fo.tools.union(spec, properties));
        }



        var list = [makeSquare({ height: 3 }), new fo.DTO({ height: 4, x: 20 })];
        list.push(new fo.DTO({ myType: 'Al' }));

        this.answer1 = fo.tools.stringify(obj, undefined, 3);
        this.answer2 = fo.tools.stringify(list, undefined, 3);

    });

}(foApp, Foundry));