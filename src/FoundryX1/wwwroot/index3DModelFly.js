
/// <reference path="../wwwroot/foundry.js" />

var foApp = angular.module('foApp', []);



foApp.controller('viewerController', function (dataService, ontologyService, render3DService) {

    var EARTH_RADIUS = 637;

    var element = document.getElementById('earth');
    render3DService.init(element);
    render3DService.animate();
        
    render3DService.addGlobe();
        
    var planes = [];
    var radius = EARTH_RADIUS + 20;

    var r = 0;
    render3DService.setAnimation(function () {
        var angle = r * Math.PI / 180;
        var pitch = (270 + r) * Math.PI / 180;
        var list = planes[0] ? [planes[0]] : []
        list.forEach(function (item) {
            item.positionXYZ(radius * Math.cos(angle), radius * Math.sin(angle), 0);
            item.rotateOnZ(Math.PI / 180);  //this will acumlate...

        });
        r = r > 360 ? 0 : r + 1;
    });


    function positionModel(min, max, def){
        for (var i = min; i < max; i += 15) {
            var plane = def.create();
            var angle = i * Math.PI / 180;
            var pitch = (270 + i ) * Math.PI / 180;
            plane.positionXYZ(radius * Math.cos(angle), radius * Math.sin(angle), 0);
            plane.rotateOnZ(pitch);
            planes.push(plane);
        }
    }

    render3DService.loadModel('707', 'models/707.js')
        .then(function(planeModel) {
            positionModel(0,90, planeModel);
            return render3DService.loadModel('beech99', 'models/beech99.js')
        })
        .then(function(planeModel) {
            positionModel(90,180, planeModel);
            return render3DService.loadModel('c-2a', 'models/c-2a.js')
        })
        .then(function(planeModel) {
            positionModel(90,180, planeModel);
        });
});