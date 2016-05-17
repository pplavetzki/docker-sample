'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var util = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var htmlmin = require('gulp-htmlmin');
var nodemon    = require('gulp-nodemon');

var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

var debug = true;
var port = 4343;

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
b.on('log', util.log); // output build logs to terminal

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
    .on('error', util.log.bind(util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./build'));
}

gulp.task('bundle', bundle);

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
    nodemon({script: './app.js', env: { 'PORT': port }, delayTime: 1 })
        .on('restart', [], function(ev) {
            log('*** nodemon restarted');
            log('files changed:\n' + ev);
            
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                reload({stream:true});
            }, 100);
            
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

gulp.task('watch', [], function(){
    gulp.watch(['./source/*.html', './source/**/*.html'], ['views', reload]);
});

gulp.task('default', ['views', 'bundle', 'watch'], function() {
    startNodemon();
    
    //gulp.watch(['app/source/*.js', 'app/source/**/*.js'], ['bundle', reload]);
    //gulp.watch(['app/source/*.html', 'app/source/**/*.html']).on("change", ['views', reload]);
}); // so you can run `gulp js` to build the file