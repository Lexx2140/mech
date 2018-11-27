$('[data-uk-pagination]').on('select.uk.pagination', function(e, pageIndex) {

    var $div = $('#pageContent'),
        goback = $div.offset().top;

    $div.animate({ opacity: '0.5' }, 200, function () {
	    	$('html, body').animate({ scrollTop: goback - 100 });
    });

    $.get(window.location.href, { "offset": pageIndex }, function(html) {

        $div.animate({ opacity: '0' }, 200, function() {
            $div.replaceWith($(html).find('#pageContent')).animate({ opacity: 1 }, 200);
        });
    });
});