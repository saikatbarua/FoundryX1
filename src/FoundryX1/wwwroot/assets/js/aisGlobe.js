var AIS = !AIS ? {} : AIS;

AIS.Globe = (function () {

    var viewer;
    var scene;
    var scenePrimitives;
    var camera;
    var globe;
    var esriImageLayer;
    var bingImageLayer;
    var esriLabelsLayer;



    var eventCallbacks = [];

    var allLabelCollections = [];
    var allBillboardCollections = [];

    /* contains datasource warppers (Eg. KML) that change visibility based on camera altitude */
    var dynamicDataSources = [];

    var currentLabelZOffset = -150000;
    var MAX_LABEL_Z_OFFSET = -150000;

    var FLY_TO_ALTITUDE = 80000;


    var currentBillboardZOffset = -75000;
    var MAX_BILLBOARD_Z_OFFSET = -75000;


    var DEFAULT_VISBLITY_SCALAR = new Cesium.NearFarScalar(6e1, 1.0, 3.0e7, 0.0);
    var DEFAULT_TRANSLUCENCY_SCALAR = new Cesium.NearFarScalar(6e1, 1.0, 3.0e7, 0.0);


    /* ScreenSpace Event Constants */
    var ScreenSpaceEventType = Object.freeze({
        LEFT_CLICK: Cesium.ScreenSpaceEventType.LEFT_CLICK,
        MOUSE_MOVE: Cesium.ScreenSpaceEventType.MOUSE_MOVE
    });

    /* Keyboard Modifier Constants */
    var KeyboardEventModifier = Object.freeze({
        SHIFT: Cesium.KeyboardEventModifier.SHIFT,
        CTRL: Cesium.KeyboardEventModifier.CTRL,
        ALT: Cesium.KeyboardEventModifier.ALT
    });

    var LabelStyle = Object.freeze({
        FILL: Cesium.LabelStyle.FILL,
        OUTLINE: Cesium.LabelStyle.OUTLINE,
        FILL_AND_OUTLINE: Cesium.LabelStyle.FILL_AND_OUTLINE
    });

    /*  Constructors and Factories */

    var Color = function () {
        this.fromCssColorString = function (colorString, alpha) {
            if (alpha || alpha === 0) {
                return Cesium.Color.fromCssColorString(colorString).withAlpha(alpha);
            } else {
                return Cesium.Color.fromCssColorString(colorString);
            }
        }


        this.fromRGBA = function (red, green, blue, alpha) {
            if (alpha !== undefined || alpha !== null) {
                return Cesium.Color.fromBytes(red, green, blue).withAlpha(alpha);
            } else {
                return Cesium.Color.fromBytes(red, green, blue);
            }
        }

        return this;
    };

    var Position = function () {
        this.fromDegrees = function (latitude, longitude, height) {
            return Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
        }

        this.toDegrees = function (position) {
            var degrees;

            if (position) {
                var cartographic = globe.ellipsoid.cartesianToCartographic(position);
                degrees = {
                    longitude: Cesium.Math.toDegrees(cartographic.longitude),
                    latitude: Cesium.Math.toDegrees(cartographic.latitude),
                    height: Cesium.Math.toDegrees(cartographic.height)
                }
            }

            return degrees;
        }


        return this;
    };


    var CircleShape = function (position, radius) {
        return new Cesium.CircleGeometry({
            center: position,
            radius: radius
        });
    };


    var PolygonShape = function (positionArray) {
        return new Cesium.PolygonGeometry({
            polygonHierarchy: {
                positions: positionArray
            }
        });
    };

    var NearFarScalar = function (near, nearValue, far, farValue) {
        return new Cesium.NearFarScalar(near, nearValue, far, farValue);
    };

    var LabelOptions = function (color, font, translucencyScalar, labelStyle, outlineColor) {
        this.fillColor = color ? color : Cesium.Color.WHITE.withAlpha(1);
        this.font = font ? font : '24px sans-serif';
        this.style = labelStyle ? labelStyle : Cesium.LabelStyle.FILL_AND_OUTLINE;
        this.outlineColor = outlineColor ? outlineColor : Cesium.Color.BLACK.withAlpha(1);

        this.translucencyByDistance = translucencyScalar ? translucencyScalar : undefined;

        this.eyeOffset = new Cesium.Cartesian3(0, 0, currentLabelZOffset);
        this.pixelOffset = new Cesium.Cartesian2(0, -10);
        this.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
        this.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
    };


    var SelectHandler = function (callbackFunc, screenSpaceEvent, keyboardModifer) {
        this.callbackFunc = callbackFunc;
        this.screenSpaceEvent = screenSpaceEvent;
        this.keyboardModifer = keyboardModifer;
    };

    var Selectable = function (id, target, selectHandlers) {
        this.id = id;
        this.target = target;
        this.selectHandlers = selectHandlers;
    };


    var GlobeState = (function () {

        var spinEnabled = false;
        var dayNightEnabled = false;

        var SPIN_INTERVAL_DURATION = 50;
        var MAX_GLOBE_SPEED = 1e-3;
        var globeSpinSpeed = MAX_GLOBE_SPEED;
        var spinIntervalHanlde;

        var changeCallbacks = [];


        function registerChangeCallback(callback) {
            changeCallbacks.push(callback);
        }

        function notifyGlobeStateChange() {
            changeCallbacks.forEach(function (callback) {
                callback(GlobeState);
            });
        }

        function spinGlobe() {
            camera.rotateLeft(globeSpinSpeed);
        }

        /* Keep this private for now. May need to allow user to change it... */
        function setSpinSpeedPercentage(speedPercentage) {
            globeSpinSpeed = (MAX_GLOBE_SPEED * (speedPercentage % 100)) / 100;
        }

        function setSpin(enabled) {
            if (spinEnabled != enabled && (!enabled || scene.mode == Cesium.SceneMode.SCENE3D)) {
                spinEnabled = enabled;

                if (spinEnabled) {
                    spinIntervalHanlde = setInterval(spinGlobe, SPIN_INTERVAL_DURATION);
                } else {
                    clearInterval(spinIntervalHanlde);
                }

                notifyGlobeStateChange();
            }

            return spinEnabled;
        }

        function setDayNight(enabled) {
            if (dayNightEnabled != enabled) {
                dayNightEnabled = enabled;
                globe.enableLighting = enabled;
                notifyGlobeStateChange();
            }

            return dayNightEnabled;
        }

        function getSpin() {
            return spinEnabled;
        }

        function getDayNight() {
            return dayNightEnabled;
        }


        return {
            setSpin: setSpin,
            setDayNight: setDayNight,
            getSpin: getSpin,
            getDayNight: getDayNight,
            registerChangeCallback: registerChangeCallback
        }

    })();

    /****
     *
     * Initialization Functions.
     */

    function createImageryLayers() {

        /*
         esriLabelsLayer = new Cesium.ImageryLayer(new Cesium.ArcGisMapServerImageryProvider({

         url: '//services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/',
         enablePickFeatures: false
         }), {
         brightness: 0.8,
         contrast:1.7,
         hue: 3.0,
         saturation: 2.0,
         gamma: 1.7,
         minimumTerrainLevel: 4
         }
         ); */

        esriLabelsLayer = new Cesium.ImageryLayer(new Cesium.ArcGisMapServerImageryProvider({
                /*  url: '//services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer', */
                url: '//services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/',
                enablePickFeatures: false
            }), {
                gamma: 1.7,
                minimumTerrainLevel: 4,
                show : true
            }
        );

        esriImageLayer = new Cesium.ImageryLayer(new Cesium.ArcGisMapServerImageryProvider({
            url: '//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
            enablePickFeatures: false
        }), {
            brightness: 1.2,
            contrast: 1.0,
            hue: 0.0,
            saturation: 1.0,
            gamma: 1.5,
            show : true
        });

        bingImageLayer = new Cesium.ImageryLayer(new Cesium.BingMapsImageryProvider({
            url: '//dev.virtualearth.net',
            mapStyle: Cesium.BingMapsStyle.AERIAL,
            key: 'Anb6qUcRV9HIpspb4bW_j4BCiVJGHAhITYzsp5NNvq3b2SbHXbTx-PIzmr_vIci0'
        }), {
            brightness: 1.2,
            contrast: 1.0,
            hue: 0,
            saturation: 1.0,
            gamma: 1.6,
            show : false

        });

    }
    function setShowBingImagery(show) {
        bingImageLayer.show = show;
        esriImageLayer.show = !show;
    }

    function setShowPlaces(show) {
        esriLabelsLayer.show = show
    }

    function init(canvasId) {
        /* DHS Dev key for Bing Maps */
        Cesium.BingMapsApi.defaultKey = 'Anb6qUcRV9HIpspb4bW_j4BCiVJGHAhITYzsp5NNvq3b2SbHXbTx-PIzmr_vIci0';


        /* Matching initial size and camera location from existing google globe. */
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(-52.0, -40.0, -27.0, 40.0);
        Cesium.Camera.DEFAULT_VIEW_FACTOR = 0.3;


        viewer = new Cesium.Viewer(canvasId, {
            timeline: false,
            animation: false,
            baseLayerPicker: false,

            contextOptions: {
                webgl: {
                    failIfMajorPerformanceCaveat: false
                }
            }

        });

        scene = viewer.scene;
        scenePrimitives = viewer.scene.primitives;
        camera = viewer.camera;
        globe = scene.globe;

        createImageryLayers();


        scene.imageryLayers.add(bingImageLayer);
        scene.imageryLayers.add(esriImageLayer);
        scene.imageryLayers.add(esriLabelsLayer);

        /*
         * Cesium has this defaulted to 2 for optimized performance. However this makes the tiles
         * specially once with labels blurry. Change it to 1 give sharper tiles.
         */
        globe.maximumScreenSpaceError = 2;

        /* Remove columbus view option from toolbar */
       // $(".cesium-viewer-toolbar [data-bind*=_columbusViewPath]").remove();


        registerEventHandlers();
    }

    function registerEventHandlers() {
        registerScreenSpaceHandlers();
        registerSceneEventHandlers();
        registerForCameraEvents();
    }

    function registerForCameraEvents() {
        camera.moveEnd.addEventListener(function () {
            cameraHeightUpdated();
        });
    }

    function cameraHeightUpdated() {
        var height = Math.abs(camera.positionCartographic.height);
        adjustEyeOffset(height);

        dynamicDataSources.forEach(function (dsWrapper) {
            var currentVisibility = dsWrapper.isVisibleFuct(height);
            if(currentVisibility !== dsWrapper.isVisible) {
                dsWrapper.isVisible = currentVisibility;
                refreshDataSourceEntities(dsWrapper);
            }

        });
    }

    function adjustEyeOffset(height) {

        if (MAX_LABEL_Z_OFFSET != currentLabelZOffset && height > Math.abs(MAX_LABEL_Z_OFFSET)) {
            currentLabelZOffset = MAX_LABEL_Z_OFFSET;
            currentBillboardZOffset = MAX_BILLBOARD_Z_OFFSET;
            updateLabelOffset();
            updateBillboardOffset();
        } else if (height <= Math.abs(currentLabelZOffset)) {
            currentLabelZOffset = -1 * height / 2.0;
            currentBillboardZOffset = -1 * height / 4.0;
            updateLabelOffset();
            updateBillboardOffset();
        }
         console.log(camera.positionCartographic.height);
    }

    function updateLabelOffset() {
        allLabelCollections.forEach(function (labels) {
            var len = labels.length;
            for (var i = 0; i < len; ++i) {
                var label = labels.get(i);
                label.eyeOffset = new Cesium.Cartesian3(0, 0, currentLabelZOffset);
            }
        });
    }


    function updateBillboardOffset() {
        allBillboardCollections.forEach(function (billboards) {
            var len = billboards.length;
            for (var i = 0; i < len; ++i) {
                var billboard = billboards.get(i);
                billboard.eyeOffset = new Cesium.Cartesian3(0, 0, currentBillboardZOffset);
            }
        });
    }


    function registerSceneEventHandlers() {

        /* Stop spining before flight */
        viewer.geocoder.viewModel.search.beforeExecute.addEventListener(function () {
            GlobeState.setSpin(false);
        });

        scene.morphStart.addEventListener(function () {
            GlobeState.setSpin(false);
        });

        /* Move to home postions when switching to 3D */
        scene.morphComplete.addEventListener(function () {
            if (scene.mode == Cesium.SceneMode.SCENE3D) {
                var destination = camera.getRectangleCameraCoordinates(Cesium.Camera.DEFAULT_VIEW_RECTANGLE);

                var mag = Cesium.Cartesian3.magnitude(destination);
                mag += mag * Cesium.Camera.DEFAULT_VIEW_FACTOR;
                Cesium.Cartesian3.normalize(destination, destination);
                Cesium.Cartesian3.multiplyByScalar(destination, mag, destination);


                camera.setView({
                    destination: destination,
                    orientation: {
                        heading: 0.0,
                        pitch: -Math.PI * 0.5,
                        roll: 0.0
                    }
                });
            }
        });
    }

    function registerScreenSpaceHandlers() {
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

        var PICK_LIMIT = 10;

        handler.setInputAction(function (movement) {
            processPick(movement.position, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function (movement) {
            processPick(movement.position, ScreenSpaceEventType.LEFT_CLICK, KeyboardEventModifier.SHIFT);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK, Cesium.KeyboardEventModifier.SHIFT);

        handler.setInputAction(function (movement) {
            processPick(movement.position, ScreenSpaceEventType.LEFT_CLICK, KeyboardEventModifier.ALT);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK, Cesium.KeyboardEventModifier.ALT);

        handler.setInputAction(function (movement) {
            processPick(movement.position, ScreenSpaceEventType.LEFT_CLICK, KeyboardEventModifier.CTRL);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK, Cesium.KeyboardEventModifier.CTRL);

        handler.setInputAction(function (movement) {
            processPick(movement.endPosition, ScreenSpaceEventType.MOUSE_MOVE);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {
            processPick(movement.endPosition, ScreenSpaceEventType.MOUSE_MOVE, KeyboardEventModifier.SHIFT);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT);

        handler.setInputAction(function (movement) {
            processPick(movement.endPosition, ScreenSpaceEventType.MOUSE_MOVE, KeyboardEventModifier.ALT);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.ALT);

        handler.setInputAction(function (movement) {
            processPick(movement.endPosition, ScreenSpaceEventType.MOUSE_MOVE, KeyboardEventModifier.CTRL);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.CTRL);

        function processPick(position, screenSpaceEvent, keyboardQualifer) {

            var matchedSelectors = [];

            var pickedPrimitives = scene.drillPick(position, PICK_LIMIT);

            for (var i = 0; i < pickedPrimitives.length; i++) {
                var pickedPrimitive = pickedPrimitives [i];
                var selection = Cesium.defaultValue(pickedPrimitive.id, pickedPrimitive.primitive.id);

                if (selection instanceof Selectable) {
                    matchSelector(selection.selectHandlers, screenSpaceEvent, keyboardQualifer, matchedSelectors);
                }


                /* TODO: May need to add ability to allow user pick from multiple selection instead of just stopping with the first match. */
                if (matchedSelectors.length > 0) {
                    matchedSelectors[0].callbackFunc(selection.id, selection.target, screenSpaceEvent, keyboardQualifer);
                    break;
                }
            }


            /* Check if this is an event that is handle by generic callbacks */
            if (matchedSelectors.length == 0) {
                matchSelector(eventCallbacks, screenSpaceEvent, keyboardQualifer, matchedSelectors);

                if (matchedSelectors.length > 0) {
                    matchedSelectors.forEach(function (match) {
                        match.callbackFunc(screenSpaceEvent, keyboardQualifer, camera.pickEllipsoid(position));
                    });
                }
            }

        }

        function matchSelector(selectHandlers, screenSpaceEvent, keyboardModifier, matchedSelectors) {
            return selectHandlers.forEach(function (selectHandler) {
                if (selectHandler.screenSpaceEvent === screenSpaceEvent &&
                    ((!isKeyboardModifier(selectHandler.keyboardModifer) && !isKeyboardModifier(keyboardModifier))
                    || selectHandler.keyboardModifer === keyboardModifier)) {
                    matchedSelectors.push(selectHandler);
                }
            });
        }

        function isKeyboardModifier(val) {
            return val !== undefined || val !== null;
        }
    }


    /****
     *
     * Camera Movement Functions.
     */


    function flyTo(position, altitude, completeCallback, cancelCallback) {

        /* If globe is spinning stop it before beginning flight */
        GlobeState.setSpin(false);

        var positionCartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);

        camera.flyTo({
            destination: Cesium.Cartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude, altitude ? altitude : FLY_TO_ALTITUDE),
            duration: 1,
            complete: function () {
                cameraHeightUpdated();
                if (completeCallback) {
                    completeCallback();
                }
            },
            cancels: cancelCallback
        });


    }


    /****
     *
     * Placemark group or Shape group can be used to register selection callbacks.
     */
    function registerSelectionCallback(group, callbackFunc, screenSpaceEvent, keyboardModifer) {
        group.selectHandlers.push(new SelectHandler(callbackFunc, screenSpaceEvent, keyboardModifer));
    }

    /**
     *
     * Register generic callback for mouse events.
     */
    function registerCallback(callbackFunc, screenSpaceEvent, keyboardModifer) {
        eventCallbacks.push(new SelectHandler(callbackFunc, screenSpaceEvent, keyboardModifer));
    }

    /*
     * Returns the created placemark group, this should be used to reference the group.
     *
     */
    function createPlacemarkGroup(imageNearFarScalar, hasLabels, labelOptions) {

        var placemarksPrimitive = scenePrimitives.add(new Cesium.PrimitiveCollection());
        var billboards = placemarksPrimitive.add(new Cesium.BillboardCollection());
        var labels = hasLabels ? placemarksPrimitive.add(new Cesium.LabelCollection()) : undefined;


        allBillboardCollections.push(billboards);

        if (labels !== undefined && labels != null) {
            allLabelCollections.push(labels);
        }


        return {
            placemarksPrimitive: placemarksPrimitive,
            billboards: billboards,
            imageNearFarScalar: imageNearFarScalar ? imageNearFarScalar : DEFAULT_VISBLITY_SCALAR,
            selectHandlers: [],

            labels: labels,
            labelOptions: hasLabels && !labelOptions ? new LabelOptions() : labelOptions
        }
    }

    /*
     *
     * Returns the created placemark, this should be used to reference the placemark.
     *
     */
    function addPlacemark(placemarkGroup, id, position, image, scale, heading, labelText) {
        var selectableId = null;
        var placemark = {};
        placemark.group = placemarkGroup;

        if (placemarkGroup.selectHandlers && id) {
            selectableId = new Selectable(id, placemark, placemarkGroup.selectHandlers);
        }

        var billboard = placemarkGroup.billboards.add({
            id: selectableId,
            position: position,
            image: image,
            /* FIXME: why do we have mutliply by -1 to match current icon headings? */
            rotation: heading ? -1.0 * Cesium.Math.toRadians(heading) : 0,
            scale: scale ? scale : 1.0,
            eyeOffset: new Cesium.Cartesian3(0, 0, currentBillboardZOffset),
            scaleByDistance: placemarkGroup.imageNearFarScalar ? placemarkGroup.imageNearFarScalar : DEFAULT_VISBLITY_SCALAR
        });

        var label;

        if (placemarkGroup.labels && labelText) {
            placemarkGroup.labelOptions.id = id;
            placemarkGroup.labelOptions.position = position;
            placemarkGroup.labelOptions.text = labelText;
            placemarkGroup.labelOptions.eyeOffset = new Cesium.Cartesian3(0, 0, currentLabelZOffset);

            label = placemarkGroup.labels.add(placemarkGroup.labelOptions);
        }

        placemark.billboard = billboard;
        placemark.label = label;

        return placemark;
    }

    function clearPlacemarkGroup(placemarkGroup) {
        placemarkGroup.billboards.removeAll();
        if (placemarkGroup.labels) {
            placemarkGroup.labels.removeAll();
        }
    }


    function setShowPlacemarkGroup(placemarkGroup, show) {
        placemarkGroup.placemarksPrimitive.show = show;
    }


    function applyPlacemarkFilter(placemarkGroup, isFilteredOutFunction) {

        var len = placemarkGroup.billboards.length;

        for (var i = 0; i < len; ++i) {
            var billboard = placemarkGroup.billboards.get(i);
            billboard.show = !isFilteredOutFunction(billboard.id instanceof Selectable ? billboard.id.id : null);
        }

        if (placemarkGroup.labels) {
            len = placemarkGroup.labels.length;

            for (var i = 0; i < len; ++i) {
                var label = placemarkGroup.labels.get(i);
                label.show = !isFilteredOutFunction(label.id);
            }
        }
    }

    function removePlacemark(placemark) {
        placemark.group.billboards.remove(placemark.billboard);
        if (placemark.group.labels && placemark.label) {
            placemark.group.labels.remove(placemark.label);
        }
    }

    function movePlacemark(placemark, position) {
        placemark.billboard.position = position;
        if (placemark.label) {
            placemark.label.position = position
        }
    }

    function updatePlacemarkImage(placemark, image, scale) {
        placemark.billboard.image = image;
        placemark.billboard.scale = scale ? scale : 1.0;
    }

    function setShowPlacemark(placemark, show) {
        placemark.billboard.show = show;
        if (placemark.label) {
            placemark.label.show = show;
        }
    }


    /*
     *
     * Returns the created label group, this should be used to reference the label group.
     *
     */
    function createLabelGroup(labelOptions) {

        var labelsPrimitive = scenePrimitives.add(new Cesium.PrimitiveCollection());

        var labelCollection = labelsPrimitive.add(new Cesium.LabelCollection());

        allLabelCollections.push(labelCollection);

        return {
            labelsPrimitive: labelsPrimitive,
            labels: labelCollection,
            labelOptions: labelOptions ? labelOptions : new LabelOptions()
        };
    }

    /*
     *
     * Returns the created label, this should be used to reference the label.
     *
     */
    function addLabel(labelGroup, position, text) {
        labelGroup.labelOptions.position = position;
        labelGroup.labelOptions.text = text;
        labelGroup.labelOptions.eyeOffset = new Cesium.Cartesian3(0, 0, currentLabelZOffset);

        return labelGroup.labels.add(labelGroup.labelOptions);
    }

    function updateLabel(label, position, text) {
        label.position = position;
        label.text = text;
        label.show = true;
    }

    function setShowLabel(label, show) {
        label.show = show;
    }


    function setShowLabelGroup(labelGroup, show) {
        labelGroup.labelsPrimitive.show = show;
    }

    function clearLabelGroup(labelGroup) {
        labelGroup.labels.removeAll();
    }

    function removeLabel(labelGroup, label) {
        labelGroup.labels.remove(label);
    }


    /*
     *
     * Returns the created polyline group, this should be used to reference the polyline group.
     *
     */
    function createPolylineGroup(width, color) {

        var polylinesPrimitive = scenePrimitives.add(new Cesium.PrimitiveCollection());

        var polylineCollection = polylinesPrimitive.add(new Cesium.PolylineCollection());


        return {
            polylinesPrimitive: polylinesPrimitive,
            polylines: polylineCollection,
            polylineOptions: {
                color: color ? color : Cesium.COLOR.WHITE.withAlpha(0.5),
                width: width ? width : 1
            }
        }
    }

    /*
     *
     * Returns the created polyline, this should be used to reference the polyline.
     *
     */
    function addPolyline(polylineGroup, positionArray) {
        return polylineGroup.polylines.add({
            positions: positionArray,
            width: polylineGroup.polylineOptions.width,
            material: Cesium.Material.fromType(Cesium.Material.ColorType, {color: polylineGroup.polylineOptions.color})
        });
    }

    function clearPolylineGroup(polylineGroup) {
        polylineGroup.polylines.removeAll();
    }

    function removePolyline(polylineGroup, polyline) {
        polylineGroup.polylines.remove(polyline);
    }

    function setShowPolyline(polyline, show) {
        polyline.show = show;
    }

    function setShowPolylineGroup(polylineGroup, show) {
        polylineGroup.polylinesPrimitive.show = show;
    }


    /*
     *  Returns the created shape group, this should be used to reference the shape group.
     *
     */
    function createShapeGroup() {
        return {
            shapeFills: scenePrimitives.add(new Cesium.PrimitiveCollection()),
            selectHandlers: []
        }
    }


    /*
     *  Returns the created shape, this should be used to reference the shape.
     *
     */
    function addShape(shapeGroup, id, shapeGeometry, color) {
        var selectableId = null;
        var shape = {};
        shape.group = shapeGroup;

        if (shapeGroup.selectHandlers && id) {
            selectableId = new Selectable(id, shape, shapeGroup.selectHandlers);
        }


        shape.shapeFill = shapeGroup.shapeFills.add(
            new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    id: selectableId,
                    geometry: shapeGeometry
                }),
                appearance: new Cesium.EllipsoidSurfaceAppearance({
                    material: Cesium.Material.fromType('Color', {
                        color: color ? color : new Cesium.Color(0.5, 0.5, 0.5, 0.5)
                    })
                })
            }));

        return shape;
    }


    function clearShapeGroup(shapeGroup) {
        shapeGroup.shapeFills.removeAll();
    }

    function removeShape(shape) {
        shape.group.shapeFills.remove(shape.shapeFill);
    }


    function setShowShape(shape, show) {
        shape.shapeFill.show = show;
    }

    function setShowShapeGroup(shapeGroup, show) {
        shapeGroup.shapeFills.show = show;
    }


    function loadKml(url, show, completeCallback) {
        var dataSourceWrapper = {show : show};
        viewer.dataSources.add(Cesium.KmlDataSource.load(url)).then(function (dataSource) {
            dataSourceWrapper.dataSource = dataSource;
            refreshDataSourceEntities(dataSourceWrapper);
            completeCallback(true, dataSourceWrapper);
        }).otherwise(function(error) {
            completeCallback(false, dataSourceWrapper, error);
        });


        return dataSourceWrapper;
    }

    function setVisibilityByAltitude(dataSourceWrapper, isVisibleFuct) {
        dataSourceWrapper.isVisibleFuct = isVisibleFuct;
        dataSourceWrapper.isVisible = isVisibleFuct(Math.abs(camera.positionCartographic.height));

        dynamicDataSources.push(dataSourceWrapper);
    }


    function setShowDataSource(dataSourceWrapper, show) {
        dataSourceWrapper.show = show;
        refreshDataSourceEntities(dataSourceWrapper);
    }

    function refreshDataSourceEntities(dataSourceWrapper) {
        if (dataSourceWrapper.dataSource) {
            dataSourceWrapper.dataSource.entities.values.forEach(function (value) {
                value.show = dataSourceWrapper.show && dataSourceWrapper.isVisible !== false;
            });
        }
    }

    return {
        /* Constants */
        ScreenSpaceEventType: ScreenSpaceEventType,
        KeyboardEventModifier: KeyboardEventModifier,
        LabelStyle: LabelStyle,


        /***
         *  Constructors and Factories
         */

        Position: Position(),
        Color: Color(),

        NearFarScalar: NearFarScalar,
        LabelOptions: LabelOptions,
        CircleShape: CircleShape,
        PolygonShape: PolygonShape,

        /***
         *  Initializer.
         */
        init: init,

        /*
         *  globe state
         */
        GlobeState: GlobeState,


        /****
         *  Camera Movement Functions.
         */
        flyTo: flyTo,

        /* Register Callaback */
        registerCallback: registerCallback,
        registerSelectionCallback: registerSelectionCallback,

        /****
         *
         * Placemark Functions.
         */
        createPlacemarkGroup: createPlacemarkGroup,
        clearPlacemarkGroup: clearPlacemarkGroup,
        addPlacemark: addPlacemark,
        movePlacemark: movePlacemark,
        updatePlacemarkImage: updatePlacemarkImage,
        setShowPlacemark: setShowPlacemark,
        setShowPlacemarkGroup: setShowPlacemarkGroup,
        applyPlacemarkFilter: applyPlacemarkFilter,


        /****
         *
         * Label Functions.
         */
        createLabelGroup: createLabelGroup,
        clearLabelGroup: clearLabelGroup,
        addLabel: addLabel,
        removeLabel: removeLabel,
        updateLabel: updateLabel,
        setShowLabel: setShowLabel,
        setShowLabelGroup: setShowLabelGroup,

        /****
         *
         * Polyline Functions.
         */
        createPolylineGroup: createPolylineGroup,
        clearPolylineGroup: clearPolylineGroup,
        addPolyline: addPolyline,
        removePolyline: removePolyline,
        setShowPolyline: setShowPolyline,
        setShowPolylineGroup: setShowPolylineGroup,

        /****
         *
         * Shape Functions.
         */
        createShapeGroup: createShapeGroup,
        clearShapeGroup: clearShapeGroup,
        addShape: addShape,
        removeShape: removeShape,
        setShowShape: setShowShape,
        setShowShapeGroup: setShowShapeGroup,


        loadKml: loadKml,
        setShowDataSource: setShowDataSource,
        setVisibilityByAltitude : setVisibilityByAltitude,

        setShowBingImagery: setShowBingImagery,
        setShowPlaces: setShowPlaces

    };
}());
