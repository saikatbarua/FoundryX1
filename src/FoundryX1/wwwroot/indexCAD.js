

var foApp = angular.module('foApp', ['ui.bootstrap']);

(function (app, fo, tools, ops, undefined) {

    //load templares for dialogs and shapes...
    tools.loadTemplate('foundry/foundry.ui.ngdialog.html');
    tools.loadTemplate('indexCad.ui.html');

    app.controller('workspaceController', function (dataService, ontologyLocationService, render3DService, dialogService) {

        var self = this;
        var locationDB = ontologyLocationService.locationDB;
        var placeDB = ontologyLocationService.placeDB;
        var nodeDB = ontologyLocationService.nodeDB;

        self.locationDB = locationDB;
        self.placeDB = placeDB;
        self.nodeDB = nodeDB;

        var scene = render3DService.init('earth');
        render3DService.animate();
        //render3DService.addGlobe(true);

        var EARTH_RADIUS = 637;
        var radius = EARTH_RADIUS + 20;

        self.doAdd = function () {
            render3DService.loadModel('707', 'models/707.js')
                .then(function (def) {
                    var plane = def.create();
                    //var angle = i * Math.PI / 180;
                    //var pitch = (270 + i) * Math.PI / 180;
                    //plane.positionXYZ(radius * Math.cos(angle), radius * Math.sin(angle), 0);
                    //plane.rotateOnZ(pitch)
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



        function renderModel(list, modelDef) {
            list.forEach(function (item) {
                var model = modelDef.create();
                model.position(latLongToVector3(item.latitude, item.longitude, radius, item.currentAltitude | 0));

                var phi = (item.latitude) * Math.PI / 180;
                var theta = (item.longitude) * Math.PI / 180;

                model.rotateOnY(theta);
            });

        }



        //var key = 1;
        //for (var lat = 0; lat < 1; lat += 10) {
        //    for (var lng = 0; lng <= 180; lng += 15) {
        //        placeDB.newInstance({
        //            id: key++,
        //            name: key,
        //            geoLocation: locationDB.newInstance({
        //                latitude: lat,
        //                longitude: lng,
        //            })
        //        });
        //    }
        //}


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

