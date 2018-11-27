$(function() {

    var $pEdit = $('#saveForm').find('select[data-pagetype-select]');

    if ($pEdit.length > 0) {
        pageEditor($pEdit);
    }
});

// Change pagetype
function pageEditor($pEdit) {

    // Page type
    $pEdit.on('change', function() {

        var $data = {
            'id': $(this).attr('data-id'),
            'pid': $('#catSelect').val(),
            'category': $(this).attr('data-category'),
            'type': $(this).val()
        };

        $.get(index + 'change_pagetype', $data, function(data) {

            // Replace editor template
            $('#contentField').hide(function() {
                $(this).html(data);

                // Initialize wysiwyg
                wysiwygLoader();

                // Toggle widgets edit
                editMediaLib();

            }).fadeIn();
        });
    });

    // Change sub page templates list for selected type
    $('#saveForm').find('select[data-subpage-type]').on('change', function() {

        var $tplSelect = $('#subTplSelect'),
            $data = {
                'id': $(this).attr('data-id'),
                'type': $(this).val()
            };

        $.get(index + 'change_pagetpl', $data, function(data) {
            $tplSelect.html(data);
        });
    });
}


$(function() {
    mediaSrcSelect();
});


// Mediatype select
function mediaSrcSelect() {

    var $mediaSrc = $('#mediaSrc'),
        $mediaSrcSelect = $('#saveForm').find('[data-mediasrc-select]');

    $mediaSrcSelect.on('change', function() {

        var $data = {
            'id': $(this).attr('data-mediasrc-select'),
            'pid': $('input[name=pid]').val(),
            'src': $(this).val()
        };

        $.get(index + 'mediasrc_select', $data, function(data) {
            $mediaSrc.html(data);
            MechUploadAPI();
            InputFields();
        });
    });
}


// Operations with input fields (copy/remove/compile)
$(function() {
    InputFields();
});

function InputFields() {
    var $form = $('#saveForm'),
        $copyField = $form.find('[data-field-copy]'),
        $delField = $form.find('[data-field-del]'),
        $complInput = $form.find(':input[data-name]'),
        $icoChange = $form.find('[data-icon-change]'),
        $icoDel = $form.find('[data-icon-del]');

    // Copy input block
    $copyField.on('click', function() {

        var $field = $(this).closest('fieldset[data-field]'),
            $clone = $field.clone(true);

        // Clone field and insert after original
        $field.after($clone);

        // Clean values & focus on first input
        $clone.find(':input').val('').filter(':first').focus();
        compileInputs($clone.find(':input[data-name]:first'));

        // Clear icon (if isset)
        iconPreview($clone.find('[data-icon-change]'));
        lastDelHide();
    });

    // Delete input block
    $delField.on('click', function() {
        $(this).closest('fieldset[data-field]').remove();
        lastDelHide();
    });

    // Compile inputs on change
    $complInput.on('change', function() {
        compileInputs($(this));
    });

    // Select icon
    $icoChange.on('click', function(event) {
        event.preventDefault();
        iconModal($(this));
    });

    // Delete icon
    $icoDel.on('click', function() {
        iconDel($(this));
    });

    // Check last element in each field
    lastDelHide();
}

// Remove delete from last field
function lastDelHide() {
    $('#saveForm').find('fieldset[data-field]').parent('div').each(function() {
        $del = $(this).find('i[data-field-del]');
        $del.toggle($del.length > 1);
    });
}

// Compile inputs if one changed (json formatted)
function compileInputs($input) {

    // Get parent fieldset, all neighbor inputs and compiling input
    var $field = $input.closest('fieldset[data-compile]'),
        $inputs = $field.find(':input[data-name]'),
        $compiled = $field.find(':input[data-compiled-input]'),
        $serialize = {},
        $inp;

    // Serialize inputs to object
    $inputs.each(function() {
        $inp = $(this);
        $serialize[$inp.attr('data-name')] = $inp.val();
    });

    // Save serialized json to final input
    $compiled.val(JSON.stringify($serialize));
}

// Set icon for icon button
function iconPreview($button, $icon) {

    var $icoDel = $button.siblings('[data-icon-del]'),
        $preview;

    if ($icon) {
        $preview = 'uk-icon-large uk-icon-' + $icon;
        $icoDel.show();
    } else {
        $preview = 'uk-icon-plus';
        $icoDel.hide();
    }

    $button.html('<i class="' + $preview + '"></i>');
}

// Delete icon
function iconDel($clicked) {
    var $icoInput = $clicked.siblings(':input[data-name="icon"]'),
        $icoPreview = $clicked.siblings('[data-icon-change]');

    $icoInput.val('');
    compileInputs($icoInput);
    iconPreview($icoPreview);
}

// Load icon select Modal
function iconModal($icoPreview) {

    // AJAX load modal with icons
    $.get(baseUrl + 'admin/dash/icon_select', function(data) {

        $('body').append(data);

        var $icoModal = UIkit.modal('#iconSelect'),
            $icons = $icoModal.find('.icon-thumb'),
            $icoSearch = $icoModal.find('#icoSearch');

        // Open/hide modal
        $icoModal
            .show()
            .on({
                'hide.uk.modal': function() {
                    $(this).remove();
                }
            });

        // Find icon by input
        $icoSearch.on('keyup', function() {

            var text = $(this).val().toLowerCase();

            if (text) {
                // Find icon captions that contain searching text & show icons
                $icons.hide().children('div:contains(' + text + ')').parent().show();
            } else {
                $icons.show();
            }
        });

        // Select icon
        $icons.on('click', function(event) {
            event.preventDefault();

            // Find active button & its field
            var $icoInput = $icoPreview.siblings(':input[data-name="icon"]'),
                $icoName = $(this).attr('data-icon-name');

            // Set value to input
            $icoInput.val($icoName);
            // Compile (if in compile field)
            compileInputs($icoInput);
            // Show icon preview
            iconPreview($icoPreview, $icoName);
            // Close modal
            $icoModal.hide();
        });
    });
}