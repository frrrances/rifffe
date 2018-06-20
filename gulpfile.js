// gulpfile.js
'use strict';

var gulp = require('gulp'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    del = require('del'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    newer = require('gulp-newer'),
    notify = require('gulp-notify'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    jshint = require('jshint'),

    folder = {
      src: 'src/',
      build: 'build/'
    }
;

// Images
gulp.task('images', function(){
  var out = folder.build + 'i/';
  return gulp.src(folder.src + 'i/**/*.+(png|jpg|gif|svg)')
  .pipe(newer(out))
  .pipe(cache(imagemin()))
  .pipe(gulp.dest(out))
  .pipe(notify({ message: 'Images task complete' }));
});

// HTML
gulp.task('html', ['images'], function() {
  var
    out = folder.build + 'html/';
  return gulp.src(folder.src + 'html/**/*')
    .pipe(newer(out))
    .pipe(gulp.dest(out))
    .pipe(notify({ message: 'HTML task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  var
    out = folder.build + 'js/';
  return gulp.src(folder.src + 'js/**/*.js')
    .pipe(newer(out))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(out))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(out))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('styles', function() {
  var
    out = folder.build + 'css/',
    opts = [
      autoprefixer({ browsers: ['last 2 versions'] })
      ];
  return gulp.src(folder.src + 'scss/main.scss', { style: 'expanded' })
    .pipe(postcss(opts))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest(out))
    .pipe(notify({ message: 'Styles task complete' }));
});

// clean up time!
gulp.task('clean', function() {
    return del(['build/css/*', 'build/html/*', 'build/i/*', 'build/js/*']);
});

gulp.task('default', function() {
    gulp.start('images', 'html', 'scripts', 'styles');
});

gulp.task('watch', function() {

  // Watch .html files
  gulp.watch('src/html/**/*', ['html']);

  // Watch image files
  gulp.watch('src/i/**/*', ['images']);

  // Watch .js files
  gulp.watch('src/js/**/*.js', ['scripts']);

  // Watch .scss files
  gulp.watch('src/scss/**/*.scss', ['styles']);

});
