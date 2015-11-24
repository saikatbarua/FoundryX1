/**
 * @author arodic / http://akirodic.com/
 */

THREE.CompassHelper = function () {

	THREE.Scene.call( this );

	var axis = new THREE.AxisHelper();
	axis.material.linewidth = 2;
	axis.matrixAutoUpdate = false;
	axis.material.depthTest = false;

	this.add( axis );

	this.camera = new THREE.PerspectiveCamera(1, 1, 0.01, 200);
	this.camera.position.z = 150;

};

THREE.CompassHelper.prototype = Object.create( THREE.Scene.prototype );
THREE.CompassHelper.prototype.constructor = THREE.CompassHelper;

THREE.CompassHelper.prototype.update = function ( camera ) {

	this.children[ 0 ].matrix.extractRotation( camera.matrix );
	this.children[ 0 ].matrix.getInverse( this.children[ 0 ].matrix );

};
