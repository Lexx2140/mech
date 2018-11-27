// Toggle extra buttons
function togExtrButs() {
    var $chkbox = $('#elList').find('input:checkbox:not(#checkAll)'),
        $checked = $chkbox.filter(':checkbox:checked'),
        $del = $('#actionPanel').find('[data-del]');
    $status = $('#actionPanel').find('[data-status]');
    $del.add($status).toggle($checked.length > 0);
}

// Toggle all/selected options in multiselect
$(function() {

    if ($('#multiCheck').length) {
        var $multiCheck = $('#multiCheck'),
            $allChecked = $multiCheck.find(':checkbox[value="-1"]'),
            $other = $multiCheck.find(':checkbox').not($allChecked),
            $parent = $multiCheck.find('li[data-parent]');

        // Check/uncheck all subs when click on category
        $parent.each(function() {
            var $this = $(this),
                $parentCheck = $this.find(':checkbox:first'),
                $subsCheck = $this.find(':checkbox').not($parentCheck);

            $parentCheck.on('click', function() {
                $subsCheck.prop('checked', $(this).prop('checked'));
            });
        });

        // Check/uncheck one
        $other.on('click', function() {
            var $checked = $other.filter(':checked');
            $allChecked.prop('checked', ($checked.length === $other.length) ? true : false);
        });
    }

});

// True|false toggle
$(function() {
    $('.tf-toggle-icon').each(function() {
        togBool($(this));
    });
});

function togBool(toggle) {

    var input = toggle.siblings('input:hidden'),
        bool = 'data-bool',
        field = toggle.attr('data-fieldset'),
        onClass = 'uk-icon-toggle-on on',
        offClass = 'uk-icon-toggle-off';

    // On load
    if (input.val() > 0) {
        toggle.attr(bool, 1).removeClass(offClass).addClass(onClass);

    } else {
        toggle.removeAttr(bool).removeClass(onClass).addClass(offClass);
    }

    // Toggle fieldset (if isset)
    if (field) {
        togField(field, toggle.attr(bool));
    }

    // On click
    toggle.on('click', function() {

        if (toggle.attr(bool)) {
            toggle.removeAttr(bool).removeClass(onClass).addClass(offClass);
            input.val(0);
        } else {
            toggle.attr(bool, 1).removeClass(offClass).addClass(onClass);
            input.val(1);
        }
        if (field) {
            togField(field, toggle.attr(bool));
        }
    });
}


// Toggle fieldset items
function togField(fieldset, toggle) {

    var enable = toggle ? true : false;

    $(fieldset)
        .toggle(enable)
        .find('input, textarea').prop('readonly', !enable).end()
        .find('select').prop('disabled', !enable);
}

// Toggle lock button icon
function ToggleLock(button) {

    var attr = 'data-lock',
        locked = button.attr(attr),
        icon = button.find('i'),
        onClass = 'uk-icon-unlock-alt';

    if (locked) {
        button.removeAttr(attr);
        icon.addClass(onClass);
    } else {
        button.attr(attr, true);
        icon.removeClass(onClass);
    }
}


// Show/hide URLfield
$(function() {

    var $urlCtrl = $('#itemTypeSelect'),
        $urlField = $('#urlField');

    if ($urlCtrl.length) {

        $urlCtrl.on('change', function() {
            togUrlFld($(this).val(), $urlField);
        });

        togUrlFld($urlCtrl.val(), $urlField);
    }
    editItemLnk($urlField);
});

// Toggle url edit fieldset on item type change
function togUrlFld(selected, $urlField) {
    if (selected === 'link' || selected === 'cat' || selected === '1') {
        $urlField.show();
    } else {
        $urlField.hide().find(':input').val('');
        $('#urlIdSelect').val('0');
    }

}