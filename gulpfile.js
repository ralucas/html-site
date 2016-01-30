var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var ftp = require('vinyl-ftp');

gulp.task('clean', function() {
  return del.sync(['dist/**']);
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(plugins.imagemin({
          progressive: true
        }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('styles', function() {
  return gulp.src('src/less/main.less')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.cssnano())
    .pipe(plugins.sourcemaps.write())
    .pipe(plugins.rename('main.min.css'))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('scripts', function() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.js', 
    'node_modules/jquery.backstretch/src/*.js',
    'node_modules/bootstrap/dist/js/boostrap.js',
    'src/js/*'
  ])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('main.js'))
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write())
    .pipe(plugins.rename('main.min.js'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('index', function() {
  return gulp.src('index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function() {
  return gulp.src([
    'node_modules/bootstrap/dist/fonts/*',
    'node_modules/font-awesome/fonts/*'
  ])
    .pipe(gulp.dest('dist/styles/fonts'));
});

gulp.task('deploy', function() {
  var conn = ftp({
    host: '',
    user: '',
    password: ''
  });

  return gulp.src('dist/**', { base: '.', buffer: false })
    .pipe(conn.newer('/var/www/html'))
    .pipe(conn.dest('/var/www/html'));
});

gulp.task('default', [
  'clean', 
  'images', 
  'styles', 
  'fonts', 
  'scripts', 
  'index'
]);

