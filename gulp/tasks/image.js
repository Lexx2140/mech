module.exports = function() {
    // Minify all images
    $.gulp.task('image', function() {
        return $.gulp.src($.path.src.img + '**/*.{png,gif,jpg,jpeg,svg}')
            .pipe($.gp.plumber({ errorHandler: $.onError }))
            .pipe($.gp.image({
            	pngquant: true,
            	optipng: true,
            	zopflipng: true,
            	jpegRecompress: false,
            	mozjpeg: true,
            	guetzli: true,
            	gifsicle: true,
            	svgo: false,
            	concurrent: 10,
            	quiet: false // defaults to false
            }))
            .pipe($.gulp.dest($.path.build.img));
            // .pipe($.gp.notify({ message: 'Images optimized!' }));
    });
};