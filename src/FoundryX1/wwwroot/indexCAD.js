

var foApp = angular.module('foApp', ['ui.bootstrap']);

(function (app, fo, tools, ops, undefined) {

    //load templares for dialogs and shapes...
    tools.loadTemplate('foundry/foundry.ui.ngdialog.html');
    tools.loadTemplate('indexCad.ui.html');

    app.controller('workspaceController', function (dataService, render3DService, dialogService) {

        var self = this;

        var space = fo.makeModelWorkspace('steve');
        self.space = space;
        var model = space.rootModel;
        self.model = model;


        var scene = render3DService.init('cadWorld');
        render3DService.animate();

        var block = fo.establishType('cad::block', {
            width: 10,
            height: 20,
            depth: 40,
            area: function () { return this.width * this.height; },
            volume: function () { return this.width * this.height * this.depth; },
        }, fo.makeComponent);

        var plane = fo.establishType('cad::plane', {
            width: 10,
            height: 20,
            depth: 40,
        }, fo.makeComponent);


        var currentRoot = model;

        self.doAddPlane = function () {
            var obj = plane.newInstance().unique();
            model.capture(obj);


            render3DService.loadModel('707', 'models/707.js')
                .then(function (def) {
                    var plane = def.create();
                    //var angle = i * Math.PI / 180;
                    //var pitch = (270 + i) * Math.PI / 180;
                    //plane.positionXYZ(radius * Math.cos(angle), radius * Math.sin(angle), 0);
                    //plane.rotateOnZ(pitch)
                })
        }



        self.doAddBlock = function () {
            var obj = block.newInstance().unique();

            currentRoot.capture(obj);
            currentRoot = obj;


            var spec = obj.getSpec();
            render3DService.primitive('block', spec)
                .then(function (def) {
                    obj.geom = def.create();
                })
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


        //render3DService.primitive('block', { width: 5, height: 200, depth: 5})
        //.then(function (block) {

        //    placeDB.items.forEach(function (item) {

        //         add dummy object along wich we can rotate the bar for the longitute
        //        var dummyLng = new THREE.Mesh(
        //                          new THREE.PlaneGeometry(1, 1, 0, 0),
        //                          new THREE.MeshLambertMaterial({ color: 0xCCCCCC }));

        //        scene.add(dummyLng);

        //         add dummy object along wich we can rotate the bar for the latitude
        //        var dummyLat = new THREE.Mesh(
        //                          new THREE.PlaneGeometry(1, 1, 0, 0),
        //                          new THREE.MeshLambertMaterial({ color: 0xCCCCCC }));

        //        dummyLng.add(dummyLat);

        //        var model = block.create(dummyLat);
        //        var geo = item.geoLocation;
        //        var pos = render3DService.latLongToVector3(geo.latitude, geo.longitude, 0, 100);
        //        model.position(pos);

        //        dummyLng.position.setX(pos.x);
        //        dummyLng.position.setY(pos.y);
        //        dummyLng.position.setZ(pos.z);


        //        var x = Math.PI / 2 - (geo.latitude).toRad();
        //        dummyLat.rotation.x = x;
        //        var y = Math.PI + (geo.longitude).toRad();
        //        dummyLng.rotation.y = y;
        //        model.rotateXYZ(x,y,0)
        //    });

        //});


    });


})(foApp, Foundry, Foundry.tools,  Foundry.listOps);

