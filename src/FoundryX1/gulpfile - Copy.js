/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var shell = require('gulp-shell'); 
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var ts = require('gulp-typescript');
var watch = require('gulp-watch');
var zip = require('gulp-zip');
var war = require('gulp-war');
var jasmine = require('gulp-jasmine');
//var reporters = require('jasmine-reporters');
var documentation = require('gulp-documentation');
var header = require('gulp-header');
var del = require('delete');
var project = require('./project.json');

var root = project.webroot;


//http://dannydelott.com/setting-up-jsdoc-with-npm-and-gulp/
//https://github.com/jsdoc3/jsdoc
//https://www.npmjs.com/package/documentation
gulp.task('js-doc', shell.task([
  'jsdoc ' + root + '/app/**.js'
]));

//https://github.com/documentationjs/gulp-documentation
//https://visualstudiogallery.msdn.microsoft.com/0cb7304b-ad78-4283-ba2b-42804657fcdd
gulp.task('documentation', function () {

    //gulp.src(root + '/app/**.js')
    //  .pipe(documentation({ format: 'md' }))
    //  .pipe(gulp.dest('documentation-md'));

    return gulp.src(root + '/app/**.js')
      .pipe(documentation({ format: 'html' }))
      .pipe(gulp.dest('documentation-html'));

    //gulp.src(root + '/app/**.js')
    //  .pipe(documentation({ format: 'json' }))
    //  .pipe(gulp.dest('documentation-json'));

});

gulp.task('docs', function () {
    gulp.src(root + '/app/**.js')
      //.pipe(jsdoc.parser(infos, name))
      .pipe(gulp.dest('dist/docs'))
});

gulp.task('venderJS', function () {
    var list = [
        'bower_components/angular/**/angular.js',
        'bower_components/threejs/build/three.js',
        'bower_components/leaflet/dist/leaflet-src.js',
        'https://api.mapbox.com/mapbox.js/v2.2.1/mapbox.js',
    ];

    gulp.src(list)
    .pipe(concat('vender.js'))
    .pipe(gulp.dest(root +'/vendor'))
    .pipe(gulp.dest('dist/vendor'));
});


gulp.task('venderCSS', function () {
    var list = [
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/leaflet/dist/leaflet.css',
        'https://api.mapbox.com/mapbox.js/v2.2.1/mapbox.css',
    ];

    gulp.src(list)
    .pipe(concat('vender.css'))
    .pipe(gulp.dest(root + '/vendor'))
    .pipe(gulp.dest('dist/vendor'));
});


gulp.task('deleteUnitTest', [], function () {
    del.sync('specNode/*', { force: true });

});

gulp.task('createSpecs', ['deleteUnitTest'], function () {
    gulp.src('spec/**.js')
        .pipe(header("var fo = require('../dist/foundryNode.js');"))
        .pipe(gulp.dest('specNode'));
});

gulp.task('unitTest', [], function () {  
    return gulp.src('specNode/**.js')
    .pipe(jasmine());
});

gulp.task('test', function () {
    gulp.src('index.html')
     .pipe(shell('jasmine-node test/js  --verbose --forceexit'));
});

gulp.task('insert', function () {
    gulp.src(root + '/app/**.js')
      .pipe(header('Hello'))
      .pipe(gulp.dest('dist'));
});

var foundry = [
    root + '/foundry.js',
    root + '/foundryModule.js'
]

gulp.task('foundryNode', function () {
    console.info(foundry);

    gulp.src(foundry)
    .pipe(concat('foundryNode.js'))
    .pipe(gulp.dest('dist'));
});




gulp.task('foundry.core', [], function () {

    var fo = {
        core: ['version.js', 'Foundry/foundry.core*.js']
    };


    console.info(fo.core);

    return gulp.src(list)
        .pipe(concat('foundry.core.js'))
        .pipe(gulp.dest(root + '/vendor'))
        .pipe(gulp.dest('dist/vendor'))
        .pipe(gulp.dest('dist/FoundryJS/'));
});



//https://www.npmjs.com/package/gulp-typescript
//http://weblogs.asp.net/dwahlin/creating-a-typescript-workflow-with-gulp
//var tsProject = ts.createProject('tsconfig.json');

//gulp.task('typescript:Build', function () {
//    var tsResult = tsProject.src() // instead of gulp.src(...) 
//        .pipe(ts(tsProject));
//    return tsResult.js.pipe(gulp.dest('wwwroot/release'));
//});

gulp.task('typescript:default', function () {
    return gulp.src('FoundryTS/**/*.ts')
        .pipe(ts({
            noImplicitAny: false,
            target: "es5",
            module: "system",
        }))
        .pipe(gulp.dest('wwwroot/js'));
});



//
// PACKAGE
//

gulp.task('cleanDist', function () {
    console.info("------- CLEAN DIST START -------");
    // clean the dist folder
    var del = require('delete');
    return del.sync('dist/*', { force: true });
});

gulp.task('package', ['cleanDist', 'venderJS'], function () {
    console.info("------- WAR START -------");
        gulp.src('dist/**/*')
        .pipe(war({
            welcome: 'index.html',
            displayName: 'Grunt WAR',
        }))
        .pipe(zip('myApp.war'))
        .pipe(gulp.dest("./dist"));
        console.info("------- WAR COMPLETE -------");

    }

);

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
        //routes: {
        //    '/bower_components': 'bower_components',
        //    '/vass_components': 'vaas_components'
        //}
    }
};

gulp.task('serveJasime', [], function () {

    var config = {
        port: 9400,
        server: {
            baseDir: ['wwwroot'],
            index: "/FoundrySpec/testRunner.html"
        }
    };

    browserSync(config);
});

gulp.task('flights', [], function () {

    var config = {
        port: 9900,
        server: {
            baseDir: "wwwroot",
            index: "indexFlights.html"
        }
    };
    browserSync(serveConfig);
});

gulp.task('serve', [], function () {

    browserSync(serveConfig);

    // watch for changes

    //gulp.watch([
    //    'dist/*.html',
    //    'dist/styles/*',
    //    'dist/scripts/app.js',
    //    'dist/fonts/*',
    //    'dist/components/*',
    //    '.tmp/fonts/**/*'
    //]).on('change', reload);



    //gulp.watch('app/_assets/scss/*.scss', ['styles']);
    //gulp.watch('app/_assets/images/*', ['images']);
    //gulp.watch(p.vaasJS, ['js']);
    //gulp.watch(p.vaasComponents, ['components']);
    //gulp.watch('app/*', ['html', 'extras']);
    //gulp.watch('bower.json', ['watch', 'fonts']);

});

