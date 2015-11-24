/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author arodic / http://akirodic.com/
 */

( function () {

  'use strict';

  // shared variables

  var vector = new THREE.Vector3();
  var matrix = new THREE.Matrix3();
  var box = new THREE.Box3();

  var EPS = 0.000001;
  var theta, phi, rect, radius, distance, fovFactor;
  var cw, ch, aspect, delta, center, scale, minCenter, maxCenter;

  THREE.ViewportControl = function ( parameters ) {

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
      }
    } );

    // internal variables

    var scope = this;

    // event handlers

    this.onTrack = function ( event, pointers ) {

      if ( event.type === 'mousemove' ) {

        if ( event.button === 0 ) {

          if ( scope.camera instanceof THREE.OrthographicCamera ) {

            scope.pan( pointers[ 0 ].delta );

          } else {

            scope.rotate( pointers[ 0 ].delta );

          }

        }

        if ( event.button === 1 ) {

          scope.zoom( pointers[ 0 ].delta );

        }

        if ( event.button === 2 ) {

          scope.pan( pointers[ 0 ].delta );

        }

      } else if ( event.type === 'touchmove' ) {

        switch ( pointers.length ) {

          case 1:

            if ( scope.camera instanceof THREE.PerspectiveCamera ) {

              scope.rotate( pointers[ 0 ].delta );

            } else if ( scope.camera instanceof THREE.OrthographicCamera ) {

              scope.pan( pointers[ 0 ].delta );

            }
            break;

          case 2:

            var prevDistance = pointers[ 0 ].previous.distanceTo( pointers[ 1 ].previous );
            var distance = pointers[ 0 ].position.distanceTo( pointers[ 1 ].position );

            if ( prevDistance ) {

              scope.zoom( new THREE.Vector2(0, prevDistance - distance ) );
              scope.pan( pointers[ 0 ].delta.clone().add( pointers[ 1 ].delta ).multiplyScalar(0.5) );

            }
            break;
        }

      }

    };

    this.onMousewheel = function ( event, delta ) {

      scope.zoom( new THREE.Vector2( 0, delta / 1000 ) );

    }

    this.onKeyup = function ( event, key ) {

      if ( key === 70 ) {

        scope.focusSelection();

      }

    };

  };

  THREE.ViewportControl.prototype = Object.create( THREE.Control.prototype );
  THREE.ViewportControl.prototype.constructor = THREE.ViewportControl;

  THREE.ViewportControl.prototype.rotate = function ( delta ) {

    this.camera._target = this.camera._target || new THREE.Vector3();

    vector.copy( this.camera.position ).sub( this.camera._target );

    theta = Math.atan2( vector.x, vector.z );
    phi = Math.atan2( Math.sqrt( vector.x * vector.x + vector.z * vector.z ), vector.y );

    theta -= delta.x * 3;
    phi -= - delta.y * 3;

    phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

    radius = vector.length();

    vector.x = radius * Math.sin( phi ) * Math.sin( theta );
    vector.y = radius * Math.cos( phi );
    vector.z = radius * Math.sin( phi ) * Math.cos( theta );

    this.camera.position.copy( this.camera._target ).add( vector );

    this.camera.lookAt( this.camera._target );

    this.dispatchChangeEvent();

  };

  THREE.ViewportControl.prototype.pan = function ( delta ) {

    this.camera._target = this.camera._target || new THREE.Vector3();

    distance = this.camera.position.distanceTo( this.camera._target );

    vector.set( - delta.x, - delta.y, 0 );

    if ( this.camera instanceof THREE.PerspectiveCamera ) {

      fovFactor = distance * Math.tan( ( this.camera.fov / 2 ) * Math.PI / 180.0 );
      vector.multiplyScalar( fovFactor );
      vector.x *= this.camera.aspect;

    } else if ( this.camera instanceof THREE.OrthographicCamera ) {

      vector.x *= ( this.camera.right - this.camera.left ) / 2;
      vector.y *= ( this.camera.top - this.camera.bottom ) / 2;

    }

    vector.applyMatrix3( matrix.getNormalMatrix( this.camera.matrix ) );
    this.camera.position.add( vector );
    this.camera._target.add( vector );

    this.dispatchChangeEvent();

  };

  THREE.ViewportControl.prototype.zoom = function ( delta ) {

    this.camera._target = this.camera._target || new THREE.Vector3();

    if ( this.camera instanceof THREE.PerspectiveCamera ) {

      var distance = this.camera.position.distanceTo( this.camera._target );

      vector.set( 0, 0, delta.y );

      vector.multiplyScalar( distance );

      if ( vector.length() > distance ) return;

      vector.applyMatrix3(matrix.getNormalMatrix( this.camera.matrix ) );

      this.camera.position.add( vector );

    } else if ( this.camera instanceof THREE.OrthographicCamera ) {

      this.camera.top *= 1 + delta.y;
      this.camera.right *= 1 + delta.y;
      this.camera.bottom *= 1 + delta.y;
      this.camera.left *= 1 + delta.y;

    }

    this.dispatchChangeEvent();

  };

  THREE.ViewportControl.prototype.focusSelection = function () {

    this.camera._target = this.camera._target || new THREE.Vector3();

    if ( this.selection && this.selection.objects.length ) {

      if ( this.selection.sphere.radius ) {

        var radius = this.selection.sphere.radius;
        var offset = this.camera.position.clone().sub( this.camera._target );

        if ( this.camera instanceof THREE.PerspectiveCamera ) {

          this.camera._target.copy( this.selection.center );

          var fovFactor = Math.tan( ( this.camera.fov / 2 ) * Math.PI / 180.0 );
          offset.normalize().multiplyScalar( radius  / fovFactor );

          this.camera.position.copy( this.camera._target ).add( offset );

          this.camera.lookAt( this.camera._target );

        } else if ( this.camera instanceof THREE.OrthographicCamera ) {

          this.camera._target.copy( this.selection.center );
          this.camera.position.copy( this.camera._target ).add( offset );

          cw = this.camera.right - this.camera.left;
          ch = this.camera.top - this.camera.bottom;
          aspect = cw / ch;

          if ( aspect < 1 ) {

            this.camera.top = radius / aspect;
            this.camera.right = radius;
            this.camera.bottom = -radius / aspect;
            this.camera.left = -radius;

          } else {

            this.camera.top = radius;
            this.camera.right = radius * aspect;
            this.camera.bottom = -radius;
            this.camera.left = -radius * aspect;

          }

        }

        this.dispatchChangeEvent();

      }

    }

  };

}());
