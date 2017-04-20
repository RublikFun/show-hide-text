/* gulpfile.js */
var gulp         = require('gulp'),
    concat       = require('gulp-concat'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps   = require('gulp-sourcemaps'),
    uglify       = require('gulp-uglify'),
    changed      = require('gulp-changed'),
	imagemin     = require('gulp-imagemin'),
	notify       = require('gulp-notify'),
	plumber      = require('gulp-plumber'),
	stripDebug   = require('gulp-strip-debug'),
    http         = require('http'),
    cssnano      = require('gulp-cssnano'),
    del          = require('del'),
    livereload   = require('browser-sync');

    // Gulp plumber error handler
    var onError = function(err) {
    	console.log(err);
    }

    // Lets us type "gulp" on the command line and run all of our tasks
    gulp.task('default', ['browser-sync', 'scripts', 'styles', 'watch']);

    // browser-sync task
    gulp.task('browser-sync', function() {
      livereload({
        server: {
            baseDir: 'src'
        },
            notify: false
      });
    });

    // Detele 'dist'
    gulp.task('del', function() {
       del.sync('dist');
    });

    // Copy fonts from a module outside of our project (like Bower)
    gulp.task('build', ['del', 'images'], function() { //
        gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))

        gulp.src('src/css/**/*')
    	.pipe(gulp.dest('dist/css'))

        gulp.src('src/js/**/*.js')
    	.pipe(gulp.dest('dist/js'))
    });

    // Process Stylesheets
    gulp.task('styles', function () {
        gulp.src('src/scss/show-hide-text.scss')
            .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
            .pipe(autoprefixer('last 2 version'))
            .pipe(gulp.dest('src/css'))
            .pipe(cssnano())
            .pipe(concat('show-hide-text.min.css'))
            .pipe(gulp.dest('src/css'))
            .pipe(livereload.reload({stream: true}))
            .pipe(notify({ message: 'Styles task complete' }));
    });

    //Compress Images
    gulp.task('images', function() {
    var imgSrc = 'src/img/**/*',
        imgDst = 'dist/img';

    return gulp.src(imgSrc)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(changed(imgDst))
        //.pipe(imagemin())
        .pipe(gulp.dest(imgDst))
        .pipe(notify({ message: 'Images task complete' }));
    });


    //Combine/Minify Javascript
    gulp.task('scripts', function() {
    return gulp.src([
            'src/js/show-hide-text.js'
        ])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('show-hide-text.min.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('src/js'))
        .pipe(livereload.reload({stream: true}))
        .pipe(notify({ message: 'Scripts task complete' }));
    });

    gulp.task('watch', function() {
        // Watch HTML
        gulp.watch('src/**/*.html', livereload.reload);

    	// Whenever a stylesheet is changed, recompile
        gulp.watch('src/scss/**/*.scss', ['styles']);

    	// If user-developed Javascript is modified, re-run our hinter and scripts tasks
    	gulp.watch('src/js/**/*.js', ['scripts']);

    	// If an image is modified, run our images task to compress images
    	//gulp.watch('src/img/**/*', ['images']);

    });
