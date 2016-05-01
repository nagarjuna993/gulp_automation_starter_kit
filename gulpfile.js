/* File: gulpfile.js */

/* grab packages */
var gulp   = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    sass   = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

/* define the default task and add the watch task to it */
gulp.task('default', ['watch']);

/* configure the jshint task */
gulp.task('jshint', function() {
  return gulp.src('source/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/* Configure stylesheets */
gulp.task('build-css', function() {
  return gulp.src('source/scss/**/*.scss')
    .pipe(sourcemaps.init())  // Process the original sources
      .pipe(sass())
      .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest('dist/assets/css'));
});

/* Configure javascript */
gulp.task('build-js', function() {
  return gulp.src('source/js/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/assets/js'));
});

/* Configure images */
gulp.task('build-images', function() {
  return gulp.src('source/images/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      multipass: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/assets/images'));
});

/* configure which files to watch and what tasks to use on file changes */
gulp.task('watch', function() {
  gulp.watch('source/js/**/*.js', ['jshint']);
  gulp.watch('source/scss/**/*.scss', ['build-css']);
});
