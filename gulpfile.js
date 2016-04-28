var autoprefixer = require('autoprefixer');
var browsersync = require('browser-sync');
var concat = require('gulp-continuous-concat');
var cssnano = require('cssnano');
var flatten = require('gulp-flatten');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var gulpif = require('gulp-if');
var path = require('path');
var postcss = require('gulp-postcss');
var merge = require('merge-stream');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

var src = 'src';
var dist = 'dist';

gulp.task('default', ['browser-sync',
                      'optimize-html',
                      'optimize-css']);

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

gulp.task('optimize-html', function() {
  var p = path.join('./', src, 'index.html');
  return gulp.src(p)
    .pipe(watch(p, {verbose: true}))
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      removeEmptyAttributes: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest(dist));
});

gulp.task('optimize-css', function() {
  var processors = [
    cssnano({autoprefixer: {browsers: ['last 2 version'], add: true},
             discardComments: {removeAll: true}})];
  var p = path.join('./', src, 'css/org-default.css');
  var org_default = gulp.src(p)
        .pipe(watch(p, {verbose: true}))
        .pipe(postcss(processors))
        .pipe(flatten())
        .pipe(gulp.dest('dist/'));

  p = [path.join('./', src, 'css/normalize.css'),
       path.join('./', src, 'css/org.scss')];
  var org_custom = gulp.src(p)
        .pipe(watch(path.join('./', src, 'css/org.scss'), {verbose: true}))
        .pipe(gulpif('*.scss', sass()))
        .pipe(concat('org.css'))
        .pipe(postcss(processors))
        .pipe(flatten())
        .pipe(gulp.dest(dist));

  return merge(org_default, org_custom);
});

gulp.task('copy', function() {
  return gulp.src(path.join(dist, '*'))
    .pipe(gulp.dest('../gh-pages'));
});
