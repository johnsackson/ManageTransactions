// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');

// tasks
gulp.task('lint', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});
gulp.task('clean', function() {
    gulp.src('./dist/*')
      .pipe(clean({force: true}));
    gulp.src('./app/js/bundled.js')
      .pipe(clean({force: true}));
});
gulp.task('sass', function() {
   gulp.src('./app/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
   .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', function(){
  gulp.watch('./app/sass/*.scss', ['sass']); 
});

gulp.task('minify-css', function() {
   return gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'));
});

var jsFiles = 'app/scripts/**/*.js',
    jsDest = 'dist/js';

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

gulp.task('copy-bower-components', function () {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});
gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});
gulp.task('connectDist',    function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});
// *** default task *** //
gulp.task('default', function() {
  runSequence(
    ['clean'],
    ['lint', 'sass', 'connect']
  );
});
// *** build task *** //
gulp.task('build', function() {
  runSequence(
    ['clean'],
    ['lint', 'sass', 'watch', 'minify-css', 'scripts', 'copy-html-files', 'copy-bower-components', 'connect', 'connectDist']
  );
});
