module.exports = function() {
    // ADMIN JS Sripts (concat, rename & minify)
    $.gulp.task('admin_js', function() {
        return $.gulp.src([
                $.path.src.adminjs + '*.js',
                $.path.src.adminjs + 'compile/*.js',
                $.path.src.adminjs + 'plugins/*.js',
                $.path.src.adminjs + 'main/*.js'
            ])
            .pipe($.gp.plumber({ errorHandler: $.onError }))
            .pipe($.gp.concat('admin.js'))
            .pipe($.gulp.dest($.path.build.adminjs))
            .pipe($.gp.uglify())
            .pipe($.gp.rename({
                suffix: '.min'
            }))
            .pipe($.gulp.dest($.path.build.adminjs))
            .pipe($.gp.notify({ message: 'Admin JS compiled!' }));
    });
};