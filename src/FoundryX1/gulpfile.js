﻿/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var project = require('./project.json');

var root = project.webroot;



gulp.task('venderJS', function () {
    var list = [
        'wwwroot/three/*.js',
        'bower_components/angular/**/angular.js',
        'bower_components/angular-bootstrap/ui-bootstrap.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/leaflet/dist/leaflet-src.js',
        //'https://api.mapbox.com/mapbox.js/v2.2.1/mapbox.js',
    ];

    gulp.src(list)
    .pipe(concat('vender.js'))
    .pipe(gulp.dest(root +'/vendor'))
    .pipe(gulp.dest('dist/vendor'));
});


gulp.task('venderCSS', function () {
    var list = [
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/angular-bootstrap/ui-bootstrap-csp.css',
        'bower_components/leaflet/dist/leaflet.css',
        //'https://api.mapbox.com/mapbox.js/v2.2.1/mapbox.css',
    ];

    gulp.src(list)
    .pipe(concat('vender.css'))
    .pipe(gulp.dest(root + '/vendor'))
    .pipe(gulp.dest('dist/vendor'));
});



gulp.task('foundry.core', [], function () {

    var fo = {
        core: ['version.js', 
            'foundry.core.dom.js',

            'foundry.core.tools.js',
            'foundry.core.dto.js',
            'foundry.core.node.js',
            'foundry.core.link.js',

            'foundry.core.component.js',
            'foundry.core.pubsub.js',
            'foundry.core.property.js',
            'foundry.core.collection.js',

            'foundry.core.meta.js',
            'foundry.core.factory.js',
            'foundry.core.factoryrelate.js',
            'foundry.core.entitydb.js',
            'foundry.core.listops.js',

            'foundry.core.workspace.js',
            'foundry.core.clienthub.js',
        ]
    };

    var list = fo.core.map(function(item) { return 'wwwroot/Foundry/' + item; });


    console.info(list);

    return gulp.src(list)
        .pipe(concat('foundry.core.js'))
        .pipe(gulp.dest(root + '/vendor'))
        .pipe(gulp.dest('dist/vendor'))
        .pipe(gulp.dest('dist/FoundryJS'));
});

//
// SERVE
//

var serveConfig = {
    notify: false,
    port: 9400,
    //https: true,
    logConnections: true,
    server: {
        baseDir: ['wwwroot'],
    }
};


gulp.task('serve', [], function () {

    browserSync(serveConfig);
});

