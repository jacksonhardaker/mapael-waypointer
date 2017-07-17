(function (r) {
    'use strict';

    var gulp = r('gulp');
    var sass = r('gulp-sass');
    var concat = r('gulp-concat');
    var cssmin = r('gulp-cssmin');

    gulp.task('sass', function () {
        return gulp.src('./scss/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./.tmp/css'));
    });

    gulp.task('watch', function () {
        gulp.watch('./scss/**/*.scss', ['sass', 'concat-css']);
    });

    gulp.task('concat-css', ['sass'], function () {
        return gulp.src('./.tmp/css/*.css')
            .pipe(concat('mapael-waypointer-public.css'))
            .pipe(cssmin())
            .pipe(gulp.dest('./public/css/'));
    });

    gulp.task('build', ['sass', 'concat-css', 'watch']);


})(require);