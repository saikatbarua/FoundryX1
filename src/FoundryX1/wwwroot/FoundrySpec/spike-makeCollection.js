
var foApp = angular.module('foApp', []);

(function (app, fo, undefined) {

    // angular service directive

    app.service('renderService', function () {

        var camera, scene, renderer, controls;
        var body;

        function init() {


            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.z = 1000;

            scene = new THREE.Scene();

            body = new THREE.Object3D();
            scene.add(body);


            renderer = new THREE.WebGLRenderer();

            renderer.setSize(0.6 * window.innerWidth, 0.6 * window.innerHeight);

            var element = document.getElementById('scene');
            element.appendChild(renderer.domElement);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.enableZoom = true;

            return body;
        }

        this.init = init;

        function animate() {
            requestAnimationFrame(animate);
            body.animate && body.animate();
            renderer.render(scene, camera);
        }

        this.animate = animate;


    });


    app.controller('workspaceController', function (renderService) {

        var self = this;
        this.title = 'Foundry Version ' + fo.version;
        this.spike = 'makeComponent';

        this.input = {
            height: 400,
            width: 400,
            depth: 400
        }

        THREE.Mesh.prototype.toJSON = function (meta) { return 'mesh'; };

        var rect = fo.meta.establishMetadata('spike::block', {
            width: { type: 'number' },
            height: { type: 'number' },
            depth: { type: 'number' },
            color: { type: 'color' },
            mesh: { type: 'THREE.Mesh' },
        });

        var block = fo.establishType('spike::block', {
            width: 300,
            height: 200,
            depth: 400,
            color: 0xff0000,
            mesh: function () {
                var geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
                var material = new THREE.MeshBasicMaterial({
                    color: this.color,
                    wireframe: false
                });

                var mesh = new THREE.Mesh(geometry, material);
                return mesh;

            }
        }, fo.makeComponent);



        var obj = block.newInstance();


        var block = fo.defineClass('block', fo.Component, block.getSpec(), function (properties, subcomponents, parent) {
            this.base.call(this, properties, subcomponents, parent);         
            return this;
        });


        var blocks = [obj, new block({
            height: 600,
            depth: function () { return this.height / 3; },
            color: 0x00ff00,
            x: function () {
                return obj.width / 2 + this.width / 2;
            },
            y: function () {
                return obj.height / 2;
            },
            z: function () {
                return obj.depth / 2 - this.depth / 2;;
            }
        })];


        this.answer1 = fo.tools.stringify(blocks, undefined, 3);

        var _mesh = obj.getManagedProperty('mesh');
        _mesh.onValueDetermined = function (newValue, formula, owner, oldValue) {
            console.log('changed =' + this.myName);
        }
        _mesh.onValueSmash = function (newValue, formula, owner) {
            console.log('onValueSmash =' + this.myName);
        }
        this.doUpdate = function () {
            obj.width = self.input.width;
            obj.height = self.input.height;
            obj.depth = self.input.depth;
            update(body);
        }

        //https://aerotwist.com/tutorials/creating-particles-with-three-js/
        var body = renderService.init();

        function update(group) {
            group.children = [];
            blocks.forEach(function (block) {
                block.mesh.position.setX(block.x || 0);
                block.mesh.position.setY(block.y || 0);
                block.mesh.position.setZ(block.z || 0);
                group.add(block.mesh);
            });
        }

        update(body);

        body.animate = function () {
            this.rotation.x += 0.01;
            this.rotation.y += 0.02;
            //this.rotation.z += 0.03;
        },

        renderService.animate();

    });

}(foApp, Foundry));