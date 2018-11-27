$(function() {

    if ($('#gmap').length) {

        var $map = $('#gmap'),
        		$wh = $(window).height(),
        		$offset = $map.offset(),
        		$toMap = $offset.top - $wh;

        // Load map if in view
        if ($(window).scrollTop() >= $toMap) {
            LazyMap($map);
        } else {
            $(window).scroll(function() {
                if ($(window).scrollTop() >= $toMap) {
                    LazyMap($map);
                }
            });
        }
    }
});

// Lazy map load
function LazyMap(div) {

    var $loaded = div.attr('data-loaded');

    if (!$loaded) {

        var iframe = document.createElement('iframe');
        iframe.src = div.find('span').text();
        div.html(iframe).attr('data-loaded', true);
    }
}