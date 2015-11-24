/**
 * @author arodic / http://akirodic.com/
 */

( function () {

  'use strict';

  // shared variables

  var raycaster = new THREE.Raycaster();

  THREE.SelectionControl = function ( parameters ) {

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
        value: parameters.scene,
        observer: 'addSelectionHelper'
      },
      selection: {
        value: parameters.selection,
        observer: 'addSelectionHelper'
      }
    } );

    // internal variables

    var scope = this;

    var intersect, object;

    // helper functions

    function selectWithPointer ( pointer, additive ) {

      raycaster.setFromCamera( pointer, scope.camera );
      intersect = raycaster.intersectObjects( [ scope.scene ], true )[ 0 ];

      if ( intersect ) {

          object = intersect.object;

          if ( additive ) {

            scope.selection.toggle( object );

          } else {

            scope.selection.clear();
            scope.selection.add( object );

          }

      } else {

        if ( !additive ) {

            scope.selection.clear();

        }

      }

    }

    // event handlers

    this.onTrackend = function ( event, pointers ) {

      if ( pointers[0].offset.length() < 0.01 ) selectWithPointer( pointers[0].position, event.shiftKey );

    };

    this.onKeyup = function ( event, key ) {

      switch ( key ) {

        case 38:
          scope.selection.selectParents( object );
          break;

        case 40:
          scope.selection.selectChildren( object );
          break;

        case 39:
          scope.selection.selectNext( object );
          break;

        case 37:
          scope.selection.selectPrevious( object );
          break;

      }

    };

  };

  THREE.SelectionControl.prototype = Object.create( THREE.Control.prototype );
  THREE.SelectionControl.prototype.constructor = THREE.SelectionControl;

  THREE.SelectionControl.prototype.addSelectionHelper = function () {
    this.scene._helpers = this.scene._helpers || new THREE.Scene();
    this.scene._helpers.add(this.selection.helper);
  };

}());
