/**
 * @author arodic / http://akirodic.com/
 */

( function () {

  // Element to be added to body during a drag gesture.
  // It prevents other elements from recieving events and stopping propagaion.
  var clickmask = document.createElement( 'div' );
  clickmask.className = 'three-control';
  clickmask.style.position = 'fixed';
  clickmask.style.top = 0;
  clickmask.style.left = 0;
  clickmask.style.bottom = 0;
  clickmask.style.right = 0;
  clickmask.style.zIndex = 10000000;
  clickmask.style.cursor = 'move';
  // clickmask.style.background = 'rgba(0,255,255,0.2)';

  var raycaster = new THREE.Raycaster();
  var intersect;

  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1000000, 1000000, 2, 2),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0 })
  );
  plane.rotation.set(Math.PI / 2, 0, 0);
  plane.updateMatrixWorld();
  // TODO: align plane

  THREE.Control = function () {

    // internal variables.

    this._properties = {};
    this._viewports = [];

    this.registerProperties( {
      camera: {
        type: THREE.Camera,
        notify: true
      },
      domElement: {
        type: HTMLElement,
        notify: true
      },
      scene: {
        type: THREE.Scene,
        observer: 'addHelper',
        notify: true
      },
      selection: {
        type: THREE.Selection,
        observer: 'selectionChanged',
        notify: true
      },
      active: {
        value: false,
        type: 'boolean',
        notify: true
      },
      mode: {
        type: 'string',
        notify: true
      },
      enabled: {
        value: true,
        type: 'boolean',
        notify: true
      }
    } );

    var scope = this;
    var pointers;
    var rect, touches, pointer;
    var positions, positionsStart, positionsOld, positionDeltas, closestPointer;
    var preventTouchmove = false;
    var viewport;

    // helper functions

    var getPointerVector = function ( x, y ) {
      rect = scope.domElement.getBoundingClientRect();
      return new THREE.Vector2(
        ( x - rect.left ) / rect.width * 2 - 1,
        1 - ( y - rect.top ) / rect.height * 2
      );
    };

    var getClosestPointer = function ( point, array ) {
      closestPointer = array[ 0 ];
      for ( var i = 1; i < array.length; i++ ) {
        if ( array[ i ].distanceTo( point ) < closestPointer.distanceTo( point ) ) {
          closestPointer = array[ i ];
        }
      }
      return closestPointer;
    };

    var getPointersFromEvent = function ( event, reset ) {

      touches = event.touches ? event.touches : [ event ];

      positionsOld = reset ? [] : positions || [];
      positionsStart = reset ? [] : positionsStart || [];
      positions = [];
      positionDeltas = [];
      positionOffsets = [];

      for ( var i = 0; i < touches.length; i++ ) {

        if ( touches[ i ].target === event.path[ 0 ] || event.touches === undefined ) {

          pointer = getPointerVector( touches[ i ].clientX, touches[ i ].clientY );
          positions.push( pointer );

          if ( positionsOld[ positions.length - 1 ] === undefined ) {

            positionsOld.push( pointer.clone() );

          }

          if ( positionsStart[ positions.length - 1 ] === undefined ) {

            positionsStart.push( pointer.clone() );

          }

        }

      }

      var data = [];

      for ( i = 0; i < positions.length; i++ ) {

        positionDeltas[ i ] = positions[ i ].clone().sub( getClosestPointer( positions[ i ], positionsOld ) );
        positionOffsets[ i ] = positions[ i ].clone().sub( getClosestPointer( positions[ i ], positionsStart ) );
        data[ i ] = {
          position: positions[ i ],
          previous: positionsOld[ i ], // TODO: remove
          delta: positionDeltas[ i ],
          offset: positionOffsets[ i ]
        };

      }

      return data;

    };

    function onMousedown ( event ) {

      if ( scope.enabled === false ) return;

      viewport = getViewport( event.path[ 0 ] );

      if ( !viewport ) return;

      scope.domElement = event.path[ 0 ];
      scope.camera = getViewport( event.path[ 0 ] ).camera;

      pointers = getPointersFromEvent( event, true );

      if ( typeof scope.onTrackstart === 'function' ) {

        scope.onTrackstart( event, pointers );

      }

      window.addEventListener( 'mousemove', onMousemove );
      window.addEventListener( 'mouseup', onMouseup );

    }

    function onMousemove ( event ) {

      if ( scope.enabled === false ) {

        window.removeEventListener( 'mousemove', onMousemove );
        window.removeEventListener( 'mouseup', onMouseup );

        return;

      }

      pointers = getPointersFromEvent( event );

      if ( typeof scope.onTrack === 'function' ) {

        scope.onTrack( event, pointers );

      }

      if ( clickmask.parentNode !== document.body ) {

        document.body.appendChild( clickmask );

      }

    }

    function onMouseup ( event ) {

      window.removeEventListener( 'mousemove', onMousemove );
      window.removeEventListener( 'mouseup', onMouseup );

      if ( clickmask.parentNode == document.body ) {

        document.body.removeChild( clickmask );

      }

      if ( scope.enabled === false ) return;

      pointers = getPointersFromEvent( event );

      if ( typeof scope.onTrackend === 'function' ) {

        scope.onTrackend( event, pointers );

      }

    }

    function onHover ( event ) {

      if ( scope.enabled === false ) return;

      viewport = getViewport( event.path[ 0 ] );

      if ( !viewport ) return;
      scope.domElement = viewport.domElement;
      scope.camera = viewport.camera;

      pointers = getPointersFromEvent( event );

      if ( typeof scope.onHover === 'function' ) {

        scope.onHover( event, pointers );

      }

    }

    function onTouchstart ( event ) {

      event.preventDefault();

      event.path[ 0 ].focus();

      if ( scope.enabled === false ) return;

      viewport = getViewport( event.path[ 0 ] );

      if ( !viewport ) return;
      scope.domElement = viewport.domElement;
      scope.camera = viewport.camera;

      preventTouchmove = true;

      setTimeout( function () {

        preventTouchmove = false;

      } );

      pointers = getPointersFromEvent( event, true );

      if ( typeof scope.onHover === 'function' ) {

        scope.onHover( event, pointers );

      }

      if ( typeof scope.onTrackstart === 'function' ) {

        scope.onTrackstart( event, pointers );

      }

      event.path[ 0 ].addEventListener( 'touchmove', onTouchmove );
      event.path[ 0 ].addEventListener( 'touchend', onTouchend );

    }

    function onTouchmove ( event ) {

      event.preventDefault();

      if ( scope.enabled === false ) {

        event.path[ 0 ].removeEventListener( 'touchmove', onTouchmove );
        event.path[ 0 ].removeEventListener( 'touchend', onTouchend );

        return;

      }

      if ( preventTouchmove === true ) return;

      pointers = getPointersFromEvent( event );

      if ( typeof scope.onTrack === 'function' ) {

        scope.onTrack( event, pointers );

      }

      if ( clickmask.parentNode !== document.body ) {

        document.body.appendChild( clickmask );

      }

    }

    function onTouchend ( event ) {

      event.preventDefault();

      event.path[ 0 ].removeEventListener( 'touchmove', onTouchmove );
      event.path[ 0 ].removeEventListener( 'touchend', onTouchend );

      if ( clickmask.parentNode == document.body ) {

        document.body.removeChild( clickmask );

      }

      if ( scope.enabled === false ) return;

      if ( typeof scope.onTrackend === 'function' ) {

        scope.onTrackend( event, pointers );

      }

    }

    function onMousewheel ( event ) {

      viewport = getViewport( event.path[ 0 ] );

      if ( !viewport ) return;

      event.preventDefault();

      if ( scope.enabled === false ) return;

      delta = 0;

      if ( event.wheelDelta ) {

        delta = - event.wheelDelta;

      } else if ( event.detail ) {

        delta = event.detail * 10;

      }

      if ( typeof scope.onMousewheel === 'function' ) {

        scope.onMousewheel( event, delta );

      }

    }

    function onKeyup ( event ) {

      viewport = getViewport( event.path[ 0 ] );

      if ( !viewport ) return;

      if ( scope.enabled === false ) return;

      if ( typeof scope.onKeyup === 'function' ) scope.onKeyup( event, event.which );

    };

    function onContextmenu ( event ) {

      viewport = getViewport( event.path[ 0 ] );

      if ( !viewport ) return;

      event.preventDefault();

      if ( scope.enabled === false ) return;

      if ( typeof scope.onContextmenu === 'function' ) scope.onContextmenu( event );

    };

    function getViewport ( domElement ) {

      return scope._viewports.find( function ( e ) {

        return e.domElement === domElement;

      } );

    };

    // this.onKeyup = function ( event, key ) { console.log('onKeyup'); };
    // this.onContextmenu = function ( event, pointers ) { console.log('onContextmenu'); };
    // this.onTrackstart = function ( event, pointers ) { console.log('onTrackstart'); };
    // this.onMousewheel = function ( event, delta ) { console.log('onMousewheel'); };
    // this.onTrack = function ( event, pointers ) { console.log('onTrack'); };
    // this.onTrackend = function ( event, pointers ) { console.log('onTrackend'); };
    // this.onHover = function ( event, pointers ) { console.log('onHover'); };

    this.registerViewport = function ( domElement, camera ) {

      viewport = getViewport( domElement );

      if ( !viewport ) {

        viewport = {
          domElement: domElement,
          camera: camera
        };

        scope._viewports.push( viewport );

        domElement.addEventListener( 'mousedown', onMousedown );
        domElement.addEventListener( 'touchstart', onTouchstart );
        domElement.addEventListener( 'mousewheel', onMousewheel );
        domElement.addEventListener( 'DOMMouseScroll', onMousewheel ); // firefox
        domElement.addEventListener( 'mousemove', onHover );
        domElement.addEventListener( 'keyup', onKeyup );
        domElement.addEventListener( 'contextmenu', onContextmenu );

      } else if ( camera ) {

        viewport.camera = camera;

      }

    };

    this.unregisterViewport = function ( domElement ) {

      viewport = getViewport( domElement );

      if ( viewport ) {

        domElement.removeEventListener( 'mousedown', onMousedown );
        domElement.removeEventListener( 'touchstart', onTouchstart );
        domElement.removeEventListener( 'mousewheel', onMousewheel );
        domElement.removeEventListener( 'DOMMouseScroll', onMousewheel ); // firefox
        domElement.removeEventListener( 'mousemove', onHover );
        domElement.removeEventListener( 'keyup', onKeyup );
        domElement.removeEventListener( 'contextmenu', onContextmenu );

        scope._viewports.splice( scope._viewports.indexOf( viewport ), 1 );

      }

    };

  };

  THREE.EventDispatcher.prototype.apply( THREE.Control.prototype );

  THREE.Control.prototype._registerProperty = function ( key, value, type, observer, notify, readOnly ) {

    var _changeEvent = key.toLowerCase() + 'change';
    var _oldValue;

    if ( !this.hasOwnProperty(key) ) {

      Object.defineProperty( this, key, {

        get: function () {

          return this._properties[ key ];

        },

        set: function ( value ) {

          if ( this._properties[ key ] === value ) return;

          if ( readOnly ) {

            console.warn( 'THREE.Control: ' + key + ' is read only.');

          }

          if ( type && value !== undefined ) {

            if ( typeof type === 'string' && typeof value !== type ) {

              console.warn('THREE.Control: ' + key + ' is incorrect type.');
              return;

            } else if ( typeof type === 'function' && !( value instanceof type ) ) {

              console.warn('THREE.Control: ' + key + ' is incorrect type.');
              return;

            }

          }

          _oldValue = this._properties[ key ];
          this._properties[ key ] = value;

          if ( notify || observer ) {

            this.debounce( _changeEvent, function () {

              this.dispatchEvent( { type: _changeEvent, value: value, oldVaue: _oldValue } );

              this.dispatchChangeEvent();

            }.bind( this ));

          }

        }

      } );

    }

    if ( observer && typeof this[ observer ] == 'function') {

      this.addEventListener( _changeEvent, this[ observer ] );

    }

    this[ key ] = value;

  };

  THREE.Control.prototype.registerProperties = function ( properties ) {

    for ( var key in properties ) {

      this._registerProperty(
        key,
        properties[ key ].value,
        properties[ key ].type,
        properties[ key ].observer,
        properties[ key ].notify,
        properties[ key ].readOnly
      );

    }

  };

  THREE.Control.prototype.dispose = function () {

    var i, j;

    for ( i = this._viewports.length; i--; ) {
      this.unregisterViewport( this._viewports[ i ].domElement );
    }

    for ( i in this._listeners ) {
      for ( j = this._listeners[ i ].length; j--; ) {

        this.removeEventListener( i, this._listeners[ i ][ j ] );
      }
      delete this._listeners[ i ];
    }

    for ( i in this._properties ) {
      delete this._properties[ i ];
    }

    for ( i in this._debouncers ) {
      window.clearTimeout( this._debouncers[ i ] );
      delete this._debouncers[ i ];
    }

    if ( this.helper && this.helper.parent ) {

      this.helper.parent.remove( this.helper );

    }

  };

  THREE.Control.prototype.debounce = function ( id, callback, timeout ) {

    this._debouncers = this._debouncers || {};

    window.clearTimeout( this._debouncers[ id ] );

    this._debouncers[ id ] = setTimeout( function () {

      callback();
      delete this._debouncers[ id ];

    }.bind( this ), timeout );

  };

  THREE.Control.prototype.dispatchChangeEvent = function ( id, callback, timeout ) {

    this.debounce( 'change', function () {

      this.dispatchEvent( { type: 'change' } );

    }.bind( this ));

  };

  THREE.Control.prototype.selectionChanged = function ( event ) {

    this._selectionEvent = this._selectionEvent || function () {

      this.debounce( 'selection', function () {

        this.dispatchEvent( { type: 'selection' } );

      }.bind( this ));

      this.dispatchChangeEvent();

    }.bind( this );

    if ( event.oldValue ) event.oldValue.removeEventListener( 'change', this._selectionEvent );

    if ( event.value ) event.value.addEventListener( 'change', this._selectionEvent );

  };

  THREE.Control.prototype.getPointOnPlane = function ( pointer ) {

    raycaster.setFromCamera( pointer, this.camera );
    intersect = raycaster.intersectObjects( [ plane ], true )[ 0 ];

    if ( intersect ) return intersect.point;

  };

  THREE.Control.prototype.addHelper = function () {

    this.scene._helpers = this.scene._helpers || new THREE.Scene();

    if ( this.helper ) {

      this.scene._helpers.add( this.helper );

    }

  };


}());
