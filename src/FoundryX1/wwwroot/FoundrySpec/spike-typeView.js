
var foApp = angular.module('foApp', []);

(function (app, fo, undefined) {

    app.filter('prettyJSON', function () {
        return function (obj) {
            if (fo.tools.isTyped(obj)) {
                return fo.tools.stringify(obj, undefined, 3);
            }
            return JSON.stringify(obj, undefined, 3);
        };
    });

    //app.filter('toImage', function () {
    //    return function (obj) {
    //        if (!obj) return;
    //        var icon = obj.type.myType.replace('::', '');
    //        icon = icon.toLowerCase();
    //        return "Pictures/" + icon + ".png";
    //    };
    //});

    app.controller('workspaceController', function () {
        var types = fo.getAllTypes(true);
        this.types = types;

        var relations = fo.getAllRelations(true);
        this.relations = relations;

        var meta = fo.meta.getAllTypes(true);
        this.meta = meta;

        this.title = 'Type View';
    });

}(foApp, Foundry));