var gulp = require('gulp'),
    connect = require('gulp-connect'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),
    fs = require('fs'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    gulpNgConfig = require('gulp-ng-config'),
    filter = require('gulp-filter'),
    json = JSON.parse(fs.readFileSync('./package.json')),
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    purify = require('gulp-purifycss');



gulp.task('clean:production', function() {
    return gulp.src('production/*')
        .pipe(vinylPaths(del))
        .pipe(filter(['*', '!.git']))
        .pipe(gulp.dest('./production'));
});

gulp.task('config', function() {
    gulp.src('./local.json')
        .pipe(gulpNgConfig('app.config', {
            environment: argv.production ? 'production' : 'development'
        }))
        .pipe(gulp.dest('./configs/'))
})

gulp.task('copy-html', ['clean:production'], function() {
    return gulp.src(['./configs/index.html', './development/**/*.html', '!node_modules/**/*.html', '!./development/vendor/**/*.html', '!production/**/*.html', '!static/**/*.html'])
               .pipe(gulp.dest('./production'));
});

gulp.task('copy-fonts', ['clean:production'], function(){
    return gulp.src('./development/assets/fonts/**/*')
               .pipe(gulp.dest('./production/assets/fonts'));
});

gulp.task('copy-images', ['clean:production'], function(){
    return gulp.src('./development/assets/img/**/*')
               .pipe(gulp.dest('./production/assets/img'));
});

gulp.task('vendorcss', ['clean:production'], function(){
    return gulp
			.src([
        './development/assets/vendor/animate/animate.css',
        './development/assets/vendor/bootstraps/bootstraps.css',
        './development/assets/vendor/font-awesome/font-awesome.css',
        './development/assets/vendor/angular-carousel/dist/angular-carousel.css',
        './development/assets/vendor/loading-bar.min.css',
				'./development/assets/vendor/**/*.css'
			])
		  .pipe(concat('vendor.css'))
		  .pipe(gulpif(argv.production, cssmin()))
			.pipe(gulpif(argv.production, purify(['./production/**/*.js', './production/**/*.html'])))
		    .pipe(gulp.dest('production/assets/css'))
});

gulp.task('vendorjs', ['clean:production'], function(){
    return gulp
		.src([
      './development/assets/vendor/angular/angular.js',
      './development/assets/vendor/angular/angular-animate/angular-animate.js',
      './development/assets/vendor/angular/angular-bootstrap/ui-bootstrap-custom-tpls-0.14.3.min.js',
      './development/assets/vendor/angular/angular-ui-router/angular-ui-router.js',
      './development/assets/vendor/angular/restangular/restangular.min.js',
      './development/assets/vendor/angular/ng-feathers.standalone.min.js',
      './development/assets/vendor/angular/underscore/underscore-min.js',
      './development/assets/vendor/angular/angular-chart/Chart.js',
      './development/assets/vendor/angular/angular-chart/angular-chart.min.js',
      './development/assets/vendor/angular/dirDisqus.js',
    './development/assets/vendor/angular/angular-sanitize.min.js',
    './development/assets/vendor/angular/tv4.js',
    './development/assets/vendor/angular/tv4.async-jquery.js',
    './development/assets/vendor/angular/ObjectPath.js',
    './development/assets/vendor/angular/schema-form.min.js',
    './development/assets/vendor/angular/dist/bootstrap-decorator.min.js',
    './development/assets/vendor/angular/angular-carousel/dist/angular-carousel.js',
		'./development/assets/vendor/*.js',
    './development/assets/vendor/bootstrap/bootstrap.min.js',
    './development/assets/vendor/bootstrap/jquery.min.js',
    './development/assets/vendor/bootstrap/main.js',
    './development/assets/vendor/loading-bar.min.js',
    './development/assets/vendor/satellizer/satellizer.min.js'
		])
    .pipe(concat('vendor.js'))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('./production/assets/js'));
});

gulp.task('appjsfiles', ['clean:production'], function(){
    return gulp.src([ './configs/local.js', './development/assets/js/app.js', './development/assets/js/*.js', './development/modules/**/*.js'])
    .pipe(concat(json.name.toLowerCase() + '.js'))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulpif(argv.production, rename({suffix: '.min'})))
    .pipe(gulp.dest('./production/assets/js'));
});

gulp.task('connect', function() {
    connect.server({
        root: './production/',
        port: 4930
    });
});

gulp.task('link-files', ['copy-images', 'copy-fonts', 'copy-html',  'vendorjs', 'vendorcss', 'appjsfiles'], function () {
  var target = gulp.src('./production/index.html');
  var sources = gulp.src(['./production/assets/js/vendor.js', './production/assets/js/*.js', './production/assets/css/vendor.css', './production/assets/css/*.css'], {read: false});
  return target.pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest('./production'));
});

gulp.task('style', ['clean:production'], function(){
    return gulp.src(['./development/assets/css/app.css', '.development/assets/css/ted.css'])

        .pipe(concat(json.name.toLowerCase() + '.css'))
        .pipe(gulpif(argv.production, cssmin()))
		.pipe(gulpif(argv.production, purify(['./production/assets/**/*.js', './production/modules/**/*.html'])))
        .pipe(gulpif(argv.production, rename({suffix: '.min'})))
		.pipe(gulp.dest('./production/assets/css'))
});

gulp.task('logger', function(){
    console.info('===== A file changed ======== restarting server now ====');
});

gulp.task('build', [ 'config', 'style', 'link-files']);


gulp.task('default', ['clean:production', 'config', 'copy-images', 'connect', 'copy-html', 'vendorjs','vendorcss','appjsfiles','copy-fonts','link-files']);

gulp.task('serve', ['connect', 'config', 'style', 'link-files'], function () {
	return gulp.watch(['./configs/**/*', './development/assets/**/*', './development/modules/**/*'], ['logger','style', 'link-files']);
});
