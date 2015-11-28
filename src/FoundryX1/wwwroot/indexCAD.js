

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

        var viewModel = render3DService.createEntity({
            myName: 'cadWorld',
            context: model,
            geom: function () { return render3DService.rootModel(); },
        });

        self.viewModel = viewModel;


        self.cadPrimitives = fo.typeDictionaryWhere(function (key, value) {
            return key.startsWith('cad::');
        });

        self.userInputs = function (obj, key) {
            var inputs = obj.userInputs(key);
            return inputs;
        }

        self.computeInclude = function (obj, key) {
            var context = key && self.userInputs(obj, key)[0];

            if (obj.isType('3d::entity')) {
                return 'entityTreeItem.html';
            }

            return 'modelTreeItem.html';
        }

        //http://learningthreejs.com/blog/2011/12/10/constructive-solid-geometry-with-csg-js/
        //http://evanw.github.io/csg.js/
        //http://stackoverflow.com/questions/26183062/shape-with-single-hole-probably-hole-outside-shape

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


        function editPart(item) {
            dialogService.doPopupDialog({
                root: self,
                context: item,
                headerTemplate: 'editEntityHeader.html',
                bodyTemplate: 'editEntityInputs.html',
                footerTemplate: 'editEntityFooter.html',
            },
            {
                onExit: function () {
                    render3DService.render(viewModel);
                },
            });

        }

        self.doEdit = function (item) {
            editPart(item);
        }

        var currentRoot = model;
        var currentView = viewModel;

        self.doAdd = function (source) {
            var name = tools.getType(source);
            var obj = source.newInstance().unique();
            currentRoot.capture(obj);

            if (currentRoot.subcomponents.nearlyLast) {
                var previous = currentRoot.subcomponents.nearlyLast;
                var last = currentRoot.subcomponents.last;

                last.width = 5 + previous.width;
            }

            //not it is time to create geometry
            currentView = render3DService.createEntity({
                context: obj,
            }, [], viewModel);


            if (viewModel.subcomponents.nearlyLast) {
                var previous = viewModel.subcomponents.nearlyLast;
                var last = viewModel.subcomponents.last;

                fo.establishLink(last, 'isOnTopOf', previous);
                fo.establishLink(last, 'isRotateY', previous);

                render3DService.isLeftOf.apply(last, previous);

            }
            render3DService.render(viewModel);


            //fo.subscribe('smash', function (p, value) {
            //    console.log('smh:' + p.myName + ' => ' + value);
            //});
            //fo.subscribe('setValue', function (p, value) {
            //    console.log('set:' + p.myName + ' => ' + value);
            //});

        }

        self.doRender = function () {
            render3DService.render(viewModel);
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

