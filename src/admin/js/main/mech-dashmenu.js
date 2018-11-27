// Add active class to Sidebar link
$(function() {

    var urlObj = window.location.href.split('/'),
    		$siteHref = $('#siteHref');

    if (urlObj[6] === 'category' || urlObj[5] === 'categories') {
        $('#catsHref').add($siteHref).addClass('active');
    }

    if (urlObj[6] === 'page' || urlObj[5] === 'pages') {
        $('#pagesHref').add($siteHref).addClass('active');
    }

    if (urlObj[4] === 'site') {
        $siteHref.addClass('active');
    }


    $('#dashMenu li').each(function() {

        var $li = $(this),
            link = $li.find('a').attr('href'),
            linkObj = link.split('/');

        if (linkObj[4] !== 'site') {
            $li.toggleClass('active', linkObj[4] === modName);
        }
    });
});



// Add active class to Categories list link

$(function() {
	togCatList();
});

function togCatList() {
    $('#catList').find('tr a').each(function() {
        $(this).closest('tr').toggleClass('mech-active-td', window.location.href === this.href);
    });
}