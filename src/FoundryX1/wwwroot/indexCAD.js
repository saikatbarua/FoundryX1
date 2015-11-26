

var foApp = angular.module('foApp', ['ui.bootstrap']);

(function (app, fo, tools, ops, undefined) {

    app.filter('buttonLabel', function () {
        return function (obj) {
            var name = tools.getType(obj);
            return name.capitalizeFirstLetter();
        };
    });

    //load templares for dialogs and shapes...
    tools.loadTemplate('foundry/foundry.ui.ngdialog.html');
    tools.loadTemplate('indexCad.ui.html');

    app.controller('workspaceController', function (ontologyCADService, render3DService, dialogService) {

        var self = this;

        var space = fo.makeModelWorkspace('steve');
        self.space = space;
        var model = space.rootModel;
        self.model = model;


        var scene = render3DService.init('cadWorld', 0, 200, 200);
        render3DService.animate();

        self.cadPrimitives = fo.typeDictionaryWhere(function (key, value) {
            return key.startsWith('cad::');
        });

        fo.establishType('local::steps', {
            width: 10,
            height: 20,
            depth: 40,
            area: function () { return this.width * this.height; },
            volume: function () { return this.width * this.height * this.depth; },
        }, fo.makeComponent);




        self.customPrimitives = fo.typeDictionaryWhere(function (key, value) {
            return key.startsWith('local::');
        });


        function editPart(item, onOk) {
            dialogService.doPopupDialog({
                root: self,
                context: item,
                headerTemplate: 'saveFileHeader.html',
                bodyTemplate: 'editSpecItem.html',
                footerTemplate: 'saveFileFooter.html',
            },
            {
                onOK: function ($modalInstance, context) {
                    onOk && onOk(context);
                },
                onCancel: function ($modalInstance, context) {
                },
                onExit: function () {
                },
                onReady: function () {
                }
            },
            {
            });

        }

        self.doEdit = function (item) {
            editPart(item, function (context) {
                //now refresh the model?
                item.geom;

            });
        }


        self.doChange = function (prop, mp) {
            var value = mp.value;
            mp.setValue(value + 10);
        }

        var currentRoot = model;

        self.doAdd = function (source) {
            var name = tools.getType(source);
            var obj = source.newInstance().unique();
            currentRoot.capture(obj);
            currentRoot = obj;
            

            var prop = obj.establishedManagedProperty('geom', function () {
                var type = tools.getType(this);
                var oDependentValue = fo.currentComputingProperty();

                var spec = tools.applyOverKeyValue(this.getInputs(), function (key, mp) {
                    oDependentValue.addDependency(mp);
                    return mp.value;
                });
                var def = render3DService.primitive(type, spec);
                var root = this.myParent && this.myParent.geom;
                var geom = def.create(root);
                //position relative to root
                if (root) {
                    root.capture(geom);
                    var pos = root.mesh.position;
                    geom.setX(pos.x + 3 * this.width)
                    geom.setY(pos.y + 3 * this.height)
                }
                return geom;
            });

            prop.onValueSmash = function (p, newValue, formula, owner) {
                //ok now delete the mesh gemoetry
                var mesh = p.mesh;
                var parent = mesh.parent;
                parent.remove(mesh);
            };

            //fo.subscribe('smash', function (p, value) {
            //    console.log('smh:' + p.myName + ' => ' + value);
            //});
            //fo.subscribe('setValue', function (p, value) {
            //    console.log('set:' + p.myName + ' => ' + value);
            //});
            
            prop.compute();


            //var i = 0;
            //obj.geom.rotateOnZ((270 + i) * Math.PI / 180)

        }

        //self.doAddPlane = function () {
        //    var obj = ontologyCADService.plane.newInstance().unique();
        //    model.capture(obj);


        //    render3DService.loadModel('707', 'models/707.js')
        //        .then(function (def) {
        //            var plane = def.create();
        //            //var angle = i * Math.PI / 180;
        //            //var pitch = (270 + i) * Math.PI / 180;
        //            //plane.positionXYZ(radius * Math.cos(angle), radius * Math.sin(angle), 0);
        //            //plane.rotateOnZ(pitch)
        //        })
        //}



        self.doExport = function () {
            render3DService.export();
        }

        self.openDialog = function () {
            dialogService.doPopupDialog({
                context: self,
                headerTemplate: 'saveFileHeader.html',
                bodyTemplate: 'saveFileBody.html',
                footerTemplate: 'saveFileFooter.html',
            },
            {
                onOK: function ($modalInstance, context) {
                },
                onCancel: function ($modalInstance, context) {
                },
                onExit: function () {
                },
                onReady: function () {
                }
            },
            {
            });
        };






        //render3DService.primitive('block', { width: 20, height: 100, depth: 5 })
        //.then(function (block) {

        //    placeDB.items.forEach(function (item) {

 
        //        var model = block.create();
        //        var geo = item.geoLocation;
        //        var pos = render3DService.latLongToVector3(geo.latitude, geo.longitude, 0, 0);

        //        //var x = Math.PI / 2 - (geo.latitude).toRad();
        //        model.rotateOnY(geo.longitude * Math.PI / 180);
        //        model.rotateOnZ((270 + geo.latitude) * Math.PI / 180)

        //        var radius = 20;
        //        var angle = geo.longitude * Math.PI / 180;

        //        model.positionXYZ(radius * Math.cos(angle), radius * Math.sin(angle), 0);
        //       // dummyLat.rotation.x = x;
        //       // var y = Math.abs(geo.longitude - 180);
        //       // dummyLng.rotation.y = y;
        //        //model.position(pos);
        //    });

        //});



 


    });


})(foApp, Foundry, Foundry.tools,  Foundry.listOps);

