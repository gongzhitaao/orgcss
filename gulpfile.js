var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var filter = require('gulp-filter');
var flatten = require('gulp-flatten');
var browsersync = require('browser-sync');

var src = 'app/css';
var dist = 'dist';

gulp.task('default', ['browser-sync'], function() {
    gulp.watch(src + '/*.css', ['optimize-css']);
});

gulp.task('browser-sync', function() {
  browsersync({
    server: {
      baseDir: dist
    },
    port: 4000,
    files: [
      'dist/*.css',
      'dist/*.html'
    ]
  });
});

gulp.task('optimize-css', function() {
  var f0 = filter(['*', '!org-default.css'], {restore: true});
  var f1 = filter(['*', '!org.css'], {restore: true});

  return gulp.src(src + '/*.css')
    .pipe(f0)
    .pipe(minifyCSS())
    .pipe(autoprefixer({ browsers: ['last 2 version']}))
    .pipe(concat('org.css'))
    .pipe(f0.restore)
    .pipe(f1)
    .pipe(minifyCSS())
    .pipe(autoprefixer({ browsers: ['last 2 version']}))
    .pipe(concat('org-default.css'))
    .pipe(f1.restore)
    .pipe(flatten())
    .pipe(gulp.dest('dist'));
});
