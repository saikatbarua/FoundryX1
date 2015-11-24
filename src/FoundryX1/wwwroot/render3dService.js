// angular service directive

var Scene3D = Scene3D || {};
var Foundry = Foundry || {};

(function (fo, geo, undefined) {

    //Earth radius is the distance from the Earth's center to its surface, about 6,371 kilometers (3,959 mi). 

    var camera, scene, renderer, controls, earth;

    var EARTH_RADIUS = 637;

    // couple of constants
    var POS_X = 1800;
    var POS_Y = 500;
    var POS_Z = 1800;
    var WIDTH = 1000;
    var HEIGHT = 600;

    var FOV = 45;
    var NEAR = 1;
    var FAR = 4000;

    //vars
    var goLeft = false;
    var goRight = false;
    var goUp = false;
    var goDown = false;



    //arrow keys pressed
    document.addEventListener("keydown", keyDownTextField, false);
    function keyDownTextField(e) {
        if (e.keyCode == 37) {  //left arrow
            goLeft = true
            goRight = false
        }
        if (e.keyCode == 39) { //right arrow
            goRight = true
            goLeft = false
        }
        if (e.keyCode == 38) {  //up arrow
            goDown = true
            goUp = false
        }
        if (e.keyCode == 40) { //down arrow
            goUp = true
            goDown = false
        }
    };

    document.addEventListener("keyup", keyUpTextField, false);

    function keyUpTextField(e) {
        goLeft = false
        goRight = false
        goUp = false
        goDown = false
    };

    //https://github.com/envisprecisely/THREE2STL
    function stlFromGeometry(geometry, options) {

        // calculate the faces and normals if they are not yet present
        geometry.computeFaceNormals()

        var addX = 0
        var addY = 0
        var addZ = 0
        var download = false

        if (options) {
            if (options.useObjectPosition) {
                addX = geometry.mesh.position.x
                addY = geometry.mesh.position.y
                addZ = geometry.mesh.position.z
            }

            if (options.download) {
                download = true
            }
        }


        var facetToStl = function (verts, normal) {
            var faceStl = ''
            faceStl += 'facet normal ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n'
            faceStl += 'outer loop\n'

            for (var j = 0; j < 3; j++) {
                var vert = verts[j]
                faceStl += 'vertex ' + (vert.x + addX) + ' ' + (vert.y + addY) + ' ' + (vert.z + addZ) + '\n'
            }

            faceStl += 'endloop\n'
            faceStl += 'endfacet\n'

            return faceStl
        }

        // start bulding the STL string
        var stl = ''
        stl += 'solid\n'

        for (var i = 0; i < geometry.faces.length; i++) {
            var face = geometry.faces[i]

            // if we have just a griangle, that's easy. just write them to the file
            if (face.d === undefined) {
                var verts = [
                    geometry.vertices[face.a],
                    geometry.vertices[face.b],
                    geometry.vertices[face.c]
                ]

                stl += facetToStl(verts, face.normal)

            } else {
                // if it's a quad, we need to triangulate it first
                // split the quad into two triangles: abd and bcd
                var verts = []
                verts[0] = [
                    geometry.vertices[face.a],
                    geometry.vertices[face.b],
                    geometry.vertices[face.d]
                ]
                verts[1] = [
                    geometry.vertices[face.b],
                    geometry.vertices[face.c],
                    geometry.vertices[face.d]
                ]

                for (var k = 0; k < 2; k++) {
                    stl += facetToStl(verts[k], face.normal)
                }

            }
        }

        stl += 'endsolid'

        if (download) {
            document.location = 'data:Application/octet-stream, ' + encodeURIComponent(stl)
        }

        return stl
    }

    /**
     * Based on https://github.com/mrdoob/three.js/blob/a72347515fa34e892f7a9bfa66a34fdc0df55954/examples/js/exporters/STLExporter.js
     * Tested on r68 and r70
     * @author kjlubick / https://github.com/kjlubick
     * @author kovacsv / http://kovacsv.hu/
     * @author mrdoob / http://mrdoob.com/
     */
    
    
    var parseStl = (function () {

            var vector = new THREE.Vector3();
            var normalMatrixWorld = new THREE.Matrix3();

            return function (scene) {

                var output = '';

                output += 'solid exported\n';

                scene.traverse(function (object) {

                    if (object instanceof THREE.Mesh) {

                        var geometry = object.geometry;
                        var matrixWorld = object.matrixWorld;
                        var mesh = object;

                        if (geometry instanceof THREE.Geometry) {

                            var vertices = geometry.vertices;
                            var faces = geometry.faces;

                            normalMatrixWorld.getNormalMatrix(matrixWorld);

                            for (var i = 0, l = faces.length; i < l; i++) {
                                var face = faces[i];

                                vector.copy(face.normal).applyMatrix3(normalMatrixWorld).normalize();

                                output += '\tfacet normal ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';
                                output += '\t\touter loop\n';

                                var indices = [face.a, face.b, face.c];

                                for (var j = 0; j < 3; j++) {
                                    var vertexIndex = indices[j];
                                    if (mesh.geometry.skinIndices.length == 0) {
                                        vector.copy(vertices[vertexIndex]).applyMatrix4(matrixWorld);
                                        output += '\t\t\tvertex ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';
                                    } else {
                                        vector.copy(vertices[vertexIndex]); //.applyMatrix4( matrixWorld );

                                        // see https://github.com/mrdoob/three.js/issues/3187
                                        boneIndices = [];
                                        boneIndices[0] = mesh.geometry.skinIndices[vertexIndex].x;
                                        boneIndices[1] = mesh.geometry.skinIndices[vertexIndex].y;
                                        boneIndices[2] = mesh.geometry.skinIndices[vertexIndex].z;
                                        boneIndices[3] = mesh.geometry.skinIndices[vertexIndex].w;

                                        weights = [];
                                        weights[0] = mesh.geometry.skinWeights[vertexIndex].x;
                                        weights[1] = mesh.geometry.skinWeights[vertexIndex].y;
                                        weights[2] = mesh.geometry.skinWeights[vertexIndex].z;
                                        weights[3] = mesh.geometry.skinWeights[vertexIndex].w;

                                        inverses = [];
                                        inverses[0] = mesh.skeleton.boneInverses[boneIndices[0]];
                                        inverses[1] = mesh.skeleton.boneInverses[boneIndices[1]];
                                        inverses[2] = mesh.skeleton.boneInverses[boneIndices[2]];
                                        inverses[3] = mesh.skeleton.boneInverses[boneIndices[3]];

                                        skinMatrices = [];
                                        skinMatrices[0] = mesh.skeleton.bones[boneIndices[0]].matrixWorld;
                                        skinMatrices[1] = mesh.skeleton.bones[boneIndices[1]].matrixWorld;
                                        skinMatrices[2] = mesh.skeleton.bones[boneIndices[2]].matrixWorld;
                                        skinMatrices[3] = mesh.skeleton.bones[boneIndices[3]].matrixWorld;

                                        var finalVector = new THREE.Vector4();
                                        for (var k = 0; k < 4; k++) {
                                            var tempVector = new THREE.Vector4(vector.x, vector.y, vector.z);
                                            tempVector.multiplyScalar(weights[k]);
                                            //the inverse takes the vector into local bone space
                                            tempVector.applyMatrix4(inverses[k])
                                            //which is then transformed to the appropriate world space
                                            .applyMatrix4(skinMatrices[k]);
                                            finalVector.add(tempVector);
                                        }
                                        output += '\t\t\tvertex ' + finalVector.x + ' ' + finalVector.y + ' ' + finalVector.z + '\n';
                                    }
                                }
                                output += '\t\tendloop\n';
                                output += '\tendfacet\n';
                            }
                        }
                    }

                });

                output += 'endsolid exported\n';

                return output;
            };
        }())


    // Use FileSaver.js 'saveAs' function to save the string
    function saveSTL(scene, name) {
        //var exporter = new THREE.STLExporter();
        var stlString = parseStl(scene);

       // var stlString = stlFromGeometry(scene);
        var blob = new Blob([stlString], { type: 'text/plain' });

        saveAs(blob, name + '.stl');
    }

    geo.export = function (name) {
        saveSTL(scene, name || 'scene');
    }

    geo.init = function (id) {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer();

        //http://stackoverflow.com/questions/10341224/render-three-js-into-a-div-element
        var container = document.getElementById(id);
        if (container) {
            camera.aspect = container.offsetWidth / container.offsetHeight;

            renderer.setSize(container.offsetWidth, container.offsetHeight);
            container.appendChild(renderer.domElement);
        } else {
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
        }

        function onWindowResize() {
            if (container) {
                camera.aspect = container.offsetWidth / container.offsetHeight;
                renderer.setSize(container.offsetWidth, container.offsetHeight);
            } else {
                camera.aspect = window.innerWidth / window.innerHeight;
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
            camera.updateProjectionMatrix();
        }

        window.addEventListener('resize', onWindowResize, false);


        controls = new THREE.OrbitControls(camera, renderer.domElement);
        //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;

        addLights();
        addLight();
        geo.render();
        return scene;
    }

    //http://stackoverflow.com/questions/21229929/move-camera-to-a-fixed-position-and-axis
    geo.zoomToPos = function (pos) {
        //camera.lookAt(pos);
        camera.position.set(pos.x, pos.y, pos.z);
    }

    geo.addGlobe = function (noTexture) {
        var mat2;
        var spGeo = new THREE.SphereGeometry(EARTH_RADIUS, 50, 50);

        if (!noTexture) {
            var planetTexture = THREE.ImageUtils.loadTexture("assets/world-big-2-grey.jpg");
            mat2 = new THREE.MeshPhongMaterial({
                map: planetTexture,
                shininess: 0.2
            });
        } else {
            mat2 = new THREE.MeshBasicMaterial({
                color: 0x11ff11,
                wireframe: true
            });
        }

        var mesh = new THREE.Mesh(spGeo, mat2);
        scene.add(mesh);
        return mesh;
    }

 
    geo.render = function() {
        controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true

        if (goLeft)
            rotateOnAxis(earth, axisZ, 0.08); // CHANGED

        if (goRight)
            rotateOnAxis(earth, axisZ, -0.08); // CHANGED

        if (goUp)
            rotateOnAxis(earth, axisX, 0.08); // CHANGED

        if (goDown)
            rotateOnAxis(earth, axisX, -0.08); // CHANGED

        renderer.render(scene, camera);
    }

    //http://projects.defmech.com/ThreeJSObjectRotationWithQu        
    /// <summary>
    /// 
    /// </summary>
    /// <param name="rotateStart" type="type"></param>
    /// <param name="rotateEnd" type="type"></param>
    /// <returns type=""></returns>
    function rotateMatrix(rotateStart, rotateEnd) {
        var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion();

        var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

        if (angle) {
            axis.crossVectors(rotateStart, rotateEnd).normalize();
            angle *= rotationSpeed;
            quaternion.setFromAxisAngle(axis, angle);
        }
        return quaternion;
    }

    // Rotate an object around an arbitrary axis in object space
    var rotObjectMatrix;
    function rotateAroundObjectAxis(object, axis, radians) {
        rotObjectMatrix = new THREE.Matrix4();
        rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

        // old code for Three.JS pre r54:
        // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
        // new code for Three.JS r55+:
        object.matrix.multiply(rotObjectMatrix);

        // old code for Three.js pre r49:
        // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
        // old code for Three.js r50-r58:
        // object.rotation.setEulerFromRotationMatrix(object.matrix);
        // new code for Three.js r59+:
        object.rotation.setFromRotationMatrix(object.matrix);
    }

    var rotWorldMatrix;
    // Rotate an object around an arbitrary axis in world space       
    function rotateAroundWorldAxis(object, axis, radians) {
        rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

        // old code for Three.JS pre r54:
        //  rotWorldMatrix.multiply(object.matrix);
        // new code for Three.JS r55+:
        rotWorldMatrix.multiply(object.matrix);                // pre-multiply

        object.matrix = rotWorldMatrix;

        // old code for Three.js pre r49:
        // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
        // old code for Three.js pre r59:
        // object.rotation.setEulerFromRotationMatrix(object.matrix);
        // code for r59+:
        object.rotation.setFromRotationMatrix(object.matrix);
    }

    //So you should call these functions within your anim function (requestAnimFrame callback), resulting in a rotation of 90 degrees on the x-axis:
    //   var xAxis = new THREE.Vector3(1,0,0);
    //    rotateAroundWorldAxis(mesh, xAxis, Math.PI / 180);


    http://chimera.labs.oreilly.com/books/1234000000802/ch04.html#shadows

    var axisX = new THREE.Vector3(1, 0, 0); // CHANGED
    var axisY = new THREE.Vector3(0, 1, 0); // CHANGED
    var axisZ = new THREE.Vector3(0, 0, 1); // CHANGED

    var mesh3D = fo.defineClass('mesh3D', fo.Node, {mesh: '',});
    //Prototype defines functions using JSON syntax
    fo.tools.mixin(mesh3D.prototype, {
        normal: function (angleX, angleY, angleZ) {
            var mesh = this.mesh;
            mesh.matrix = new THREE.Matrix4();
        },
        rotateXYZ: function (angleX, angleY, angleZ) {
            var mesh = this.mesh;
            mesh.rotation.x = angleX;
            mesh.rotation.y = angleY;
            mesh.rotation.z = angleZ;
        },
        scaleXYZ: function (X, Y, Z) {
            var mesh = this.mesh;
            mesh.scale.set(X, Y, Z);
        },
        rotateOnX: function (angle) {
            var mesh = this.mesh;
            rotateAroundObjectAxis(mesh, axisX, angle);
        },
        rotateOnY: function (angle) {
            var mesh = this.mesh;
            rotateAroundObjectAxis(mesh, axisY, angle);
        },
        rotateOnZ: function (angle) {
            var mesh = this.mesh;
            rotateAroundObjectAxis(mesh, axisZ, angle);
        },
        positionXYZ: function (X, Y, Z) {
            var mesh = this.mesh;
            mesh.position.setX(X);
            mesh.position.setY(Y);
            mesh.position.setZ(Z);
        },
        position: function (pos) {
            this.positionXYZ(pos.x, pos.y, pos.z);
        },
        spin: function (angle) {
            this.rotateOnX(angle);
            //var mesh = this.mesh;
           // var xAxis = new THREE.Vector3(1,0,0);
            //rotateAroundObjectAxis(mesh, xAxis, Math.PI / 180);
            //mesh.rotation.y += 0.02;
        }
    });

    var makeMesh3D = function (properties, subcomponents, parent) {
        return new mesh3D(properties, subcomponents, parent);
    };

    var meshDef = fo.establishType('three::mesh', {
        mesh: 'xxx',
    }, makeMesh3D);


    var model3D = fo.defineClass('model3D', fo.Node);

    var makeModel3D = function (properties, subcomponents, parent) {
        return new model3D(properties, subcomponents, parent);
    };
    //Prototype defines functions using JSON syntax
    fo.tools.mixin(model3D.prototype, {
        create: function (parent) {
            var instance = meshDef.newInstance({ mesh: new THREE.Mesh(this.geometry, this.material) });
            parent = parent ? parent : scene;
            parent.add(instance.mesh);
            return instance;
        }
    });


    var modelDB = fo.db.getEntityDB('three::model');
    geo.modelDB = modelDB;

    fo.establishType('three::model', {}, makeModel3D);

    geo.jsonLoader = new THREE.JSONLoader();
    geo.loadedModels = function (onComplete) {
        onComplete && onComplete(geo.modelDB.lookup);
        return geo.modelDB.items;
    };


    function loadModel(name, file, onComplete) {
        jsonLoader.load(file, function (geometry, materials) {
            modelDB.establishInstance({
                myName: name,
                geometry: geometry,
                material: new THREE.MeshFaceMaterial(materials),
            }, name, onComplete);
        });
    }



    // add a simple light
    function addLights() {
        light = new THREE.DirectionalLight(0x3333ee, 3.5, 500);
        scene.add(light);
        light.position.set(POS_X, POS_Y, POS_Z);
    }
    geo.addLights = addLights

    function addLight() {
        light = new THREE.AmbientLight(0x808080); // soft white light
        scene.add(light);
    }
    geo.addLight = addLight;



    function animate() {
        requestAnimationFrame(animate);

        controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true

        if (geo.onNextAnimationFrame) {
            geo.onNextAnimationFrame();
        };

        renderer.render(scene, camera);
    }
    geo.animate = animate;
    geo.onNextAnimationFrame;




    //http://www.smartjava.org/content/render-open-data-3d-world-globe-threejs
    // convert the positions from a lat, lon to a position on a sphere.
    geo.latLongToVector3 = function (lat, lon, radius, heigth) {
        radius = radius ? radius : EARTH_RADIUS;
        heigth = heigth ? heigth : 0;

        var phi = (lat) * Math.PI / 180;
        var theta = (lon - 180) * Math.PI / 180;

        var x = -(radius + heigth) * Math.cos(phi) * Math.cos(theta);
        var y = (radius + heigth) * Math.sin(phi);
        var z = (radius + heigth) * Math.cos(phi) * Math.sin(theta);

        return new THREE.Vector3(x, y, z);
    }

    geo.latLongToAngles = function (lat, lon, radius, heigth) {
        var phi = (lat) * Math.PI / 180;
        var theta = (lon - 180) * Math.PI / 180;

        var x = -1 * Math.cos(phi) * Math.cos(theta);
        var y = Math.sin(phi);
        var z = Math.cos(phi) * Math.sin(theta);

        return [x, y, z];
    }

    geo.primitive = function (type, data) {
        var geometry;
        type = data.type ? data.type : type;
        switch (type) {
            case 'block':
                geometry = new THREE.BoxGeometry(
                    data.width,
                    data.height,
                    data.depth,
                    data.widthSegments,
                    data.heightSegments,
                    data.depthSegments
                );
                break;
            case 'plane':
                geometry = new THREE.PlaneGeometry(
					data.width,
					data.height,
					data.widthSegments,
					data.heightSegments
                );
                break;
            case 'circle':
                geometry = new THREE.CircleGeometry(
					data.radius,
					data.segments,
					data.thetaStart,
					data.thetaLength
                ); break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(
                    data.radiusTop,
                    data.radiusBottom,
                    data.height,
                    data.radialSegments,
                    data.heightSegments,
                    data.openEnded,
                    data.thetaStart,
                    data.thetaLength
                );
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(
                    data.radius,
                    data.widthSegments,
                    data.heightSegments,
                    data.phiStart,
                    data.phiLength,
                    data.thetaStart,
                    data.thetaLength
                );
                break;
            case 'dodecahedron':
                geometry = new THREE.DodecahedronGeometry(
                    data.radius,
                    data.detail
                );
                break;
            case 'icosahedron':
                geometry = new THREE.IcosahedronGeometry(
                    data.radius,
                    data.detail
                );
                break;
            case 'octahedron':
                geometry = new THREE.OctahedronGeometry(
                    data.radius,
                    data.detail
                );
                break;
            case 'tetrahedron':
                geometry = new THREE.TetrahedronGeometry(
                    data.radius,
                    data.detail
                );
                break;
            case 'ring':
                geometry = new THREE.RingGeometry(
                    data.innerRadius,
                    data.outerRadius,
                    data.thetaSegments,
                    data.phiSegments,
                    data.thetaStart,
                    data.thetaLength
                );
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(
                    data.radius,
                    data.tube,
                    data.radialSegments,
                    data.tubularSegments,
                    data.arc
                );
                break;
            case 'knot':
                geometry = new THREE.TorusKnotGeometry(
                    data.radius,
                    data.tube,
                    data.radialSegments,
                    data.tubularSegments,
                    data.p,
                    data.q,
                    data.heightScale
                );
                break;
            case 'text':
                geometry = new THREE.TextGeometry(
                    data.text,
                    data.data
                );
                break;
        }
        return geometry;
    }

 

}(Foundry, Scene3D));



(function (app, tools, geo, undefined) {

    app.service('render3DService', function ($location, $q) {

        function getHttpContext() {
            if (location) {
                return location.protocol + "//" + location.host + location.pathname.slice(0, location.pathname.indexOf('/', 1));
            }
        };

        this.THREE = THREE;

        this.init = geo.init;
        this.export = geo.export;
        this.animate = geo.animate;
        this.addGlobe = geo.addGlobe;
        this.latLongToVector3 = geo.latLongToVector3;
        this.latLongToAngles = geo.latLongToAngles;
        this.zoomToPos = geo.zoomToPos;

        this.setAnimation = function (funct) {
            geo.onNextAnimationFrame = funct;
        }

        //this.renderNodes = function (list) {
        //    list.forEach(function (item) {
        //        var pos = [item.place.geoLocation.latitude, item.place.geoLocation.longitude];
        //        //map.setView(pos, 13);
        //        //leaflet.marker(pos).addTo(map).bindPopup(item.description)
        //    });
        //}

        function loadModel(name, file) {
            var deferred = $q.defer();

            geo.jsonLoader.load(file, function (geometry, materials) {
                var model = geo.modelDB.establishInstance({
                    myName: name,
                    geometry: geometry,
                    material: new THREE.MeshFaceMaterial(materials),
                }, name);
                deferred.resolve(model);
            });

            return deferred.promise;
        }

        //http://stackoverflow.com/questions/26456410/three-js-lines-normal-to-a-sphere
        function primitive(name, specs) {
            var deferred = $q.defer();
            var material = {
                color: 0xff0000,
                wireframe: false
            };

            var model = geo.modelDB.establishInstance({
                myName: name,
                geometry: geo.primitive(name, specs),
                material: new THREE.MeshBasicMaterial(tools.union(material,specs)),
            }, name);

            deferred.resolve(model);

            return deferred.promise;
        }


        this.loadModel = loadModel;
        this.primitive = primitive;


    });

}(foApp, Foundry.tools, Scene3D));