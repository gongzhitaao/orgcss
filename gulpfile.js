var gulp = require('gulp');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var filter = require('gulp-filter');
var flatten = require('gulp-flatten');
var browsersync = require('browser-sync');
var path = require('path');

var src = 'app/css';
var dist = 'dist';

gulp.task('default', ['browser-sync'], function() {
  gulp.watch(path.join(src, '*.css'), ['optimize-css']);
});

gulp.task('browser-sync', function() {
  browsersync({
    server: {
      baseDir: dist
    },
    port: 4000,
    files: [
      path.join(dist, '*.css'),
      path.join(dist, '*.html')
    ]
  });
});

gulp.task('optimize-css', function() {
  var f0 = filter(['*', '!org-default.css'], {restore: true});
  var f1 = filter(['*', '!org.css'], {restore: true});

  return gulp.src(path.join(src, '*.css'))
    .pipe(f0)
    .pipe(cssnano())
    .pipe(autoprefixer({ browsers: ['last 2 version']}))
    .pipe(concat('org.css'))
    .pipe(f0.restore)
    .pipe(f1)
    .pipe(cssnano())
    .pipe(autoprefixer({ browsers: ['last 2 version']}))
    .pipe(concat('org-default.css'))
    .pipe(f1.restore)
    .pipe(flatten())
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', function() {
  return gulp.src(path.join(dist, '*'))
    .pipe(gulp.dest('../gh-pages'));
});
