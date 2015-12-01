
/// <reference path="../wwwroot/foundry.js" />

var foApp = angular.module('foApp', []);



foApp.controller('workspaceController', function (dataService, ontologyService, render3DService) {

    var plane;
    var self = this;

    render3DService.init('earth');

    function noop() { };

    render3DService.animate();
    render3DService.setAnimation(noop);

    var EARTH_RADIUS = 637;



    self.title = 'flight actions';

    self.doSpin = function (dir) {
        var angle = 0;
        render3DService.removeGlobe();

        func = {
            x: function () {
                plane.rotateXYZ((angle).toRad(), 0, 0);
                angle += 1.0;
            },
            y: function () {
                plane.rotateXYZ(0, (angle).toRad(), 0);
                angle += 1.0;
            },
            z: function () {
                plane.rotateXYZ(0, 0, (angle).toRad());
                angle += 1.0;
            },
        }

        func[dir] && render3DService.setAnimation(func[dir]);
    }

    self.doSlide = function (dir) {
        var delta = 0;
        render3DService.removeGlobe();

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
        }

        func[dir] && render3DService.setAnimation(func[dir]);
    }
    self.doScale = function (dir) {
        var scale = 15;
        render3DService.removeGlobe();

        func = {
            big: function () {
                plane.scaleXYZ(scale, scale, scale);
                scale += 1.0;
            },
            small: function () {
                plane.scaleXYZ(scale, scale, scale);
                scale -= 1.0;
            },
        }

        func[dir] && render3DService.setAnimation(func[dir]);
    }

    self.doSize = function (dir) {
        if (plane.size === undefined) {
            plane.size = 15;
        }

        func = {
            enlarge: function () {
                plane.scaleXYZ(plane.size, plane.size, plane.size);
                plane.size += 1.0;
            },
            shrink: function () {
                plane.scaleXYZ(plane.size, plane.size, plane.size);
                plane.size -= 1.0;
            },
        }
        func[dir] && func[dir]();

    }

    self.doCircle = function (dir) {
        var angle = 0;
        var center = { x: 0, y: 0, z: 0 };
        render3DService.removeGlobe();


        func = {
            left: function () {
                //circle around y axis to the left
                var radius = EARTH_RADIUS;
                center = { x: radius, y: 0, z: radius };
                var rad = (180 + angle).toRad();
                var x = radius * Math.sin(rad) - center.x;
                var z = radius * Math.cos(rad) + center.z;
                plane.positionXYZ(x, 0, z);
                plane.rotateXYZ(0, (angle).toRad(), 0);

                angle += 1.0;
            },
            right: function () {
                //circle around y axis to the left
                var radius = EARTH_RADIUS;
                center = { x: 0, y: 0, z: radius };
                var rad = (angle).toRad();
                var x = -radius * Math.sin(rad) - center.x;
                var z = radius * Math.cos(rad) - center.z;
                plane.positionXYZ(x, 0, z);
                plane.rotateXYZ(0, (-angle).toRad(), 0);
                angle += 1.0;
            },
            up: function () {
                //circle around z axis to inside loop
                var radius = EARTH_RADIUS;
                center = { x: 0, y: radius, z: 0 };
                var rad = (180 + angle).toRad();
                var x = radius * Math.sin(rad) - center.x;
                var y = radius * Math.cos(rad) + center.y;
                plane.positionXYZ(x, y, 0);
                plane.rotateXYZ(0, 0, (-angle).toRad());

                angle += 1.0;
            },
            down: function () {
                //circle around z axis to outside loop
                var radius = EARTH_RADIUS;
                center = { x: 0, y: radius, z: 0 };
                var rad = (angle).toRad();
                var x = -radius * Math.sin(rad) + center.x;
                var y = radius * Math.cos(rad) - center.y;
                plane.positionXYZ(x, y, 0);
                plane.rotateXYZ(0, 0, (angle).toRad());

                angle += 1.0;
            },
            near: function () {
                //circle around x axis towards me
                var radius = EARTH_RADIUS;
                center = { x: radius, y: 0, z: 0 };
                var rad = (angle).toRad();
                var z = radius * Math.sin(rad) + center.z;
                var y = radius * Math.cos(rad) - center.y;
                plane.positionXYZ(0, y, z);
                plane.rotateXYZ(0, (90).toRad(), (angle).toRad());

                angle += 1.0;
            },
            far: function () {
                //circle around x axis towards me
                var radius = EARTH_RADIUS;
                center = { x: radius, y: 0, z: 0 };
                var rad = (angle).toRad();
                var z = -radius * Math.sin(rad) + center.z;
                var y = radius * Math.cos(rad) - center.y;
                plane.positionXYZ(0, y, z);
                plane.rotateXYZ(0, (-90).toRad(), (angle).toRad());

                angle += 1.0;
            },
        }

        func[dir] && render3DService.setAnimation(func[dir]);
    }


    self.doCircleGlobe = function (dir) {
        var angle = 0;
        var center = { x: 0, y: 0, z: 0 };
        render3DService.addGlobe(true);


        func = {
            left: function () {
                //circle around y axis to the left
                var radius = EARTH_RADIUS;
                center = { x: radius, y: 0, z: radius };
                var rad = (180 + angle).toRad();
                var x = radius * Math.sin(rad) - center.x;
                var z = radius * Math.cos(rad) + center.z;
                plane.positionXYZ(x, 0, z);
                plane.rotateXYZ(0, (angle).toRad(), 0);

                angle += 1.0;
            },
            right: function () {
                //circle around y axis to the left
                var radius = EARTH_RADIUS;
                center = { x: 0, y: 0, z: radius };
                var rad = (angle).toRad();
                var x = -radius * Math.sin(rad) - center.x;
                var z = radius * Math.cos(rad) - center.z;
                plane.positionXYZ(x, 0, z);
                plane.rotateXYZ(0, (-angle).toRad(), 0);
                angle += 1.0;
            },
            up: function () {
                //circle around z axis to inside loop
                var radius = EARTH_RADIUS;
                center = { x: 0, y: radius, z: 0 };
                var rad = (180 + angle).toRad();
                var x = radius * Math.sin(rad) - center.x;
                var y = radius * Math.cos(rad) + center.y;
                plane.positionXYZ(x, y, 0);
                plane.rotateXYZ(0, 0, (-angle).toRad());

                angle += 1.0;
            },
            down: function () {
                //circle around z axis to outside loop
                var radius = EARTH_RADIUS;
                center = { x: 0, y: radius, z: 0 };
                var rad = (angle).toRad();
                var x = -radius * Math.sin(rad) + center.x;
                var y = radius * Math.cos(rad) - center.y;
                plane.positionXYZ(x, y, 0);
                plane.rotateXYZ(0, 0, (angle).toRad());

                angle += 1.0;
            },
            near: function () {
                //circle around x axis towards me
                var radius = EARTH_RADIUS;
                center = { x: radius, y: 0, z: 0 };
                var rad = (angle).toRad();
                var z = radius * Math.sin(rad) + center.z;
                var y = radius * Math.cos(rad) - center.y;
                plane.positionXYZ(0, y, z);
                plane.rotateXYZ(0, (90).toRad(), (angle).toRad());

                angle += 1.0;
            },
            far: function () {
                //circle around x axis towards me
                var radius = EARTH_RADIUS;
                center = { x: radius, y: 0, z: 0 };
                var rad = (angle).toRad();
                var z = -radius * Math.sin(rad) + center.z;
                var y = radius * Math.cos(rad) - center.y;
                plane.positionXYZ(0, y, z);
                plane.rotateXYZ(0, (-90).toRad(), (angle).toRad());

                angle += 1.0;
            },
        }

        func[dir] && render3DService.setAnimation(func[dir]);
    }

    //render3DService.loadModel('beech99', 'models/beech99.js')
    render3DService.loadModel('707', 'models/707.js')
    .then(function (planeModel) {

        plane = planeModel.create();
        self.doStop = function () {
            render3DService.setAnimation(noop);
            plane.scaleXYZ(15, 15, 15);
            plane.positionXYZ(0, 0, 0);
            plane.rotateXYZ(0, 0, 0);
        };

        self.doStop();



    });
});