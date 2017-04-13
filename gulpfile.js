const D = require('del');

const $ = require('gulp');
const $changed = require('gulp-changed');
const $concat = require('gulp-concat');
const $dom = require('gulp-dom');
const $flatten = require('gulp-flatten');
const $if = require('gulp-if');
const $htmlmin = require('gulp-htmlmin');
const $postcss = require('gulp-postcss');
const $sass = require('gulp-sass');

const merge = require('merge-stream');
const cssnano = require('cssnano');
const browsersync = require('browser-sync');
const reload = (done) => {browsersync.reload(); done();};

$.task('default', $.series(
  () => D(['./build']),
  $.parallel(pages, styles, misc),
  $.parallel(serve, watch)));

// -------------------------------------------------------------------
// watch
// -------------------------------------------------------------------

function watch() {
  $.watch(['./src/index.html'], $.series(pages, reload));
  $.watch(['./src/css/*.css', './src/css/*.scss'],
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
    .pipe($dom(function() {
      var doc = this;
      var footnotes = doc.getElementById('footnotes');
      var content = doc.getElementById('content');
      var bibliography = doc.getElementById('bibliography');
      if (bibliography)
        content.insertBefore(bibliography, footnotes);
      return doc;
    }))
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
  var processors = [
    cssnano({autoprefixer: {browsers: ['last 2 version'], add: true},
             discardComments: {removeAll: true}})];

  var org_default = $.src('./src/css/org-default.scss')
        .pipe($changed('./build/'))
        .pipe($sass())
        .pipe($concat('org-default.css'))
        .pipe($postcss(processors))
        .pipe($flatten())
        .pipe($.dest('./build'));

  var org_custom = $.src(['./src/css/normalize.css',
                          './src/css/org.scss'])
        .pipe($changed('./build'))
        .pipe($if('*.scss', $sass()))
        .pipe($concat('org.css'))
        .pipe($postcss(processors))
        .pipe($flatten())
        .pipe($.dest('./build'));

  return merge(org_default, org_custom);
}

function misc() {
  return $.src('./src/img/*')
    .pipe($changed('./build'))
    .pipe($.dest('./build/img/'));
}

// -------------------------------------------------------------------
// copy to gh-pages
// -------------------------------------------------------------------

$.task('copy', $.series(
  () => D(['../gh-pages/*'], {force: true}),
  () => $.src('./build/**/*').pipe($.dest('../gh-pages'))));
