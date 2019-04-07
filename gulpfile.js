const $ = require('gulp');
const $changed = require('gulp-changed');
const $filter = require('gulp-filter');
const $flatten = require('gulp-flatten');
const $htmlmin = require('gulp-htmlmin');
const $plumber = require('gulp-plumber');
const $postcss = require('gulp-postcss');
const $replace = require('gulp-replace');

const del = require('del');
const server = require('browser-sync').create();

$.task('build', $.series(clean, $.parallel(pages, styles, misc)));
$.task('default', $.series('build', $.parallel(serve, watch)));
$.task('publish', publish);

function clean() {
  return del(['build']);
}

function reload(done) {
  server.reload();
  done();
}

function watch() {
  $.watch(['src/index.html', 'src/ref_bib.html'], $.series(pages, reload));
  $.watch('src/css/*.css', $.series(styles, reload));
  $.watch(['src/img/*'], $.series(misc, reload));
}

function serve(done) {
  server.init({server: 'build'});
  done();
}

function pages() {
  const f = $filter('src/ref_bib.html', {restore: true});
  return $.src(['src/index.html', 'src/ref_bib.html'])
    .pipe($changed('build'))
    .pipe($plumber())
    .pipe($htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      removeEmptyAttributes: true,
      minifyJS: true,
      minifyCSS: true}))
    .pipe(f)
    // .pipe($replace('ref.html', 'index.html'))
    .pipe(f.restore)
    .pipe($.dest('build'));
}

function styles() {
  return $.src(['src/css/org-default.css', 'src/css/org.css'])
    .pipe($changed('build'))
    .pipe($plumber())
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
  return $.src('./build/**/*').pipe($.dest('docs/'));
}
