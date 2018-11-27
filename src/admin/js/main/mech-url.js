// URL EDIT (Pages & Categories)
$(function() {

    var $autoUrl = $('#autoUrl'),
        $catSelect = $('#catSelect');

    // Transliterate url from title
    $('#transLit').on('click', function() {
        urlAutoTranslit(true);
        editURL();
    });

    // Show full URL & save it to input
    $autoUrl
        .on('change', function() {
            editURL();
        })
        .on('focus', function() {
            if ($(this).val() === '') {
                urlAutoTranslit(true);
            }
            editURL();
        });

    // Toggle slug on parent category change
    $catSelect.on('change', function() {

        clSpcSelect($(this).find('option:selected'));

        $.get(index + 'get_url_slug/' + $(this).val(), function(data) {
            $('#slugSpan').html(data);
            editURL();
        });
    });

    clSpcSelect($catSelect.find('option:selected'));
    clSpcSelect($('#urlIdSelect').find('option:selected'));
});

// Show slug&url & put the url in input after check for copy
function editURL() {

    var $nameInput = $('#autoUrl'),
        $name = $nameInput.val(),
        $oldName = $nameInput.prop('defaultValue'),
        $finUrl = $('#finUrl'),
        $oldUrl = $finUrl.data('oldurl'),
        $slugSpan = $('#slugSpan'),
        url = $slugSpan.html() + $name,
        url_check = {},
        checked;

    // If new url
    if ($name && url !== $oldUrl) {

        url_check = {
            'name': $name,
            'old_url': $oldUrl,
            'url': url
        };

        $.post({
            url: index + 'url_check',
            data: url_check,
            success: function(data) {
                if (data) {
                    checked = JSON.parse(data);
                    $finUrl.val(checked.url);
                    $nameInput.val(checked.name);
                } else {
                    $finUrl.val(url);
                }
            }
        });
    } else {
        $finUrl.val(url);
    }
}

// Select link/ Manual edit
function editItemLnk() {

    var $urlField = $('#urlField'),
        $urlID = $urlField.find('input[name="url_id"]'),
        $link = $urlField.find('input[name="link"]'),
        $anchor = $urlField.find('input[name="anchor"]'),
        $idSelect = $('#urlIdSelect'),
        $linkPreview = $('#linkPreview');

    // Select url from page / manual edit
    $idSelect.on('change', function() {

        var $id = $(this).val(),
            selected = $(this).find('option:selected'),
            text = clSpcSelect(selected),
            link = selected.data('link'),
            title = (text === '---' ? '' : text);

        // Copy page title to item title
        $('input[data-page2title]:first').val(title);

        // Set full link preview & save url_id (for selected page)
        if ($id !== '0') {
            var fin_link = (!selected.data('home') ? (baseUrl + link) : rtrim(baseUrl, '/')),
                anchored = ($anchor.val()) ? '/' + $anchor.val() : '';

            // Show full link
            $linkPreview.val(fin_link + anchored).prop('disabled', true);

            // Set page ID in hidden input
            $urlID.val($id);

            // Make anchor editible
            $anchor.prop('disabled', false);

            // Clear preview & url_id (if empty)
        } else {
            $linkPreview.val('').prop('disabled', false).focus();
            $urlID.val('0');
        }

        $link.val('');
    });

    // Edit anchor
    $anchor.on('keyup', function() {

        var anchor = $(this).val(),
            selected = $idSelect.find('option:selected'),
            link = selected.data('link'),
            finLink = '';

        if (link) {
            finLink = (!selected.data('home')) ? (baseUrl + link) : rtrim(baseUrl, '/');
        }

        if (anchor) {
            finLink = (link) ? finLink + '/' + anchor : anchor;
        }

        $linkPreview.val(finLink);
    });


    // Manual URL edit
    $('#linkChange').on('click', function() {

        $linkPreview.prop('disabled', false).focus();
        $anchor.prop('disabled', true);

        if ($urlID.val() !== '0') {
            $linkPreview.add($anchor).val('');
        }
        $idSelect.add($urlID).val('0');
    });

    // Check manual url & copy it to input & remove url_id
    $linkPreview.on('change', function() {

        var $new_link = $(this).val();

        if ($new_link) {

            if (!chkUrl($new_link)) {
                $linkPreview.addClass('uk-form-danger');
                MechAlert.no('Неправильно вказана адреса');
            } else {
                $linkPreview.removeClass('uk-form-danger');
                $link.val($new_link);
                $urlID.val('0');
            }
        }
    });
}


// Translit title to URL
function urlAutoTranslit(auto) {

    var string = $('input[data-title2url]').val();

    if (string && auto === true) {
        $('#autoUrl').val(translit(string));
    }
    return false;
}