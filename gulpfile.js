/**
 * Modules
 */
var gulp    = require('gulp');
var gutil   = require('gulp-util');
var jshint  = require('gulp-jshint');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var header  = require('gulp-header');
var rename  = require('gulp-rename');
var include = require('gulp-include');
var bump    = require('gulp-bump');
var del     = require('del');
var pkg     = require('./package.json');

/**
 * Config
 */
var config = {
  name:   'Macy',
  src:    'src/macy.js',
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

/**
 * Tasks
 */
gulp.task('clean', function (cb) {
  del(['dist'], cb)
});

gulp.task('compile', function () {
  return gulp.src(config.src)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(include())
    .pipe(header(config.banner, { pkg: pkg }))
    .pipe(uglify({preserveComments: 'some', compress: false, mangle: false, output: { beautify: true, indent_level: 2 }}).on('error', gutil.log))
    .pipe(gulp.dest(config.dest))
    .pipe(uglify({preserveComments: 'some'}).on('error', gutil.log))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.dest));
});

gulp.task('default', ['clean'], function () {
  gulp.start('compile');
});

gulp.task('watch', function () {
  gulp.watch(config.src, ['compile']);
});
