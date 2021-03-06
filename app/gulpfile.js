'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var util = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');

var htmlmin = require('gulp-htmlmin');
var nodemon    = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

var gulp = require("gulp");
var babel = require("gulp-babel");

var couchViews = require('./server-source/couch-views');

var push = require('couchdb-push');

var path = require('path');

var debug = true;
var port = 4343;

// set up the browserify instance on a task basis
var bundler = watchify(browserify({
    insertGlobals: true,
    entries: './source/index.js',
    debug: debug,
    cache: {}, 
    packageCache: {}
}), {
    ignoreWatch: ['**/node_modules/**'],
    poll: true
}); 

bundler.on('update', function(){
    log('calling browserify update');
    bundle();
    setTimeout(function() {
        browserSync.notify('reloading now ...');
        reload({stream:false});
    }, 100);
});

function bundle() {
    return bundler.bundle()
        .on('error', util.log.bind(util, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())

        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify({compress:{drop_console:true}}))
        .on('error', util.log)
        .pipe(sourcemaps.write('./'))

        .pipe(gulp.dest('./build/source')); 
}

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

function nodeOptions() {
    return {
        script: './build/app.js', 
        ext: 'html js', 
        env: { 'PORT': port }, 
        legacyWatch: true,
        verbose: true,
        delay: '1000ms',
        watch: ['server-source/**/*.js', 'server-source/*.js',  'app.js', 'source/**/*.html'],
        //watch: ['./source/**/*.html', './source/*.html', './server-source/**/*.js', './server-source/*.js'],
        ignore: ["server-source/couch-views"],
        tasks: function (changedFiles) {
                    var tasks = [];
                    changedFiles.forEach(function (file) {
                        console.log('changed file2: ' + file);
                        if (path.extname(file) === '.js' && !~tasks.indexOf('server-code')) tasks.push('server-code')
                        if (path.extname(file) === '.html' && !~tasks.indexOf('views')) tasks.push('views')
                    })
                    return tasks
                }
    };
}

function startNodemon() {
    return nodemon(nodeOptions())
        .on('restart', [], function(ev) {
            log('*** nodemon restarted');
            log('files changed:\n' + ev);
            
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                reload({stream:false});
            }, 1000);
            
        })
        .on('start', function () {
            log('*** nodemon started');
            setTimeout(function() {
                startBrowserSync(true, false);
            }, 1000);
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

gulp.task('views1', [], function () {
    "use strict";
    return gulp.src('./source/index.html')
        // And put it in the dist folder
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./build/source'));
});

gulp.task('views2', [], function(){
    "use strict";
    return gulp.src(['!./source/*', './source/**/*.html'])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./build/source/views'));
});

// javascript task
gulp.task('javascript', [], bundle);

gulp.task("server-root", [], function(){
  return gulp.src(['./app.js', './config.js'])
    .pipe(babel())
    .pipe(gulp.dest("./build"));
});

gulp.task("server-code", ['server-root'], function () {
  return gulp.src(["./server-source/**/*.js", "!./server-source/couch-views/**"])
    .pipe(babel())
    .pipe(gulp.dest("./build/server-source"));
});

gulp.task('couch-views', [], function() {
    push('http://10.211.55.74:5984/configs', './server-source/couch-views/configs', {index:true}, function(err, resp) {
    if(err){
        log(err);
    }
    else {
        log(resp);
    }
    });
});

gulp.task('views', ['views1', 'views2'], function(){});

gulp.task('compile', ['views', 'javascript', 'server-code'], function(){});

gulp.task('default', ['compile'], function() {
    return startNodemon();
}); // so you can run `gulp js` to build the file