/**
 * Modules
 */
var gulp    = require('gulp');
var babel = require('gulp-babel');
var gutil   = require('gulp-util');
var jshint  = require('gulp-jshint');
var header  = require('gulp-header');
var rename  = require('gulp-rename');
var include = require('gulp-include');
var bump    = require('gulp-bump');
var del     = require('del');
var pkg     = require('./package.json');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var notify = require('gulp-notify');

var browserSync = require('browser-sync');
var reload = browserSync.reload;


/**
 * Config
 */
var config = {
  name:   'Macy',
  src:    'macy.js',
  dest:   'dist/',
  banner: ['/*!',
           ' * Macy.js v<%= pkg.version %> - <%= pkg.description %>',
           ' * Author: Copyright (c) <%= pkg.author.name %> <<%= pkg.author.twitter %>> <<%= pkg.author.url %>>',
           ' * Url: <%= pkg.homepage %>',
           ' * License: <%= pkg.license %>',
           ' */',
           ''].join('\n')
};

/**
 * Bump version
 */
var bumpVer = function (bumpType) {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump({
      type: bumpType
    }))
    .pipe(gulp.dest('./'));
}

gulp.task('bump:patch', function () { return bumpVer('patch'); })
gulp.task('bump:minor', function () { return bumpVer('minor'); })
gulp.task('bump:major', function () { return bumpVer('major'); })


var buildScript = (file, watch) => {
  var props = {
    entries: ['./src/' + file],
    debug : true,
    cache: {},
    packageCache: {},
    transform:  [babelify.configure()],
    standalone: 'Macy',
  };

  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  var rebundle = () => {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(header(config.banner, { pkg: pkg }))
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(gulp.dest('./dist/'))
      .pipe(reload({stream:true}));
  }

  // listen for an update and run rebundle
  bundler.on('update', () => {
    gutil.log('Rebundle...');
    rebundle();
    gutil.log('Compiled');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

/**
 * Tasks
 */
gulp.task('clean', function (cb) {
  del(['dist'], cb)
});

gulp.task('compile', function () {
  return buildScript(config.src, false); // this will run once because we set watch to false
});

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end');
}

gulp.task('default', ['clean'], function () {
  gulp.start('compile:minified');
});

gulp.task('browser-sync', function() {
    browserSync({
        // we need to disable clicks and forms for when we test multiple rooms
        server : {},
        ghostMode: false
    });
});

gulp.task('watch', ['browser-sync'], function () {
  return buildScript(config.src, true);
});
