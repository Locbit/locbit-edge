var gulp = require('gulp'),
    browserSync = require('browser-sync');
    var reload = browserSync.reload;

gulp.task('develop', function () {
   var files = [
      '*.html',
      '*.js',
      'elements/*.html',
   ];

   browserSync.init(files, {
      server: {
         baseDir: './html/'
      }
   });

  gulp.watch(['*.html', '*.css', '*.js'], {cwd: './'}, reload);

});
