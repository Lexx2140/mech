
// Preload animation
var preLoad = (function() {

    var $preloader = $('#mechPreloader');

    return {
        start: function(callback) {
            $preloader.fadeIn('slow', function() {
                if (callback && typeof(callback) === 'function') {
                    callback();
                }
            });
        },
        stop: function(callback) {
            $preloader.fadeOut(function() {
                if (callback && typeof(callback) === 'function') {
                    callback();
                }
            });
        }
    };
})();