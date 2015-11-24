
var foApp = angular.module('foApp', []);

(function (app, fo, db, undefined) {


    app.controller('workspaceController', function () {

        this.title = 'Foundry Version ' + fo.version;
        this.spike = 'entityDB';


        var rect = db.getEntityDB('spike::rectangle');

        var block = db.getEntityDB('spike::block');

        var country = fo.establishType('spike::country', {
        });

        var countryDB = db.getEntityDB('spike::country');
        countryDB.idFunction = function (item) {
            return item.countryCode;
        };

        countryColor.forEach(function (item) {
            countryDB.establishInstance(item);
        })

        var list = countryDB.items;


        var defs = fo.tools.asArray(db.entityDBWhere());



        this.answer1 = fo.tools.stringify(defs, undefined, 3);
        this.answer2 = fo.tools.stringify(list, undefined, 3);




    });

}(foApp, Foundry, Foundry.db));