

var foApp = angular.module('foApp', []);



foApp.controller('workspaceController', function ($log, dataService, ontologyService, geoRenderService) {
    

    geoRenderService.init('cesiumContainer');

    var self = this;

    var url = 'https://uxvnwg001a2247.sat.cbp.dhs.gov:9400/labs/mock/CBPOFOAreaOfResponsibility.json';

    dataService.getData(url)
        .then(function (data) {

            data.items.forEach(function (item) {
                ontologyService.createAORPoint(item);
            });

            //renderService.renderAORPoints();

            var regions = ontologyService.createRegions();
            geoRenderService.renderRegions(regions);

            var url = 'https://uxvnwg001a2247.sat.cbp.dhs.gov:9400/labs/mock/CBPOBPRegionalOffice.json';
            return dataService.getData(url);
        })
        .then(function (data) {
            var offices = data.map(function (item) {
                return ontologyService.createRegionalOffices(item);
            });
            geoRenderService.renderLocations(offices);

        })
        .catch(function (issues) {
            alert('workspaceController: errors ' + issues);
        });



       
    self.title = 'draw Regions';


    
 
});
