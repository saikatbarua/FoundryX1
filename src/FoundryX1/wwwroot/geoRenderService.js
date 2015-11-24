// angular service directive
(function (app, geo, undefined) {

    app.service('geoRenderService', function ($location, ontologyService) {

        function getHttpContext() {
            if (location) {
                return location.protocol + "//" + location.host + location.pathname.slice(0, location.pathname.indexOf('/', 1));
            }
        };

        function imageBase(url) {
            var base = $location.protocol() + ':' + '//' + $location.host() + ':' + $location.port()

            if ($location.host() != 'localhost') {
                base += '/labs';
            }
            return base + '/assets/images' + url;
        }

        this.init = geo.init;

        this.renderList = function (list, defaultIcon) {

            var icon = defaultIcon ? defaultIcon : imageBase('/map/location.png');

            var tooltipLabelGroup = geo.createLabelGroup(new geo.LabelOptions());
            var tooltipLabel = geo.addLabel(tooltipLabelGroup);

            function itemSelected(item, mouseEventType, keyboardQualifer) {

                //if (item.name && item.latitude && item.longitude) {
                //    var position = geo.Position(item.latitude, item.longitude);
                //    geo.setShowLabel(tooltipLabel, false);
                //    geo.updateLabel(tooltipLabel, position, item.name);
                //}

            }

            var group = geo.createPlacemarkGroup();
            geo.clearPlacemarkGroup(group);

            //geo.registerSelectionCallback(group, itemSelected, geo.ScreenSpaceEventType.MOUSE_MOVE);
            //geo.registerSelectionCallback(group, itemSelected, geo.ScreenSpaceEventType.MOUSE_MOVE, geo.KeyboardEventModifier.SHIFT);

            //now you need to draw both dictionaries
            list.forEach(function (item) {
                if (!item.latitude || !item.longitude) return;
                geo.addPlacemark(group, item, new geo.Position(item.latitude, item.longitude), icon, 1, item.currentHeading || 0);
            })
            return group;
        };

        this.renderAirports = function (list, defaultIcon) {

            var icon = defaultIcon ? defaultIcon : imageBase('/map/location.airport.png');
            return this.renderList(list, icon);
        };

        this.renderLocations = function (list, defaultIcon) {

            var icon = defaultIcon ? defaultIcon : imageBase('/map/location.png');
            return this.renderList(list, icon);
        };

        this.renderFlights = function (list, defaultIcon) {

            var icon = defaultIcon ? defaultIcon : imageBase('/map/airplane.png');
            return this.renderList(list, icon);
        };

        this.renderFlightPaths = function (list) {
            var group = geo.createPolylineGroup(2, geo.Color.fromCssColorString('#00FF00', 0.5));

            geo.clearPolylineGroup(group);

            list.forEach(function (flight) {
                var start = flight.departsAirport.first();
                if (!start) return;

                var positions = [
                    new geo.Position(flight.latitude, flight.longitude),
                    new geo.Position(start.latitude, start.longitude),
                ];

                geo.addPolyline(group, positions);

            });

        };

        this.renderRegions = function (list) {
            var group = geo.createPolylineGroup(2, geo.Color.fromCssColorString('#00FF00', 0.5));

            geo.clearPolylineGroup(group);

            list.forEach(function (item) {
                var positions = item.pointList.map(function (track) {
                    return new geo.Position(track.lat, track.lng);
                });

                geo.addPolyline(group, positions);

            });

        }


        this.renderPath = function (flightPath) {
            var trackMarksGroup = geo.createPlacemarkGroup();
            var trackLinesGroup = geo.createPolylineGroup(8, geo.Color.fromCssColorString('#00FFFF', 0.5));

            geo.clearPolylineGroup(trackLinesGroup);

            var positions = flightPath.points.map(function (track) {
                return new geo.Position(track.lat, track.lng, 52000);
            });

            geo.addPolyline(trackLinesGroup, positions);

        }


    });

}(foApp, AIS.Globe));