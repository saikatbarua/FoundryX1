/**
 * @author arodic / http://akirodic.com/
 */

( function () {

  // shared variables

  var box = new THREE.Box3();

  var changeEvent = { type: 'change' };

  THREE.Selection = function () {

    // internal variables.

    var scope = this;

    this.objects = [];

    this.center = new THREE.Vector3();
    this.box = new THREE.Box3();
    this.sphere = new THREE.Sphere();

    this.helper = new THREE.Object3D();
    this._bboxHelper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1, 1, 1, 1 ) ) );
    // this._bboxHelper.material.depthFunc = THREE.LessEqualDepth;
    this._bboxHelper.material.depthTest = false;
    this._bboxHelper.visible = false;
    this.helper.add(this._bboxHelper);

  };

  THREE.Selection.prototype = {

    constructor: THREE.Selection,

    clear: function() {

      this.remove( [].concat( this.objects ) );

      this.updateHelper();

    },

    add: function ( items ) {

      if ( items instanceof THREE.Object3D ) {

        items = [ items ];

      }

      for( var i = 0; i < items.length; i++ ) {

        if ( this.objects.indexOf( items[ i ] ) === -1 ) {

          this.objects.push( items[ i ] );

        }

      }

      this.updateHelper();

    },

    remove: function ( items ) {

      if ( items instanceof THREE.Object3D ) {

        items = [ items ];

      }


      for( var i = items.length; i--; ) {

        if ( this.objects.indexOf( items[ i ] ) !== -1 ) {

          this.objects.splice( this.objects.indexOf( items[ i ] ), 1 );

        }

      }

      this.updateHelper();

    },

    toggle: function ( items ) {

      if ( items instanceof THREE.Object3D ) {

        items = [ items ];

      }

      for ( var i = items.length; i--; ) {

        if ( this.objects.indexOf( items[ i ] ) !== -1 ) {

          this.objects.splice( this.objects.indexOf( items[ i ] ), 1 );

        } else {

          this.objects.push( items[ i ] );

          // this.addEdgesHelper( items[ i ] );

        }

      }

      this.updateHelper();

    },

    selectParents: function () {

      var parents = [];

      for ( var i = 0; i < this.objects.length; i++ ) {

        if ( this.objects[ i ].parent ) {

          parents.push( this.objects[ i ].parent );

        }

      }

      this.clear();

      this.add( parents );

    },

    selectChildren: function () {

      var children = [];

      for ( var i = 0; i < this.objects.length; i++ ) {

        if ( this.objects[ i ].children.length ) {

          children.push( this.objects[ i ].children[ 0 ] );

        }

      }

      this.clear();

      this.add( children );

    },

    selectNext: function () {

      var siblings = [];

      for ( var i = 0; i < this.objects.length; i++ ) {

        if ( this.objects[ i ].parent ) {

          var index = this.objects[ i ].parent.children.indexOf( this.objects[ i ] );

          index = ( index + 1 ) % this.objects[ i ].parent.children.length;

          siblings.push( this.objects[ i ].parent.children[ index ] );

        }

      }

      this.clear();

      this.add( siblings );

    },

    selectPrevious: function () {

      var siblings = [];

      for ( var i = 0; i < this.objects.length; i++ ) {

        if ( this.objects[ i ].parent ) {

          var index = this.objects[ i ].parent.children.indexOf( this.objects[ i ] );

          index = ( this.objects[ i ].parent.children.length + index - 1 ) % this.objects[ i ].parent.children.length;

          siblings.push( this.objects[ i ].parent.children[ index ] );

        }

      }

      this.clear();

      this.add( siblings );

    },

    // addEdgesHelper: function ( object ) {
    //
    //   object.traverse( function (child) {
    //
    //     if ( child.geometry ) {
    //
    //       if ( !child._edgesHelper ) {
    //
    //         child._edgesHelper = new THREE.WireframeHelper( child );
    //         // child._edgesHelper.material.depthFunc = THREE.LessEqualDepth;
    //         child._edgesHelper.material.depthTest = false;
    //         child._edgesHelper.material.transparent = true;
    //         child._edgesHelper.material.opacity = 0.25;
    //         this.helper.add(child._edgesHelper);
    //
    //       }
    //
    //       child._edgesHelper.visible = true;
    //
    //     }
    //
    //   }.bind( this ) );
    //
    // },

    updateHelper: function () {

      this.debounce( 'updatehelper', function () {

        this.box.makeEmpty();
        this.sphere.empty();
        this.center.set( 0, 0, 0 );

        this.helper.traverse( function ( child ) {

          child.visible = false;

        } );

        this.helper.visible = true;

        if ( this.objects.length !== 0 ) {

          for ( var i = 0; i < this.objects.length; i++ ) {

            var object = this.objects[ i ];

            box.setFromObject( object );

            this.box.expandByPoint( box.min );
            this.box.expandByPoint( box.max );

            this._bboxHelper.visible = true;

            // this.addEdgesHelper( object );

          }

          var scale = this.box.max.clone().sub( this.box.min );
          this.center.copy( this.box.min ).add( this.box.max ).multiplyScalar( 0.5 );
          this._bboxHelper.position.copy( this.center );
          this._bboxHelper.scale.copy( scale );

          this.box.getBoundingSphere( this.sphere );

        }

        this.dispatchEvent( changeEvent );

      }.bind(this) );

    }

  };

  THREE.EventDispatcher.prototype.apply( THREE.Selection.prototype );

  THREE.Selection.prototype.debounce = function ( id, callback, timeout ) {

    this._debouncers = this._debouncers || {};

    window.clearTimeout( this._debouncers[ id ] );

    this._debouncers[ id ] = setTimeout( function () {

      callback();
      delete this._debouncers[ id ];

    }.bind(this), timeout );

  };

}());
