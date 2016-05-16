'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var htmlmin = require('gulp-htmlmin');

// add custom browserify options here
var customOpts = {
  entries: ['./source/index.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)); 

// add transformations here
// i.e. b.transform(coffeeify);

b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

gulp.task('views1', [], function () {
    "use strict";
    return gulp.src('./source/index.html')
        // And put it in the dist folder
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./build'));
});

gulp.task('views2', [], function(){
    "use strict";
    return gulp.src(['!./source/*', './source/**/*.html'])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./build/views'));
});

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./build'));
}

gulp.task('views', ['views1', 'views2'], function(){});
gulp.task('build', ['views'], bundle); // so you can run `gulp js` to build the file