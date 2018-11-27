module.exports = function() {
    // Convert ttf to woff2
    $.gulp.task('ttf2woff', function() {
        return $.gulp.src($.path.src.ttf + '*.ttf')
            .pipe($.gp.plumber({ errorHandler: $.onError }))
            .pipe($.gp.ttf2woff2())
            .pipe($.gulp.dest($.path.src.woff))
            .pipe($.gp.notify({ message: 'TTF to WOFF2 Converted!' }));
    });
};