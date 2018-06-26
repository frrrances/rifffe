// gulpfile.js
'use strict';

var gulp = require('gulp'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    del = require('del'),
    newer = require('gulp-newer'),
    notify = require('gulp-notify'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),

    folder = {
      src: 'src/',
      build: 'build/'
    }
;

// HTML
gulp.task('html', function() {
  var
    out = folder.build + 'html/';
  return gulp.src(folder.src + 'html/**/*')
    .pipe(newer(out))
    .pipe(gulp.dest(out))
    .pipe(notify({ message: 'HTML task complete' }));
});

gulp.task('styles', function() {
  var
    out = folder.build + 'css/',
    plugins = [
        autoprefixer({ browsers: ['last 2 versions'] }),
        cssnano()
    ];
  return gulp.src(folder.src + 'scss/main.scss', { style: 'expanded' })
    .pipe(sass().on('error', sass.logError))
    .pipe( postcss([ require('autoprefixer') ]) )
    .pipe(gulp.dest(out))
    .pipe( postcss([ require('cssnano') ]) )
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(out))
    .pipe(notify({ message: 'Styles task complete' }));
});

// clean up time!
gulp.task('clean', function() {
    return del(['build/css/*']);
});

gulp.task('default', function() {
    gulp.start('html','styles');
});

gulp.task('watch', function() {

  // Watch .html files
  gulp.watch('src/html/**/*', ['html']);

  // Watch .scss files
  gulp.watch('src/scss/**/*.scss', ['styles']);

});
