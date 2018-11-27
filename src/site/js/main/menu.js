$(function() {

    // Set menu`s
    var $menu = $('#topMenu').add('#mobMenu'),
        $menuLinks = $menu.find('li > a');

    // Toggle active menu href
    $menuLinks.each(function() {
        if (window.location.href === this.href) {
            $(this).addClass('active').parent('li').addClass('active');
        }
    });

    // Toggle active menu href (by breadcrumbs)
    var $crumbs = $('#breadCrumbs').find('a'),
        $crumbsHref = [],
        $link;

    $crumbs.each(function(index) {
        $crumbsHref[index] = $(this).attr('href');
    });

    $menuLinks.each(function() {
        $link = $(this);

        if ($.inArray($link.attr('href'), $crumbsHref) !== -1) {
            $link.fadeTo('fast', 1, function() {
                $(this).addClass('active');
            });
        }
    });
});