// angular service directive

var Scene3D = Scene3D || {};
var Foundry = Foundry || {};

(function (fo, geo, undefined) {

    // Converts numeric degrees to radians
    if (typeof (Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        }
    }
    if (typeof (Number.prototype.toDeg) === "undefined") {
        Number.prototype.toDeg = function () {
            return this * 180 / Math.PI;
        }
    }

    //Earth radius is the distance from the Earth's center to its surface, about 6,371 kilometers (3,959 mi). 

    var camera, scene, renderer, controls;
    var rootModel;

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


    ////*** Adding the globe ********
    ////******************************

    //// setting up the defuse map
    //var matDif = THREE.ImageUtils.loadTexture(staticUrl + "img/world_diffuse.jpg");

    //// setting up the bump map
    //var mapBump = THREE.ImageUtils.loadTexture(staticUrl + "img/world_bump.jpg");
    //mapBump.anisotropy = 1;
    //mapBump.repeat.set(1, 1);
    //mapBump.offset.set(0, 0)
    //mapBump.wrapS = mapBump.wrapT = THREE.RepeatWrapping;
    //mapBump.format = THREE.RGBFormat;

    //// setting up the material
    //var sphereMaterial = new THREE.MeshPhongMaterial({
    //    ambient: 0x444444,
    //    color: 0x777777,
    //    shininess: 40,
    //    specular: 0x222222,
    //    shading: THREE.SmoothShading,
    //    side: THREE.DoubleSide,
    //    map: matDif,
    //    bumpMap: mapBump,
    //    bumpScale: 10
    //});
    //// creaing the mesh
    //var globe = new THREE.Mesh(new THREE.SphereGeometry(globeRadius,
    //                                                      32,
    //                                                      32),
    //                            sphereMaterial);
    //globe.receiveShadow = true;
    //// add the globe to the scene
    //scene.add(globe);

    // focus the globe on a certain country
    //var cfoc = country[countryFocus];
    //globe.rotation.set(cfoc.lat.toRad(), Math.PI - cfoc.lng.toRad(), 0);




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

    geo.camera = function () {
        return camera;
    }

    geo.cameraPosition = function (x, y, z) {
        camera.position.x = x || 0;
        camera.position.y = y || 0;
        camera.position.z = z || 0;
        return camera;
    }
    //http://stackoverflow.com/questions/21229929/move-camera-to-a-fixed-position-and-axis
    geo.zoomToPos = function (pos) {
        //camera.lookAt(pos);
        camera.position.set(pos.x, pos.y, pos.z);
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


    //http://www.johannes-raida.de/tutorials/three.js/tutorial04/tutorial04.htm
    function applyMeshTransformation(mesh) {

        // apply local matrix on geometry
        mesh.updateMatrixWorld();
        mesh.geometry.applyMatrix(mesh.matrixWorld);

        // reset local matrix
        mesh.position.set(0, 0, 0);
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        mesh.updateMatrixWorld();
    };

    function exportObject(mesh) {

        var objExporter = new THREE.ObjectExporter();
        var output = JSON.stringify(objExporter.parse(mesh), null, '\t');
        output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        var blob = new Blob([output], { type: 'text/plain' });
        var objectURL = window.URL.createObjectURL(blob);

        window.open(objectURL, '_blank');

    };

    // Rotate an object around an arbitrary axis in object space
    // this may change the geometry
    function rotateAroundObjectAxis(object, axis, radians) {
        var rotObjectMatrix = new THREE.Matrix4();
        rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
        
        object.matrix.multiply(rotObjectMatrix);

        object.rotation.setFromRotationMatrix(object.matrix);
    }

    // Rotate an object around an arbitrary axis in world space       
    function rotateAroundWorldAxis(object, axis, radians) {
        var rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

        rotWorldMatrix.multiply(object.matrix);                // pre-multiply
        object.matrix = rotWorldMatrix;

        object.rotation.setFromRotationMatrix(object.matrix);
    }



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
            return this;
        },
        rotateXYZ: function (angleX, angleY, angleZ) {
            var mesh = this.mesh;
            mesh.rotation.x = angleX;
            mesh.rotation.y = angleY;
            mesh.rotation.z = angleZ;
            return this;
        },
        rotateClear: function () {
            var mesh = this.mesh;
            mesh.rotation.set(0, 0, 0);
            return this;
        },
        scaleXYZ: function (X, Y, Z) {
            var mesh = this.mesh;
            mesh.scale.set(X, Y, Z);
            return this;
        },
        rotateOnX: function (angle) {
            var mesh = this.mesh;
            mesh.rotateOnAxis(axisX, angle);
            return this;
        },
        rotateOnY: function (angle) {
            var mesh = this.mesh;
            mesh.rotateOnAxis(axisY, angle);
            return this;
        },
        rotateOnZ: function (angle) {
            var mesh = this.mesh;
            mesh.rotateOnAxis(axisZ, angle);
            return this;
        },
        //rotateToX: function (angle) {
        //    var mesh = this.mesh;
        //    mesh.rotation.x = 0;
        //    mesh.rotateOnAxis(axisX, angle);
        //    return this;
        //},
        //rotateToY: function (angle) {
        //    var mesh = this.mesh;
        //    mesh.rotation.y = 0;
        //    mesh.rotateOnAxis(axisY, angle);
        //    return this;
        //},
        //rotateToZ: function (angle) {
        //    var mesh = this.mesh;
        //    mesh.rotation.z = 0;
        //    mesh.rotateOnAxis(axisZ, angle);
        //    return this;
        //},
        positionClear: function () {
            var mesh = this.mesh;
            mesh.position.set(0, 0, 0);
            return this;
        },
        positionXYZ: function (X, Y, Z) {
            var mesh = this.mesh;
            mesh.position.setX(X);
            mesh.position.setY(Y);
            mesh.position.setZ(Z);
            return this;
        },
        setX: function (dist) {
            var mesh = this.mesh;
            mesh.position.setX(dist);
            return this;
        },
        setY: function (dist) {
            var mesh = this.mesh;
            mesh.position.setY(dist);
            return this;
        },
        setZ: function (dist) {
            var mesh = this.mesh;
            mesh.position.setZ(dist);
            return this;
        },
        position: function (pos) {
            this.positionXYZ(pos.x, pos.y, pos.z);
            return this;
        },
        getPosition: function () {
            var mesh = this.mesh;
            return mesh.position;
        },
        getRotation: function () {
            var mesh = this.mesh;
            return mesh.rotation;
        },
        meshRemove: function () {
            //ok now delete the mesh gemoetry
            var mesh = this.mesh;
            var parent = mesh.parent;
            parent && parent.remove(mesh);
            delete this.myParent; //protect against leak
            return this;
        },
        meshSelect: function () {
            return this;
        },
        meshUnselect: function () {
            return this;
        },
        scaleClear: function () {
            var mesh = this.mesh;
            mesh.scale.set(1, 1, 1);
            return this;
        },
        hide: function () {
            var mesh = this.mesh;
            mesh.visible = false;
            return this;
        },
        show: function () {
            var mesh = this.mesh;
            mesh.visible = true;
            return this;
        },
        toggleShowHide: function () {
            var mesh = this.mesh;
            mesh.visible = !mesh.visible;
            return this;
        },
    });

    var makeMesh3D = function (properties, subcomponents, parent) {
        return new mesh3D(properties, subcomponents, parent);
    };

    var meshDB = fo.db.getEntityDB('three::mesh');
    geo.meshDB = meshDB;

    var meshDef = fo.establishType('three::mesh', {
        mesh: new THREE.Mesh(),
    }, makeMesh3D);


    var model3D = fo.defineClass('model3D', fo.Node);

    var makeModel3D = function (properties, subcomponents, parent) {
        return new model3D(properties, subcomponents, parent);
    };
    //Prototype defines functions using JSON syntax
    fo.tools.mixin(model3D.prototype, {
        create: function (root, parent) {
            var instance = meshDef.newInstance({
                mesh: new THREE.Mesh(this.geometry, this.material)
            }, [], parent);
            var target = root && root.mesh ? root.mesh : scene;
            target.add(instance.mesh);
            return instance;
        },

    });




    var modelDB = fo.db.getEntityDB('three::model');
    geo.modelDB = modelDB;

    fo.establishType('three::model', {}, makeModel3D);

    geo.jsonLoader = new THREE.JSONLoader();
    geo.loadedModels = function (onComplete) {
        onComplete && onComplete(geo.modelDB.lookup);
        return geo.modelDB.items;
    };

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

    geo.rootModel = function() {
        if (rootModel) return;
        rootModel = meshDef.newInstance({
            mesh: function () { return scene; }
        });
        return rootModel;
    }


    var globeMesh;
    geo.addGlobe = function (noTexture) {
        if (globeMesh) return globeMesh;

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

        globeMesh = new THREE.Mesh(spGeo, mat2);
        scene.add(globeMesh);
        return globeMesh;
    }

    geo.removeGlobe = function () {
        if (globeMesh) {
            scene.remove(globeMesh);
            globeMesh = undefined;
        }
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
        var light = new THREE.DirectionalLight(0x3333ee, 3.5, 500);
        scene.add(light);
        light.position.set(POS_X, POS_Y, POS_Z);

        //*** Adding the lights
        var light = new THREE.DirectionalLight(0x999999);
        light.position.set(-1, 0, 1).normalize();
        scene.add(light);

        var light = new THREE.DirectionalLight(0x999999);
        light.position.set(0, 1, -1).normalize();
        scene.add(light);

        var light = new THREE.DirectionalLight(0x999999);
        light.position.set(1, 0, -1).normalize();
        scene.add(light);

        var camPos  = camera.position;
        var spotLight = new THREE.SpotLight(0xFFFFFF, 2);
        spotLight.position.set(camPos.x, camPos.y, camPos.z);
        spotLight.target.position.set(0, 0, 0);

        spotLight.shadowCameraNear = 1;
        spotLight.shadowCameraFar = 3000;
        spotLight.shadowCameraFov = 100;
        spotLight.castShadow = true;
        spotLight.shadowDarkness = 0.4;
        spotLight.shadowBias = 0.001;
        // spotLight.shadowCameraVisible  = true;
        scene.add(spotLight);
        ////////////////////

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

        var phi = (lat).toRad();
        var theta = (lon - 180).toRad();

        var x = -(radius + heigth) * Math.cos(phi) * Math.cos(theta);
        var y = (radius + heigth) * Math.sin(phi);
        var z = (radius + heigth) * Math.cos(phi) * Math.sin(theta);

        return new THREE.Vector3(x, y, z);
    }

    geo.bearingTo = function (lat1, lon1, lat2, lon2) {
        var lat1 = lat1.toRad();
        var lat2 = lat2.toRad();
        var dLon = (lon2 - lon1).toRad();

        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) -
                Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        var brng = Math.atan2(y, x);

        return (brng.toDeg() + 360) % 360;
    },

    //geo.latLongToAngles = function (lat, lon, radius, heigth) {
    //    var phi = (lat) * Math.PI / 180;
    //    var theta = (lon - 180) * Math.PI / 180;

    //    var x = -1 * Math.cos(phi) * Math.cos(theta);
    //    var y = Math.sin(phi);
    //    var z = Math.cos(phi) * Math.sin(theta);

    //    return [x, y, z];
    //}

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

    geo.material = function (type, data) {
        var material;
        type = data.type ? data.type : type;
        switch (type) {
            case 'phong':
                material = new THREE.MeshPhongMaterial(data);
                break;
            case 'lambert':
                material = new THREE.MeshLambertMaterial(data);
                break;
            case 'depth':
                material = new THREE.MeshDepthMaterial(data);
                break;
            case 'normal':
                material = new THREE.MeshNormalMaterial(data);
                break;
            case 'face':
                material = new THREE.MeshFaceMaterial(data);
                break;
            case 'basic':
                material = new THREE.MeshBasicMaterial(data);          
                break;
        }
        return material;
    }

 

}(Foundry, Scene3D));



