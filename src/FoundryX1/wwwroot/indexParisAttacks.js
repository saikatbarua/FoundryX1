

var foApp = angular.module('foApp', ['ui.bootstrap']);

(function (app, fo, tools, leaflet, undefined) {

    app.service('render2DMapService', function ($location, $q) {
        var map;

        function getHttpContext() {
            if (location) {
                return location.protocol + "//" + location.host + location.pathname.slice(0, location.pathname.indexOf('/', 1));
            }
        };
        //http://leafletjs.com/reference.html
        this.init = function (id) {
            map = leaflet.map(id);
            
            map.setView([45.002073, -109.080842], 13);

            leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'mapbox.streets'
            }).addTo(map);

            leaflet.marker([45.002073, -109.080842]).addTo(map)
                .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();


            function onMapClick(e) {

                var xxx = e;

                var popup1 = leaflet.popup();
                popup1.setLatLng(e.latlng)
                    .setContent("You clicked the map at " + e.latlng.toString() + '</b><button class="btn btn-default trigger">Add</button>')
                    .openOn(map);


            }

            map.on('click', onMapClick);


        }

        this.zoomToNode = function (item) {
            var loc = item.place && item.place.geoLocation;
            if (!loc) return;

            var pos = [loc.latitude, loc.longitude];
            map.setView(pos);
        }

        this.renderNodes = function (list) {
            list.forEach(function (item) {
                var loc = item.place && item.place.geoLocation;
                if (!loc) return;

                var pos = [loc.latitude, loc.longitude];
                map.setView(pos, 13);
                leaflet.marker(pos).addTo(map).bindPopup(item.description)
            });
        }

    });

}(foApp, Foundry,  Foundry.tools, L));

(function (app, fo, tools, undefined) {

    app.filter('buttonLabel', function () {
        return function (obj) {
            var name = tools.getType(obj);
            return name.capitalizeFirstLetter();
        };
    });

    //load templares for dialogs and shapes...
    tools.loadTemplate('foundry/foundry.ui.ngdialog.html');
    tools.loadTemplate('indexParisAttacks.ui.html');

    app.controller('workspaceController', function ($rootScope, dataService, ontologyLocationService, render3DService, render2DMapService, dialogService) {
        var self = this;

        self.title = 'paris attacks';
        self.space = fo.makeModelWorkspace('paris');;
        self.model = self.space.rootModel;

        self.createOntology = fo.typeDictionaryWhere(function (key, value) {
            return key.startsWith('VaaS::');
        });

        var url = '../mock/parisLocations.json';

        var locationDB = ontologyLocationService.locationDB;
        var placeDB = ontologyLocationService.placeDB;
        var nodeDB = ontologyLocationService.nodeDB;

        self.locationDB = locationDB;
        self.placeDB = placeDB;
        self.nodeDB = nodeDB;

        render2DMapService.init('map')
        render3DService.init('earth');
        render3DService.animate();

        render3DService.addGlobe();


        dataService.getData(url).then(function (data) {
            
            var id = 0;
            data.forEach(function (item) {
                var node = nodeDB.newInstance({
                    id: id++,                  
                    dateTimeUtc: new Date(item.dateTime),
                    description: item.description,
                    place: placeDB.newInstance({
                        name: item.name,
                        geoLocation: locationDB.newInstance({
                            latitude: item.latitude,
                            longitude: item.longitude,
                        })
                    }),
                });
                //node.capture(node.place);
                //node.place.capture(node.place.geoLocation);
            });

            render2DMapService.renderNodes(nodeDB.items);
            //render3DService.renderNodes(nodeDB.items);

                //you need more control of geometry primitives
            render3DService.loadPrimitive('block', { width: 1, height: 100, depth: 1 })
            .then(function (block) {

                nodeDB.items.forEach(function (item) {
                    var model = block.create();
                    var geo = item.place.geoLocation;
                    var pos = render3DService.latLongToVector3(geo.latitude, geo.longitude);
                    model.position(pos);
                    //var ang = render3DService.latLongToAngles(geo.latitude, geo.longitude);
                    //model.rotateOnZ(ang[1]);
                });

            });

        }, function (reason) {
        });


        function editNode(node) {
            dialogService.doPopupDialog({
                root: self,
                context: node,
                headerTemplate: 'editEntityHeader.html',
                bodyTemplate: 'editEntityBody.html',
                footerTemplate: 'editEntityFooter.html',
            },
            {
                onOK: function ($modalInstance, context) {
                },
                onCancel: function ($modalInstance, context) {
                },
                onExit: function () {
                },
                onReady: function () {
                }
            },
            {
            });
        }

        self.editNode = function (item) {
            editNode(item);
        }

        self.selectedNode = function (item) {
            render2DMapService.zoomToNode(item);
            var geo = item.place && item.place.geoLocation;
            if (geo) {
                var pos = render3DService.latLongToVector3(geo.latitude, geo.longitude, 0, 10);
                render3DService.zoomToPos(pos);
            }
        }

        self.userInputs = function (obj, key) {
            var inputs = obj.userInputs(key);
            return inputs;
        }

        self.computeInclude = function (obj, key) {
            var context = key && self.userInputs(obj, key)[0];

            if (obj.isType(self.nodeDB.myName)) {
                return 'nodeView.html';
            }
            if (obj.isType(self.placeDB.myName)) {
                return 'placeView.html';
            }
            if (obj.isType(self.locationDB.myName)) {
                return 'geoLocationView.html';
            }
            return 'dateTimeUtcView.html';
        }

        self.doAdd = function (source) {
            var name = tools.getType(source);
            var obj = source.newInstance().unique();
            self.doEdit(obj);
        };

        self.doEdit = function (item) {
            dialogService.doPopupDialog({
                root: self,
                context: item,
                headerTemplate: 'editEntityHeader.html',
                bodyTemplate: 'editEntityBody.html',
                footerTemplate: 'editEntityFooter.html',
            });
        };

        self.addNode = function () {
            var node = nodeDB.newInstance({
                id: nodeDB.items.length + 1,
                dateTimeUtc: new Date(),
                description: 'the description',
                place: placeDB.newInstance({
                    name: 'unknown',
                    geoLocation: locationDB.newInstance()
                }),
            });
            editNode(node);
        };

    });

 
}(foApp, Foundry, Foundry.tools));



//<script>






//L.circle([40.003, -103.0], 250000, {
//    color: 'red',
//    fillColor: '#f03',
//    fillOpacity: 0.5
//}).addTo(map).bindPopup("I am a circle.");

//L.polygon([
//            [45.002073 , -109.080842 ],
//            [45.002073, -105.91517],
//            [44.996596, -104.058488],
//            [43.002989, -104.053011],
//            [41.003906, -104.053011],
//            [40.998429, -105.728954],
//            [41.003906, -107.919731],
//            [40.998429, -109.04798],
//            [40.998429, -111.047063],
//            [42.000709, -111.047063],
//            [44.476286, -111.047063],
//            [45.002073, -111.05254]
//]).addTo(map).bindPopup("I am a polygon.");





//</script>
