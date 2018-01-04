const D = require('del');

const $ = require('gulp');
const $changed = require('gulp-changed');
const $flatten = require('gulp-flatten');
const $htmlmin = require('gulp-htmlmin');
const $postcss = require('gulp-postcss');

const browsersync = require('browser-sync');
const reload = (done) => {browsersync.reload(); done();};

$.task('build', $.series(clean, $.parallel(pages, styles, misc)));
$.task('default', $.series('build', $.parallel(serve, watch)));
$.task('publish', $.series(publish));

function clean() {
  return D(['./build']);
}

// -------------------------------------------------------------------
// watch
// -------------------------------------------------------------------

function watch() {
  $.watch('./src/index.html', $.series(pages, reload));
  $.watch('./src/css/*.css',
          $.series(styles, reload));
  $.watch(['./src/img/*'], $.series(misc, reload));
}

// -------------------------------------------------------------------
// serve
// -------------------------------------------------------------------

function serve() {
  browsersync({
    server: './build',
    port: 4000
  });
}

function pages() {
  return $.src('./src/index.html')
    .pipe($changed('./build'))
    .pipe($htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      removeEmptyAttributes: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe($.dest('./build'));
}

function styles() {
  return $.src(['./src/css/org-default.css', './src/css/org.css'])
    .pipe($changed('./build/'))
    .pipe($postcss([
      require('precss'),
      require('cssnano')({
        autoprefixer: {browsers: ['last 2 version'], add: true},
        discardComments: {removeAll: true}})]))
    .pipe($flatten())
    .pipe($.dest('./build'));
}

function misc() {
  return $.src('./src/img/*')
    .pipe($changed('./build'))
    .pipe($.dest('./build/img/'));
}

function publish() {
  return $.src('./build/**/*').pipe($.dest('./'));
}