(function (app, fo, tools, geo, undefined) {

    app.service('render3DService', function ($location, $q) {

        function getHttpContext() {
            if (location) {
                return location.protocol + "//" + location.host + location.pathname.slice(0, location.pathname.indexOf('/', 1));
            }
        };

        var self = this;
        this.THREE = THREE;

        this.init = geo.init;
        this.rootModel = geo.rootModel;
        this.export = geo.export;
        this.animate = geo.animate;
        this.addGlobe = geo.addGlobe;
        this.removeGlobe = geo.removeGlobe;
        this.addLights = geo.addLights;
        this.latLongToVector3 = geo.latLongToVector3;
        this.llToPosition = geo.latLongToVector3;
        this.llToBearing = geo.bearingTo;
        this.zoomToPos = geo.zoomToPos;

        this.cameraPosition = geo.cameraPosition;

        this.setAnimation = function (funct) {
            geo.onNextAnimationFrame = funct;
        }

        //http://stackoverflow.com/questions/26456410/three-js-lines-normal-to-a-sphere
        function primitive(name, geoSpec, matSpecs) {
            var material = {
                color: 0xff0000,
                wireframe: false
            };

            //if possable advoid creating duplicate definitions
            var model = geo.modelDB.modifyOrCreateInstance({
                myName: name,
                geometry: geo.primitive(name, geoSpec),
                material: geo.material('phong', tools.union(material, matSpecs)),
            }, [], undefined, name);

            return model;
        }


        this.primitive = primitive;



        function loadModel(name, file) {
            var deferred = $q.defer();

            geo.jsonLoader.load(file, function (geometry, materials) {
                var model = geo.modelDB.establishInstance({
                    myName: name,
                    geometry: geometry,
                    material: geo.material('face', materials),
                }, name);
                deferred.resolve(model);
            });

            return deferred.promise;
        }


        function loadPrimitive(name, geoSpec, matSpecs) {
            var deferred = $q.defer();
            var model = primitive(name, geoSpec, matSpecs)
            deferred.resolve(model);
            return deferred.promise;
        }



        this.loadModel = loadModel;
        this.loadPrimitive = loadPrimitive;

        var entityType = fo.defineClass('entity', fo.Component, {
            context: {},
            geom: {},
        });


        //Prototype defines functions using JSON syntax
        fo.tools.mixin(entityType.prototype, {
            isOnTopOf: function (obj) {
                var myContext = this.context;
                var otherContext = obj.context;
                var pos = obj.geom.getPosition();
                var geom = this.geom;
                geom.setX(pos.x + (myContext.width + otherContext.width)/2 - 1)
                geom.setY(pos.y + (myContext.height + otherContext.height)/2 - 1)
                return this;
            },
            isRotateY: function (obj) {
                var myContext = this.context;
                var otherContext = obj.context;
                var geom = this.geom;
                geom.rotateOnY(45 * Math.PI / 180);

                return this;
            },
            applyOrientationRelationships: function () {
                var geom = this.geom;

                if (this.isOnTopOf != entityType.prototype.isOnTopOf) {
                    var obj = this.isOnTopOf.first;
                    entityType.prototype.isOnTopOf.call(this,obj);
                }
                if (this.isRotateY != entityType.prototype.isRotateY) {
                    var obj = this.isRotateY.first;
                    entityType.prototype.isRotateY.call(this, obj);
                }
                
                return this;
            },
            stats: function () {
                var prop = this.getManagedProperty('geom');
                if (prop.status) {
                    //may be too aggressive and only works if displayed
                    this.applyOrientationRelationships();
                    var pos = this.geom.mesh.position;
                    return { x: pos.x, y: pos.y, z: pos.z, }
                }
                return '?';
            }
        });

        var makeEntity = function (properties, subcomponents, parent) {
            var obj = new entityType(properties, subcomponents, parent);

            parent && parent.addSubcomponent(obj);
            var prop = obj.getManagedProperty('geom');
            prop.onValueSmash = function (geom, newValue, formula, owner) {
                geom.meshRemove()
            };
            return obj
        };

        this.entity = fo.establishType('3d::entity', {
            context: {},
            orientationRules: [],
            geom: function () {
                var context = this.context;
                var type = context.type || tools.getType(context);
                var spec = context.getInputSpec(false);

                var def = primitive(type, spec);
                var root = this.myParent && this.myParent.geom;
                var geom = def.create(root, this.myParent);
                geom.myName = context.myGuid;
                return geom;
            }
        }, makeEntity);

        this.createEntity = function (properties, subcomponents, parent) {
            var obj = this.entity.newInstance(properties, subcomponents, parent);
            obj.myName = obj.context.myName;
            return obj;
        };


        function render(target) {
            target.applyOrientationRelationships();
            target.subcomponents && target.subcomponents.forEach(function (item) {
                render(item);
            })
        };

        this.render = render;

        this.isLeftOf = fo.establishRelationship('isLeftOf');

    });

}(foApp, Foundry, Foundry.tools, Scene3D));