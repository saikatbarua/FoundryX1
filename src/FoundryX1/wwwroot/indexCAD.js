

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

        var space = fo.makeModelWorkspace('steve workspace');
        self.space = space;
        var model = space.rootModel;
        self.model = model;


        render3DService.init('cadWorld');

        render3DService.cameraPosition(0, 200, 200);
        render3DService.animate();

        var viewModel = render3DService.entity.newInstance({
            myName: 'cadWorld',
            context: model,
            geom: function () { return render3DService.rootModel(); },
        });

        self.viewModel = viewModel;


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
                headerTemplate: 'editEntityHeader.html',
                bodyTemplate: 'editEntityInputs.html',
                footerTemplate: 'editEntityFooter.html',
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

        var currentRoot = model;

        self.doAdd = function (source) {
            var name = tools.getType(source);
            var obj = source.newInstance().unique();
            currentRoot.capture(obj);
            //currentRoot = obj;

            //not it is time to create geometry
            var cadNode = render3DService.entity.newInstance({
                context: obj,
            }, [], viewModel);
            viewModel.addSubcomponent(cadNode);
            cadNode.geom;


            //var prop = obj.establishedManagedProperty('geom', function () {
            //    var type = tools.getType(this);
            //    var spec = this.getInputSpec(false);

            //    var def = render3DService.primitive(type, spec);
            //    var root = this.myParent && this.myParent.geom;
            //    var geom = def.create(root, this);

            //    //position relative to root
            //    if (root) {
            //        geom.onTopOf(root);
            //    }
            //    return geom;
            //});

            //prop.onValueSmash = function (geom, newValue, formula, owner) {
            //    geom.meshRemove()
            //};

            //fo.subscribe('smash', function (p, value) {
            //    console.log('smh:' + p.myName + ' => ' + value);
            //});
            //fo.subscribe('setValue', function (p, value) {
            //    console.log('set:' + p.myName + ' => ' + value);
            //});
            
            //prop.compute();


            //var i = 0;
            //obj.geom.rotateOnZ((270 + i) * Math.PI / 180)

        }


        self.doExport = function () {
            render3DService.export();
        }

        self.openDialog = function () {
            dialogService.doPopupDialog({
                context: self,
                headerTemplate: 'saveFileHeader.html',
                bodyTemplate: 'saveFileBody.html',
                footerTemplate: 'saveFileFooter.html',
            });
        };



    });


})(foApp, Foundry, Foundry.tools,  Foundry.listOps);

