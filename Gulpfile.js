var gulp = require('gulp');
var elm  = require('gulp-elm');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var gulputil = require('gulp-util');

gulp.task('elm-init', elm.init);

gulp.task('elm', ['elm-init'], function(){
    return gulp.src('elm/App.elm')
        .pipe(elm().on('error', gulputil.log))
        .pipe(gulp.dest('elm/dist/scripts'));
});

gulp.task('watch', function (done) {
  gulp.watch('elm/**/*.elm', function () {
        gulp.start(['elm']);
    });
});

gulp.task('default', ['elm', 'watch']);
