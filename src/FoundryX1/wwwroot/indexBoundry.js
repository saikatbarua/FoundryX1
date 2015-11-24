
/// <reference path="../wwwroot/foundry.js" />

var foApp = angular.module('foApp', []);


foApp.controller('viewerController', function (dataService, ontologyService, geoRenderService) {


    var url = '../mock/groupPolygon2.json';

    var element = document.getElementById('earth');
    geoRenderService.init(element);

    dataService.getData(url).then(function (data) {

        data.items.forEach(function (item) {
            ontologyService.createAORPoint(item);
        });

        var regions = ontologyService.createRegions();
        geoRenderService.renderRegions(regions);

    }, function (reason) {
    });


});