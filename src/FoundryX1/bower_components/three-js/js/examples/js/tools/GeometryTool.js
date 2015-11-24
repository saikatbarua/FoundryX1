/**
 * @author arodic / http://akirodic.com/
 */

( function () {

  'use strict';

  // shared variables


  THREE.GeometryControl = function ( parameters ) {

    THREE.Control.call( this );

    parameters = parameters || {};

    this.registerProperties( {
      camera: {
        value: parameters.camera
      },
      domElement: {
        value: parameters.domElement
      },
      scene: {
        value: parameters.scene
      }
    } );

    this.helper = new THREE.Object3D();

    var sphereHelper = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true})
    );

    // internal variables

    var scope = this;
    var startPoint, point, distance;

    // event handlers

    this.onTrackstart = function ( event, pointers ) {

      if ( event.altKey ) return;

      startPoint = this.getPointOnPlane( pointers[0].position );

      if (startPoint) {

        this.helper.add(sphereHelper);
        sphereHelper.scale.set(0, 0, 0);
        sphereHelper.position.copy( startPoint );

        this.active = true;

      }

    };

    this.onTrack = function ( event, pointers ) {

      if ( event.altKey ) return;

      point = this.getPointOnPlane( pointers[0].position );

      if (point) {

        distance = startPoint.distanceTo(point);

        sphereHelper.scale.set(distance, distance, distance);

        this.dispatchEvent({type: 'change'});

      }

    };

    this.onTrackend = function ( event, pointers ) {

      if ( event.altKey ) return;

      this.helper.remove(sphereHelper);

      var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(distance, 32, 32),
        new THREE.MeshNormalMaterial({color: 0xffffff})
      );

      mesh.position.copy(startPoint);

      this.scene.add(mesh);

      this.active = false;

      this.dispatchEvent({type: 'render'});

    };

  };

  THREE.GeometryControl.prototype = Object.create( THREE.Control.prototype );
  THREE.GeometryControl.prototype.constructor = THREE.GeometryControl;

}());
