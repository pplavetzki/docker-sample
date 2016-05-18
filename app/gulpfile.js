'use strict';

//var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var util = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var htmlmin = require('gulp-htmlmin');
var nodemon    = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var cache = require('gulp-file-cache')();

var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

var debug = true;
var port = 4343;

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

// javascript task
gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    insertGlobals: true,
    entries: './source/index.js',
    debug: true
  });

  return b.bundle()
    .pipe()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    
    .pipe(sourcemaps.init({loadMaps: true}))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify({compress:{drop_console:true}}))
    .on('error', util.log)
    .pipe(sourcemaps.write('./'))
    
    .pipe(gulp.dest('./build/'));
});

gulp.task('views', ['views1', 'views2'], function(){
    console.log('views rebuilding');
});

function startBrowserSync(isDev, specRunner) {
    'use strict';
    if (browserSync.active) {
        return;
    }

    log('Starting BrowserSync on port: ' + port);

    var options = {
        proxy: 'localhost:' + port,
        port: 8888,
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'modern-web',
        //browser: 'google chrome',
        notify: true,
        reloadOnRestart: true,
        reloadDelay: 1000
    };

    browserSync.init(options);
}

function log(msg) {
    'use strict';
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                util.log(util.colors.blue(msg[item]));
            }
        }
    } else {
        util.log(util.colors.blue(msg));
    }
}

function startNodemon() {
    return nodemon({script: './app.js', ext: 'js html', env: { 'PORT': port }, watch: 'source', tasks: ['compile'] })
        .on('restart', [], function(ev) {
            log('*** nodemon restarted');
            log('files changed:\n' + ev);
            
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                reload({stream:false});
            }, 0);
            
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync(true, false);
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

gulp.task('compile', ['views', 'javascript'], function(){});

gulp.task('watch', [], function(){
    log('watching...');
    gulp.watch(['app/source/*.js', 'app/source/**/*.js'], ['javascript', reload]);
    gulp.watch(['app/source/*.html', 'app/source/**/*.html'], ['views', reload]);
});

gulp.task('default', ['compile'], function() {
    startNodemon();
    
    //gulp.watch(['app/source/*.js', 'app/source/**/*.js'], ['javascript', reload]);
    //gulp.watch(['app/source/*.html', 'app/source/**/*.html'], ['views', reload]);
}); // so you can run `gulp js` to build the file