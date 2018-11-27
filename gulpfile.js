global.$ = {

    gulp: require('gulp'),
    sourcemaps: require('gulp-sourcemaps'),
    gp: require('gulp-load-plugins')(),

    path: {
        tasks: require('./gulp/tasks.js'),

        build: {
            css: 'assets/css/',
            js: 'assets/js/',
            fonts: 'assets/fonts/',
            img: 'assets/img_compressed/',
            admincss: 'mech/modules/dash/views/assets/css/',
            adminjs: 'mech/modules/dash/views/assets/js/'
        },

        src: {
            css: [
                'src/site/css/*.css',
                'src/site/css/compile/*.css',
                'src/site/css/plugins/*.css',
                'src/site/css/main/*.css'
            ],
            js: [
                'src/site/js/*.js',
                'src/site/js/compile/*.js',
                'src/site/js/plugins/*.js',
                'src/site/js/main/*.js'
            ],
            woff: 'src/site/fonts/woff/',
            ttf: 'src/site/fonts/ttf/',
            img: 'assets/img/',
            admincss: 'src/admin/css/',
            adminjs: 'src/admin/js/'
        },

        watch: {
            css: 'src/site/css/**/*.css',
            js: 'src/site/js/**/*.js',
            admincss: 'src/admin/css/**/*.css',
            adminjs: 'src/admin/js/**/*.js'
        }
    },

    // Error notify => send explanation to console
    onError: function(err) {
        $.gp.notify({
            title: 'GulpTask Error',
            message: 'Check the console.'
        });

        console.log(err.toString());
        this.emit('end');
    }
};

// Append tasks pathes
$.path.tasks.forEach(function(taskPath) {
    require(taskPath)();
});


// Default task
$.gulp.task('default', $.gulp.series('watch'));

// Fonts convert task
$.gulp.task('fonts', $.gulp.series('ttf2woff', 'base64font'));

// Build task
$.gulp.task('build', $.gulp.series(
    $.gulp.parallel('css:build', 'js:build')
));