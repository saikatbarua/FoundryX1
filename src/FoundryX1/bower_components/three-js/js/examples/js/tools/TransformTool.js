/**
 * @author arodic / https://github.com/arodic
 */


//TODO: fix rotate snap!

( function () {

  'use strict';

  // shared variables

  {

    var scale;

    var tempVector = new THREE.Vector3();
    var alignVector = new THREE.Vector3();
    var tempQuaternion = new THREE.Quaternion();
    var tempMatrix = new THREE.Matrix4();

    var unitX = new THREE.Vector3( 1, 0, 0 );
    var unitY = new THREE.Vector3( 0, 1, 0 );
    var unitZ = new THREE.Vector3( 0, 0, 1 );
    var unit0 = new THREE.Vector3( 0, 0, 0 );

    var intersect;
    var ray = new THREE.Raycaster();

  }

  THREE.TransformControl = function ( parameters ) {

    // TODO: Make non-uniform scale and rotate play nice in hierarchies

    THREE.Control.call( this );

    parameters = parameters || {};

    this.registerProperties( {
      camera: {
        value: parameters.camera
      },
      domElement: {
        value: parameters.domElement
      },
      selection: {
        value: parameters.selection
      },
      target: {
        type: THREE.Object3D,
        notify: true
      },
      mode: {
        value: 'translate',
        observer: 'modeChanged',
      },
      size: {
        value: 1,
        type: 'number',
        notify: true
      },
      axis: {
        value: '',
        type: 'string',
        observer: 'axisChanged',
        notify: true
      },
      space: {
        value: 'local',
        type: 'string',
        notify: true
      }
    } );

    this.helper = new THREE.Object3D();

    this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( 5000, 5000, 2, 2 ),
      new THREE.MeshBasicMaterial( { visible: false, wireframe: true, side: THREE.DoubleSide } )
    );
    this.helper.add( this.plane );
    this.helper.visible = false;

    this.gnomon = new THREE.Object3D();
    this.helper.add( this.gnomon );
    this.helper.update = function( camera ) {
      this.updateTransform( camera );
      this.updateVisibility();
      this.updatePlaneOrientation();
    }.bind( this );

    this.handles = new THREE.Object3D();
    this.pickers = new THREE.Object3D();
    this.gnomon.add( this.handles );
    this.gnomon.add( this.pickers );

    this._handleModes = {
      translate: this.makeGizmoTranslate(),
      rotate: this.makeGizmoRotate(),
      scale: this.makeGizmoScale()
    };

    this._pickerModes = {
      translate: this.makePickerTranslate(),
      rotate: this.makePickerRotate(),
      scale: this.makePickerScale()
    };

    // transformations

    this.position = new THREE.Vector3();
    this.scale  = new THREE.Vector3();
    this.quaternion  = new THREE.Quaternion();
    this.eye = new THREE.Vector3();
    this.alignVector = new THREE.Vector3();

    ///

    this.addEventListener( 'selection', this.setTargetFromSelection.bind( this ) );

    // API

    this.translationSnap = null;
    this.rotationSnap = null;

    // internal variables

    var scope = this;

    var pointer, point;

    var worldMatrixStart = new THREE.Matrix4();
    var worldMatrixRotationStart = new THREE.Matrix4();
    var worldPositionStart = new THREE.Vector3();

    var worldPoint = new THREE.Vector3();
    var worldPointStart = new THREE.Vector3();
    var worldShift = new THREE.Vector3();
    var worldCross = new THREE.Vector3();
    var worldQuaternion = new THREE.Quaternion();
    var localPoint = new THREE.Vector3();
    var localPointStart = new THREE.Vector3();
    var localShift = new THREE.Vector3();
    var localCross = new THREE.Vector3();
    var localQuaternion= new THREE.Quaternion();
    var localScale = new THREE.Vector3();

    var tempMatrix = new THREE.Matrix4();
    var tempVector = new THREE.Vector3();

    // hepler functions

    function selectionTransformInit () {

      var objects = scope.selection.objects;

      for( var i = 0; i < objects.length; i++ ) {

        objects[ i ]._positionStart = objects[ i ].position.clone();
        objects[ i ]._quaternionStart = objects[ i ].quaternion.clone();
        objects[ i ]._scaleStart = objects[ i ].scale.clone();

      }

    }

    function selectionTranslate () {

      var objects = scope.selection.objects;
      var axis = scope.axis;
      var space = scope.space;

      // if ( axis === 'E' ||  axis === 'XYZE' ) space = 'world';

      for( var i = 0; i < objects.length; i++ ) {

        if ( space === 'local' ) {

          objects[ i ].position.copy( localShift ).applyQuaternion( objects[ i ]._quaternionStart );

        } else {

          objects[ i ].position.copy( worldShift );

        }

        objects[ i ].position.add( objects[ i ]._positionStart );

      }

    }

    function selectionScale () {

      var objects = scope.selection.objects;

      for( var i = 0; i < objects.length; i++ ) {

        objects[ i ].scale.copy( objects[ i ]._scaleStart ).multiply( localScale );

      }

    }

    function selectionRotate () {

      var objects = scope.selection.objects;
      var axis = scope.axis;
      var space = scope.space;

      if ( axis === 'E' ||  axis === 'XYZE' ) space = 'world';

      for ( var i = 0; i < objects.length; i++ ) {

        if ( space === 'world' ) {

            objects[ i ].quaternion.copy( worldQuaternion );
            objects[ i ].quaternion.multiply( objects[ i ]._quaternionStart );

        } else {

            objects[ i ].quaternion.copy( objects[ i ]._quaternionStart );
            objects[ i ].quaternion.multiply( localQuaternion );

        }

      }

    }

    function selectionTransformClear () {

      var objects = scope.selection.objects;

      for( var i = 0; i < objects.length; i++ ) {

        delete objects[ i ]._positionStart;
        delete objects[ i ]._quaternionStart;
        delete objects[ i ]._scaleStart;

      }

    }

    function transformStart ( point ) {

      if ( !point ) return;

      selectionTransformInit();

      scope.target.updateMatrixWorld();

      worldMatrixStart = scope.target.matrixWorld.clone();
      worldMatrixRotationStart.extractRotation( worldMatrixStart );
      worldPositionStart.setFromMatrixPosition( worldMatrixStart );

      worldPointStart.copy( point ).sub( worldPositionStart );
      localPointStart.copy( worldPointStart );

      localPointStart.applyMatrix4( tempMatrix.getInverse( worldMatrixRotationStart ) );

      scope.selection.helper.visible = false;

      scope.dispatchEvent( { type: 'transformstart' } );

    }

    function transform ( point ) {

      if ( !point ) return;

      var target = scope.target;
      var axis = scope.axis;

      var direction;

      worldPoint.copy( point ).sub( worldPositionStart );
      worldShift.subVectors( worldPoint, worldPointStart );

      localPoint.copy( worldPoint );
      localPoint.applyMatrix4( tempMatrix.getInverse( worldMatrixRotationStart ) );
      localShift.subVectors( localPoint, localPointStart );
      worldCross.copy(worldPoint).cross(worldPointStart);
      localCross.copy(localPoint).cross(localPointStart);

      if ( scope.mode === 'translate' ) {

        if ( axis.search( 'X' ) === - 1 ) {
          worldShift.x = 0;
          localShift.x = 0;
        }
        if ( axis.search( 'Y' ) === - 1 ) {
          worldShift.y = 0;
          localShift.y = 0;
        }
        if ( axis.search( 'Z' ) === - 1 ) {
          worldShift.z = 0;
          localShift.z = 0;
        }

        selectionTranslate();

      } else if ( scope.mode === 'scale' ) {

        if ( axis === 'XYZ' ) {

          localScale.set( worldShift.y / 50, worldShift.y / 50, worldShift.y / 50 ).addScalar( 1 );

        } else {

          localScale.set(
            axis === 'X' ? localShift.x / 50 : 0,
            axis === 'Y' ? localShift.y / 50 : 0,
            axis === 'Z' ? localShift.z / 50 : 0
          ).addScalar( 1 );

        }

        selectionScale();

      } else if ( scope.mode === 'rotate' ) {

        if ( axis === 'E' ) {

          localCross.applyMatrix4( worldMatrixRotationStart ).normalize();
          direction = localCross.dot(scope.eye) < 0 ? 1 : -1;
          worldQuaternion.setFromAxisAngle( scope.eye, localPoint.angleTo(localPointStart) * direction );

        } else if ( axis === 'XYZE' ) {

          tempVector.copy(worldShift).cross(scope.eye).normalize();
          worldQuaternion.setFromAxisAngle( tempVector, - 0.04 * worldShift.length() );

        } else {

          if ( axis === 'X' ) {

            localQuaternion.setFromAxisAngle( unitX, localPoint.angleTo(localPointStart) * ( localCross.x > 0 ? -1 : 1 ) );
            worldQuaternion.setFromAxisAngle( unitX, worldPoint.angleTo(worldPointStart) * ( worldCross.x > 0 ? -1 : 1 ) );

          } else if ( axis === 'Y' ) {

            localQuaternion.setFromAxisAngle( unitY, localPoint.angleTo(localPointStart) * ( localCross.y > 0 ? -1 : 1 ) );
            worldQuaternion.setFromAxisAngle( unitY, worldPoint.angleTo(worldPointStart) * ( worldCross.y > 0 ? -1 : 1 ) );

          } else if ( axis === 'Z' ) {

            localQuaternion.setFromAxisAngle( unitZ, localPoint.angleTo(localPointStart) * ( localCross.z > 0 ? -1 : 1 ) );
            worldQuaternion.setFromAxisAngle( unitZ, worldPoint.angleTo(worldPointStart) * ( worldCross.z > 0 ? -1 : 1 ) );

          }

        }

        selectionRotate();

      }

      scope.dispatchEvent( { type: 'transform' } );
      scope.dispatchChangeEvent();

    }

    function transformEnd () {

      selectionTransformClear();

      scope.selection.updateHelper();
      scope.selection.helper.visible = true;

      scope.dispatchEvent( { type: 'transformend' } );
      scope.dispatchEvent( { type: 'render' } );

    }

    // event handlers

    this.onHover = function ( event, pointers ) {

      scope.setAxis( pointers[ 0 ] );

    };

    this.onTrackstart = function ( event, pointers ) {

      if ( !scope.target ) return;

      scope.setAxis( pointers[ 0 ] );
      scope.updatePlaneOrientation();
      point = scope.getPointOnPlane( pointers[ 0 ] );

      scope.active = scope.axis !== '';

      transformStart( point );

    };

    this.onTrack = function ( event, pointers ) {

      if ( !scope.target ) return;

      scope.updatePlaneOrientation();
      point = scope.getPointOnPlane( pointers[ 0 ] );

      if ( point && scope.axis ) transform( point );

    };

    this.onTrackend = function ( event, pointers ) {

      scope.axis = '';

      scope.active = false;

      transformEnd();

    };

    this.onKeyup = function ( event, key ) {

      switch ( key ) {

        case 87:
          scope.mode = 'translate';
          break;

        case 69:
          scope.mode = 'rotate';
          break;

        case 82:
          scope.mode = 'scale';
          break;

        case 81:
          scope.space = scope.space === 'local' ? 'world' : 'local';
          break;

      }

      if ( scope.mode === 'scale' ) scope.space = 'local';

    };

  };

  THREE.TransformControl.prototype = Object.create( THREE.Control.prototype );
  THREE.TransformControl.prototype.constructor = THREE.TransformControl;

  THREE.TransformControl.prototype.updateTransform = function ( camera ) {

    if ( !this.target ) return;

    camera = camera || this.camera;

    camera.updateMatrixWorld();

    this.target.updateMatrixWorld();

    this.position.setFromMatrixPosition( this.target.matrixWorld );
    this.scale.setFromMatrixScale( this.target.matrixWorld );
    this.quaternion.set( 0, 0, 0, 1 );

    if ( this.space === 'local' ) {

      tempMatrix.extractRotation( this.target.matrixWorld );
      this.quaternion.setFromRotationMatrix( tempMatrix );

    }

    if ( camera instanceof THREE.OrthographicCamera ) {

      scale = ( camera.top - camera.bottom ) / 3 * this.size;
      this.eye.copy( unitZ ).applyMatrix4( tempMatrix.extractRotation( camera.matrixWorld ) ).normalize();

    } else {

      tempVector.setFromMatrixPosition( camera.matrixWorld ).sub( this.position );
      scale = tempVector.length() / 6 * this.size;
      this.eye.copy( tempVector ).normalize();

    }

    this.helper.position.copy( this.position );
    this.helper.scale.set( scale, scale, scale );

    // TODO: check math
    this.alignVector.copy( this.eye ).applyQuaternion( tempQuaternion.copy( this.quaternion ).inverse() );

    this.gnomon.traverse( function( child ) {

      if ( child.name.search( 'E' ) !== - 1 ) {

        tempMatrix.lookAt( this.eye, unit0, unitY );
        child.quaternion.setFromRotationMatrix( tempMatrix );

      } else if ( child.name !== '' ) {

        child.quaternion.copy( this.quaternion );

      }

      if ( this.mode === 'rotate' ) {

        if ( child.name === 'X' ) {

          tempQuaternion.setFromAxisAngle( unitX, Math.atan2( - this.alignVector.y, this.alignVector.z ) );
          tempQuaternion.multiplyQuaternions( this.quaternion, tempQuaternion );
          child.quaternion.copy( tempQuaternion );

        }

        if ( child.name === 'Y' ) {

          tempQuaternion.setFromAxisAngle( unitY, Math.atan2( this.alignVector.x, this.alignVector.z ) );
          tempQuaternion.multiplyQuaternions( this.quaternion, tempQuaternion );
          child.quaternion.copy( tempQuaternion );

        }

        if ( child.name === 'Z' ) {

          tempQuaternion.setFromAxisAngle( unitZ, Math.atan2( this.alignVector.y, this.alignVector.x ) );
          tempQuaternion.multiplyQuaternions( this.quaternion, tempQuaternion );
          child.quaternion.copy( tempQuaternion );

        }

      }

    }.bind( this ) );

  };

  THREE.TransformControl.prototype.updateVisibility = function () {

    if ( !this.target || !this.enabled ) {
      this.helper.visible = false;
      return;
    }

    this.helper.visible = true;

    this.gnomon.traverse( function( child ) {

      child.visible = true;

      // hide aligned to camera

      if ( this.mode == 'translate' || this.mode === 'scale' ) {

        if ( Math.abs( this.alignVector.x ) > 0.99 ) {

          if ( child.name === 'X' || child.name === 'XY' || child.name === 'XZ' ) {

            child.visible = false;

          }

        } else if ( Math.abs( this.alignVector.y ) > 0.99 ) {

          if ( child.name === 'Y' || child.name === 'XY' || child.name === 'YZ' ) {

            child.visible = false;

          }

        } else if ( Math.abs( this.alignVector.z ) > 0.99 ) {

          if ( child.name === 'Z' || child.name === 'XZ' || child.name === 'YZ' ) {

            child.visible = false;

          }

        }

      } else if ( this.mode == 'rotate' ) {

        if ( Math.abs( this.alignVector.x ) < 0.1 ) {

          if ( child.name === 'X' ) {

            child.visible = false;

          }

        }

        if ( Math.abs( this.alignVector.y ) < 0.1 ) {

          if ( child.name === 'Y' ) {

            child.visible = false;

          }

        }

        if ( Math.abs( this.alignVector.z ) < 0.1 ) {

          if ( child.name === 'Z' ) {

            child.visible = false;

          }

        }

      }

    }.bind( this ) );

  };

  THREE.TransformControl.prototype.updatePlaneOrientation = function () {

    if ( this.axis === '' ) return;

    if ( this.axis === 'X' ) this.plane.lookAt( unitX );

    if ( this.axis === 'Y' ) this.plane.lookAt( unitY );

    if ( this.axis === 'Z' ) this.plane.lookAt( unitZ );

    if ( this.axis === 'XY' ) this.plane.lookAt( unitZ );

    if ( this.axis === 'YZ' ) this.plane.lookAt( unitX );

    if ( this.axis === 'XZ' ) this.plane.lookAt( unitY );

    if ( this.axis === 'XYZ' ) this.plane.lookAt( this.eye );

    if ( this.mode === 'translate' || this.mode === 'scale' ) {

      if ( this.axis === 'X' ) {

        this.plane.lookAt( unitZ );

        if ( Math.abs( this.alignVector.x ) > Math.abs( this.alignVector.z ) ) this.plane.lookAt( unitY );

      }

      if ( this.axis === 'Y' ) {

        this.plane.lookAt( unitZ );

        if ( Math.abs( this.alignVector.x ) > Math.abs( this.alignVector.z ) ) this.plane.lookAt( unitX );

      }

      if ( this.axis === 'Z' ) {

        this.plane.lookAt( unitY );

        if ( Math.abs( this.alignVector.x ) > Math.abs( this.alignVector.y ) ) this.plane.lookAt( unitX );

      }

    }

    if ( this.axis === 'E' || this.mode === 'rotate' ) {

      this.plane.lookAt( this.eye );

    } else if ( this.space === 'local' ) {

      tempQuaternion.copy( this.plane.quaternion );
      this.plane.quaternion.copy( this.quaternion ).multiply( tempQuaternion );

    }

    this.plane.updateMatrixWorld();

  };

  THREE.TransformControl.prototype.axisChanged = function () {

    this.handles.traverse( function( child ) {

      if ( child.material ) {

        child.material.oldColor = child.material.oldColor || child.material.color.clone();
        child.material.oldOpacity = child.material.oldOpacity || child.material.opacity;

        if ( child.name === this.axis ) {

          child.material.color.setRGB( 1, 1, 0 );
          child.material.opacity = 1;

        } else {

          child.material.color.copy( child.material.oldColor );
          child.material.opacity = child.material.oldOpacity;

        }

      }

    }.bind( this ) );

  };

  THREE.TransformControl.prototype.modeChanged = function () {

    for ( var i = this.gnomon.children.length; i--; ) {
      this.gnomon.remove( this.gnomon.children[ i ] );
    }

    if ( !this.mode ) return;

    this.handles = this._handleModes[ this.mode ];
    this.pickers = this._pickerModes[ this.mode ];

    this.gnomon.add( this.handles );
    this.gnomon.add( this.pickers );
    this.gnomon.add( this.plane );

    this.dispatchEvent( { type: 'render' } );

  };

  THREE.TransformControl.prototype.setAxis = function ( pointer ) {

    ray.setFromCamera( pointer.position, this.camera );
    intersect = ray.intersectObjects( [ this.pickers ], true )[ 0 ];

    if ( intersect && intersect.object.name ) {

      if ( intersect.object.name !== this.axis ) {

        this.axis = intersect.object.name;

      }

    } else {

      this.axis = '';

    }

  };

  THREE.TransformControl.prototype.getPointOnPlane = function ( pointer ) {

    ray.setFromCamera( pointer.position, this.camera );
    intersect = ray.intersectObjects( [ this.plane ] )[ 0 ];

    if ( intersect ) return intersect.point;

  };

  THREE.TransformControl.prototype.setTargetFromSelection = function () {

    if ( this.selection.objects.length ) {

      this.target = this.selection.objects[ this.selection.objects.length - 1 ];

    } else {

      this.target = undefined;

    }

  };

  //////////////////////////
  // Deprication warnings //
  //////////////////////////

  THREE.TransformControl.prototype.setMode = function ( mode ) {

    console.warn( 'THREE.TransformControl: .setMode has been deprecated. Use .mode property instead.' );
    this.mode = mode;

  };

  THREE.TransformControl.prototype.setTranslationSnap = function ( translationSnap ) {

    console.warn( 'THREE.TransformControl: .setTranslationSnap has been deprecated. Use .translationSnap property instead.' );
    scope.translationSnap = translationSnap;

  };

  THREE.TransformControl.prototype.setRotationSnap = function ( rotationSnap ) {

    console.warn( 'THREE.TransformControl: .setRotationSnap has been deprecated. Use .rotationSnap property instead.' );
    scope.rotationSnap = rotationSnap;

  };

  THREE.TransformControl.prototype.setSize = function ( size ) {

    console.warn( 'THREE.TransformControl: .setSize has been deprecated. Use .size property instead.' );
    scope.size = size;

  };

  THREE.TransformControl.prototype.setSpace = function ( space ) {

    console.warn( 'THREE.TransformControl: .setSpace has been deprecated. Use .space property instead.' );
    scope.space = space;

  };

}() );
