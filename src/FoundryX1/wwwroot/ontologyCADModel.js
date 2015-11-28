
//<!-- types
//button
//checkbox
//color
//date
//datetime
//datetime-local
//email
//file
//hidden
//image
//month
//number
//password
//radio
//range
//reset
//search
//submit
//tel
//text
//time
//url
//week--> 

(function (app, fo, tools, undefined) {

    fo.establishType('cad::block', {
        width: 10,
        height: 20,
        depth: 40,
        area: function () { return this.width * this.height; },
        volume: function () { return this.width * this.height * this.depth; },
    }, fo.makeComponent);

    fo.meta.establishMetadata('cad::block', {
        width: { userEdit: true, type: 'number', formula: 20 },
        height: { userEdit: true, type: 'number', formula: 30 },
        depth: { userEdit: true, type: 'number', formula: 30 },
    });

    fo.establishType('cad::cylinder', {
        radius: 10,
        height: 20,
        radiusTop: function () { return this.radius; },
        radiusBottom: function () { return this.radius; },
        radialSegments: 20,
    }, fo.makeComponent);

    fo.meta.establishMetadata('cad::cylinder', {
        radius: { userEdit: true, type: 'number', formula: 20 },
        height: { userEdit: true, type: 'number', formula: 30 },
    });

    fo.establishType('cad::sphere', {
        radius: 10,
        widthSegments: 20,
        heightSegments: 20,
    }, fo.makeComponent);

    fo.meta.establishMetadata('cad::sphere', {
        radius: { userEdit: true, type: 'number', formula: 20 },
    });

    fo.establishType('cad::hemisphere', {
        type: 'sphere',
        radius: 10,
        phiLength: 20 * Math.PI / 180,
        widthSegments: 20,
        heightSegments: 20,
    }, fo.makeComponent);

    fo.meta.establishMetadata('cad::hemisphere', {
        radius: { userEdit: true, type: 'number', formula: 20 },
    });

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