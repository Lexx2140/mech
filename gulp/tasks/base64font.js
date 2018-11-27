module.exports = function() {
    // Import font base64
    return $.gulp.task('base64font', function() {
        $.gulp.src($.path.src.woff + '*.{woff,woff2}')
            .pipe($.gp.plumber({ errorHandler: $.onError }))
            .pipe($.gp.cssfont64())
            .pipe($.gulp.dest($.path.build.fonts))
            .pipe($.gp.notify({ message: 'Fonts compiled to base64!' }));
    });
};