
/// <reference path="../wwwroot/foundry.js" />

var foApp = angular.module('foApp', []);



foApp.controller('workspaceController', function (dataService, ontologyService, render3DService) {

    var plane;
    var self = this;

    render3DService.init('earth');

    function noop() { };

    render3DService.animate();
    render3DService.setAnimation(noop);


    self.title = 'flight actions';

    



    render3DService.loadModel('beech99', 'models/beech99.js')
    .then(function (planeModel) {

        plane = planeModel.create();
        self.doStop = function () {
            render3DService.setAnimation(noop);
            plane.scaleXYZ(15, 15, 15);
            plane.positionXYZ(0, 0, 0);
            plane.rotateXYZ(0, 0, 0);
        };

        self.doStop();


        self.doSpin = function (dir) {
            var angle = 0;

            func = {
                x: function() {
                    plane.rotateXYZ((angle).toRad(), 0, 0);
                    angle += 1.0;
                },
                y: function() {
                    plane.rotateXYZ(0, (angle).toRad(), 0);
                    angle += 1.0;
                },
                z: function() {
                    plane.rotateXYZ(0,0,(angle).toRad());
                    angle += 1.0;
                },
            }
            
            render3DService.setAnimation(func[dir]);
        }

        self.doSlide = function (dir) {
            var delta = 0;
            var scale = 15;

            func = {
                left: function () {
                    plane.positionXYZ(delta, 0, 0);
                    delta -= 1.0;
                },
                right: function () {
                    plane.positionXYZ(delta, 0, 0);
                    delta += 1.0;
                },
                up: function () {
                    plane.positionXYZ(0, delta, 0);
                    delta += 1.0;
                },
                down: function () {
                    plane.positionXYZ(0, delta, 0);
                    delta -= 1.0;
                },
                near: function () {
                    plane.positionXYZ(0, 0, delta);
                    delta += 1.0;
                },
                far: function () {
                    plane.positionXYZ(0, 0, delta);
                    delta -= 1.0;
                },
                big: function () {
                    plane.scaleXYZ(scale, scale, scale);
                    scale += 1.0;
                },
                small: function () {
                    plane.scaleXYZ(scale, scale, scale);
                    scale -= 1.0;
                },
            }

            render3DService.setAnimation(func[dir]);
        }

    });
});