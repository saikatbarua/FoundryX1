/**
 * @author arodic / http://akirodic.com/
 */

 (function() {

   var tempVector = new THREE.Vector3();
   var alignVector = new THREE.Vector3();
   var tempMatrix = new THREE.Matrix4();
   var unitx = new THREE.Vector3(1, 0, 0);
   var unity = new THREE.Vector3(0, 1, 0);
   var unitz = new THREE.Vector3(0, 0, 1);

	THREE.ViewportHelper = function ( config ) {

		THREE.Scene.call( this );

		this._grid = new THREE.GridHelper( config.gridSize * config.gridWidth, config.gridSize );
		this._grid.setColors( config.gridColor1, config.gridColor2 );
		this._grid.material.transparent = true;
		this._grid.material.opacity = 0.5;
		this._grid.material.depthWrite = false;
		this.add(this._grid);

		this._axis = new THREE.AxisHelper();
		this._axis.material.depthTest = false;
		this.add(this._axis);

		this.config = config;

	};

	THREE.ViewportHelper.prototype = Object.create( THREE.Scene.prototype );
	THREE.ViewportHelper.prototype.constructor = THREE.ViewportHelper;

	THREE.ViewportHelper.prototype.updateGrid = function ( config ) {

		var gridhelper = new THREE.GridHelper( config.gridSize * config.gridWidth, config.gridSize );
		gridhelper.setColors(config.gridColor1, config.gridColor2);
		this._grid.geometry = gridhelper.geometry;

	};

	THREE.ViewportHelper.prototype.update = function ( camera ) {

		tempMatrix.extractRotation(camera.matrixWorld.clone());
		tempVector.copy(unitz.multiplyScalar(1)).applyMatrix4(tempMatrix);
		alignVector.set(tempVector.dot(unitx),tempVector.dot(unity),tempVector.dot(unitz));

		if (camera instanceof THREE.PerspectiveCamera) {
			alignVector.treshold = 0.999;
		} else {
			alignVector.treshold = 0.7071;
		}

		if (Math.abs(alignVector.z) > alignVector.treshold) {
			this._grid.rotation.set(Math.PI / 2, 0, 0);
		} else if (Math.abs(alignVector.x) > alignVector.treshold) {
			this._grid.rotation.set(0, 0, Math.PI / 2);
		} else {
			this._grid.rotation.set(0, 0, 0);
		}

		this._grid.visible = this.config.showGrid === true;
		this._axis.visible = this.config.showAxis === true;
		this._axis.scale.set(this.config.axisSize, this.config.axisSize, this.config.axisSize);

	};

})();
