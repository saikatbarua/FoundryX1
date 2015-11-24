
/// <reference path="../wwwroot/foundry.js" />

var foApp = angular.module('foApp', []);



foApp.controller('viewerController', function (dataService, ontologyService, render3DService) {

    var element = document.getElementById('earth');
    render3DService.init(element);
    render3DService.animate();

    var plane


    render3DService.loadModel('beech99', 'models/beech99.js')
    .then(function (planeModel) {

        plane = planeModel.create();
        plane.scaleXYZ(5, 5, 5);
        plane.positionXYZ(0, 0, 0);
        plane.rotateXYZ(0, 0, 0);

        plane = planeModel.create();
        plane.scaleXYZ(5, 5, 5);
        plane.positionXYZ(500, 0, 0);
        plane.rotateXYZ(Math.PI / 2, 0, 0);

        plane = planeModel.create();
        plane.scaleXYZ(5, 5, 5);
        plane.positionXYZ(1000, 0, 0);
        plane.rotateXYZ(0, Math.PI / 2, 0);

        plane = planeModel.create();
        plane.scaleXYZ(5, 5, 5);
        plane.positionXYZ(1500, 0, 0);
        plane.rotateXYZ(0, 0, Math.PI / 2);


    });
});