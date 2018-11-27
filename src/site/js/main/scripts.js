// Scroll to anchor without changing url
$(function() {

    var $anchor = $('a[href^="#"]').not('.uk-pagination a'),
        elementClick, destination, $modal;

    $anchor.on('click', function(event) {
        event.preventDefault();

        elementClick = $(this).attr("href");
        destination = $(elementClick).offset().top;

        $modal = UIkit.modal("#mobMenuModal");

        if ($modal.isActive()) {
            $modal.hide('slow');
        }

        $('html, body').animate({ scrollTop: destination }, 800);

        return false;
    });
});

// Scroll to top
$(window)
    .on('scroll', function() {
        $('#goTop').toggle($(window).scrollTop() > 100);
    })
    .on('load', function() {
        $('#goTop')
            .on('click', function() {
                $('html, body').animate({ scrollTop: 0 }, 1000);
            })
            .toggle($(window).scrollTop() > 100);
    });

// Phone input mask
$(function() {
    $('input[name=tel]').mask('+38 (999) 999-99-99', { autoсlear: false });
});


// MechAlert
var MechAlert = (function() {

    var notify = UIkit.notify,
        text;

    return {
        yes: function(msg, callback) {
            if (msg || typeof(msg) === "string") {
                text = msg;
            } else {
                text = '<div class="uk-text-center"><i class="uk-icon-small uk-icon-check-square-o"></i></div>';
            }

            notify(text, {
                status: 'success',
                timeout: 1000,
                pos: 'top-center',
                onClose: function() {
                    if (callback && typeof(callback) === "function") {
                        callback();
                    }
                }
            });
        },
        no: function(msg) {
            notify(msg, {
                status: 'danger',
                timeout: 0,
                pos: 'top-center'
            });
        },
        info: function(msg) {
            notify(msg, {
                timeout: 1000,
                pos: 'top-center'
            });
        },

    };
})();

// AJAX custom DIV reload
function xReload(divId, callback) {
    $.get(location + divId, function(content) {

        // Reload content of current divId
        $(divId).replaceWith($(content).find(divId));

        // Callback
        if (callback && typeof(callback) === 'function') {
            callback();
        } else if (callback && typeof(callback) === 'string') {
            MechAlert.yes(callback);
        }
    });
}

// Check for json
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}