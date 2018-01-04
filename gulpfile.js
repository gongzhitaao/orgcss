const $ = require('gulp');
const $changed = require('gulp-changed');
const $flatten = require('gulp-flatten');
const $htmlmin = require('gulp-htmlmin');
const $postcss = require('gulp-postcss');

const del = require('del');
const server = require('browser-sync').create();

$.task('build', $.series(clean, $.parallel(pages, styles, misc)));
$.task('default', $.series('build', $.parallel(serve, watch)));
$.task('publish', $.series(publish));

function clean() {
  return del(['build']);
}

function reload(done) {
  server.reload();
  done();
}

function watch() {
  $.watch('./src/index.html', $.series(pages, reload));
  $.watch('./src/css/*.css',
          $.series(styles, reload));
  $.watch(['./src/img/*'], $.series(misc, reload));
}

function serve(done) {
  server.init({server: 'build'});
  done();
}

function pages() {
  return $.src('src/index.html')
    .pipe($changed('build'))
    .pipe($htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      removeEmptyAttributes: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe($.dest('build'));
}

function styles() {
  return $.src(['src/css/org-default.css', 'src/css/org.css'])
    .pipe($changed('build'))
    .pipe($postcss([
      require('precss'),
      require('cssnano')({
        autoprefixer: {browsers: ['last 2 version'], add: true},
        discardComments: {removeAll: true}})]))
    .pipe($flatten())
    .pipe($.dest('build'));
}

function misc() {
  return $.src('src/img/*')
    .pipe($changed('build'))
    .pipe($.dest('build/img/'));
}

function publish() {
  return $.src('./build/**/*').pipe($.dest('./'));
}
