

var foApp = angular.module('foApp', ['ui.bootstrap']);



(function (app, fo, tools, undefined) {



    //load templares for dialogs and shapes...
    tools.loadTemplate('foundry/foundry.ui.ngdialog.html');
    tools.loadTemplate('indexParisAttacks.ui.html');

    app.controller('workspaceController', function ($rootScope, ontologyLocationService, geoRenderService, dialogService) {
        var self = this;

        self.title = 'paris attacks';
        self.space = fo.makeModelWorkspace('paris');;
        self.model = self.space.rootModel;


        var locationDB = ontologyLocationService.locationDB;
        var placeDB = ontologyLocationService.placeDB;
        var nodeDB = ontologyLocationService.nodeDB;

        self.locationDB = locationDB;
        self.placeDB = placeDB;
        self.nodeDB = nodeDB;


        geoRenderService.init('cesiumContainer');


        self.doDraw = function () {
            var list = nodeDB.items.map(function (item) {
                return item.place.geoLocation;
            });

            geoRenderService.renderLocations(list)
        }


        function processTargets(data) {
            var list = tools.asArray(data.items);
            list.forEach(function (item) {
                nodeDB.forceItemInsert(item);
            });
            $rootScope.$apply();
        }


        fo.clientHub.registerCommandResponse({
            responceNodeDB: function (payload) {
                processTargets(payload);
                self.doDraw();
            },
            purge: function (payload) {
            },
            goto: function (item) {
            },
        });


        fo.clientHub.sendMessage('requestNodeDB');


        function editNode(node) {
            dialogService.doPopupDialog({
                root: self,
                context: node,
                headerTemplate: 'editEntityHeader.html',
                bodyTemplate: 'editEntityBody.html',
                footerTemplate: 'editEntityFooter.html',
            });
        }

        self.editNode = function (item) {
            editNode(item);
        }

        self.selectedNode = function (node) {
            var loc = node && node.place && node.place.geoLocation;
            if (!loc) return;
            geoRenderService.flyTo(loc);
        }

        fo.subscribe('nodeSelected', function (node) {
            node && self.selectedNode(node);
        });


        self.userInputs = function (obj, key) {
            var inputs = obj.userInputs(key);
            return inputs;
        }

        self.computeInclude = function (obj, key) {
            var context = key && self.userInputs(obj, key)[0];

            if (obj.isType(self.nodeDB.myName)) {
                return 'nodeView.html';
            }
            if (obj.isType(self.placeDB.myName)) {
                return 'placeView.html';
            }
            if (obj.isType(self.locationDB.myName)) {
                return 'geoLocationView.html';
            }
            return 'dateTimeUtcView.html';
        }

        self.doAdd = function (source) {
            var name = tools.getType(source);
            var obj = source.newInstance().unique();
            self.doEdit(obj);
        };

        self.doEdit = function (item) {
            dialogService.doPopupDialog({
                root: self,
                context: item,
                headerTemplate: 'editEntityHeader.html',
                bodyTemplate: 'editEntityBody.html',
                footerTemplate: 'editEntityFooter.html',
            });
        };

        self.addNode = function () {
            var node = nodeDB.newInstance({
                id: nodeDB.items.length + 1,
                dateTimeUtc: new Date(),
                description: 'the description',
                place: placeDB.newInstance({
                    name: 'unknown',
                    geoLocation: locationDB.newInstance()
                }),
            });
            editNode(node);
        };

    });

 
}(foApp, Foundry, Foundry.tools));

