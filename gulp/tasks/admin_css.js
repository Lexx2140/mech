module.exports = function() {
    // ADMIN CSS Styles (concat, autoprefixer, rename & minify)
    $.gulp.task('admin_css', function() {
        return $.gulp.src([
                $.path.src.admincss + '*.css',
                $.path.src.admincss + 'compile/*.css',
                $.path.src.admincss + 'plugins/*.css',
                $.path.src.admincss + 'main/*.css'
            ])
            .pipe($.gp.plumber({ errorHandler: $.onError }))
            .pipe($.gp.concatCss('admin.css'))
            .pipe($.gp.autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe($.gulp.dest($.path.build.admincss))
            .pipe($.gp.csso())
            .pipe($.gp.rename({
                suffix: '.min'
            }))
            .pipe($.gulp.dest($.path.build.admincss))
            .pipe($.gp.notify({ message: 'Admin CSS compiled!' }));
    });
};