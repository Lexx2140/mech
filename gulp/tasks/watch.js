module.exports = function() {
		// Watch
    $.gulp.task('watch', function() {
        $.gulp.watch($.path.watch.css, $.gulp.series('css'));
        $.gulp.watch($.path.watch.js, $.gulp.series('js'));
        $.gulp.watch($.path.watch.admincss, $.gulp.series('admin_css'));
        $.gulp.watch($.path.watch.adminjs, $.gulp.series('admin_js'));
    });
};