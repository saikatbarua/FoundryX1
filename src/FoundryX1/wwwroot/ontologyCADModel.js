


(function (app, fo, tools, undefined) {

    fo.establishType('cad::block', {
        width: 10,
        height: 20,
        depth: 40,
        area: function () { return this.width * this.height; },
        volume: function () { return this.width * this.height * this.depth; },
    }, fo.makeComponent);

   fo.establishType('cad::plane', {
        width: 10,
        height: 20,
        depth: 40,
    }, fo.makeComponent);


    // angular service directive
   app.service('ontologyCADService', function (render3DService) {
        
       var self = this;


        var list = fo.typeDictionaryWhere(function (key,value) {
            return key.startsWith('cad::');
        });

        tools.forEachKeyValue(list, function (key, value) {
            var name = tools.getType(value);


            self[name] = value;
        });

        return self;
    });

})(foApp, Foundry, Foundry.tools);