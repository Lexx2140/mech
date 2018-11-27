module.exports = function() {

    // Build JS scripts for development only
    $.gulp.task('js', function() {
        return $.gulp.src($.path.src.js)
            .pipe($.gp.plumber({ errorHandler: $.onError }))
            .pipe($.gp.concat('mscript.min.js'))
            .pipe($.gulp.dest($.path.build.js))
            .pipe($.gp.notify({ message: 'JS compiled! (dev mode)' }));
    });

    // Build JS scripts for production
    $.gulp.task('js:build', function() {
        return $.gulp.src($.path.src.js)
            .pipe($.gp.plumber({ errorHandler: $.onError }))
            .pipe($.gp.concat('mscript.js'))
            .pipe($.gulp.dest($.path.build.js))
            .pipe($.gp.uglify())
            .pipe($.gp.rename({
                suffix: '.min'
            }))
            .pipe($.gulp.dest($.path.build.js))
            .pipe($.gp.notify({ message: 'JS compiled! (production mode)' }));
    });
};