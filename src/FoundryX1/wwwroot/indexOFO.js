

var vaasApp = angular.module('foApp', []);




foApp.controller('workspaceController', function ($log, dataService, ontologyService, geoRenderService) {
    
    var markers = [];

    function addMarker(name) {
        markers.push(name);
        window.performance.mark(name);
    }

    function reportMarkers() {
        for (var i = 0; i < markers.length - 1; i++) {
            window.performance.measure(markers[i] + '->' + markers[i + 1], markers[i], markers[i + 1]);
        }

        var measures = window.performance.getEntriesByType('measure');
        measures.forEach(function (item) {
            console.info(item.name + " duration =" + item.duration / 1000);
        });
    }


    geoRenderService.init('cesiumContainer');


    var url = 'https://uxvnwg001a2247.sat.cbp.dhs.gov:9400/labs/mock/cbpOFOFacilities.json';


    addMarker('Start call service');


    dataService.getData(url).then(function (data) {

        addMarker('finish call service');

        addMarker('start process data');

        data.items.forEach(function (item) {
            ontologyService.locationDB.establishInstance({
                id: item.objectid,
                longitude: item.x_coord,
                latitude: item.y_coord,
                state: item.state,
                city: item.city,
                address: item.phys_addr,
                zipCode: item.phys_zip,
            }, item.objectid);
        });

        addMarker('finish process data');

        addMarker('start render');

        geoRenderService.renderLocations(ontologyService.locationDB.items);

        addMarker('finish render');


        reportMarkers();

    });



       
    this.title = 'draw OFO Sites';
    
 
});
