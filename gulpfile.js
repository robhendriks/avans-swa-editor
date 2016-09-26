const del = require('del')
const gulp = require('gulp')
const sass = require('gulp-sass')
const sassLint = require('gulp-sass-lint')

const paths = {
  styles: {
    src: 'src/sass/**/*.scss',
    dest: 'assets/css'
  }
}

gulp.task('clean', function () {
  return del([paths.styles.dest])
})

gulp.task('styles', function () {
  return gulp.src(paths.styles.src)
    .pipe(sass()
      .on('error', sass.logError))
    .pipe(gulp.dest(paths.styles.dest))
})

gulp.task('styles:lint', function () {
  return gulp.src(paths.styles.src)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
})

gulp.task('watch', function () {
  gulp.watch(paths.styles.src, ['styles'])
})

gulp.task('build', ['styles'])

gulp.task('default', ['clean', 'build', 'watch'])
