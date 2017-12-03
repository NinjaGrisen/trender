var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');


gulp.task('sass', function() {
  return gulp.src('./scss/styles.scss') // Gets all files ending with .scss in ./scss and children dirs
    .pipe(sass()) // Passes it through a gulp-sass
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
})

// Watchers
gulp.task('watch', function() {
  gulp.watch('./scss/**/*.scss', ['sass']);
})

gulp.task('sass', function() {
    return gulp.src("./scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./css"));
});