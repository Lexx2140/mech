$(function() {
	dashNavActns();
	dashLstActns();
	preventSubmit();
	saveForm();
});

// Apply/Save form
function saveForm() {
    $('#saveApply').add('#saveExit').on('click', function() {
        submForm($(this));
    });
}

// Submit save form
function submForm($submit) {

    var $form = $submit.closest('form'),
        $elemID = $submit.closest('[data-id]').attr('data-id'),
        $afterSave = $submit.data('save'),
        $inputs = $form.find(':input');

    preLoad.start(function() {

        $submit.prop('disabled', true).removeClass('uk-button-success');
        $inputs.prop('readonly', true);

        $.post({
            url: $form.attr('action'),
            data: new FormData($form[0]),
            contentType: false,
            processData: false,
            success: function(msg) {
                preLoad.stop();
                if (msg) {
                    MechAlert.no(msg);
                } else {
                    MechAlert.yes(null, function() {
                        if ($afterSave === 'exit') {
                            goBack();
                        } else {
                            if (!$elemID) {
                                location.reload();
                            }
                        }
                    });
                }
                $submit.removeAttr('disabled').addClass('uk-button-success');
                $inputs.removeAttr('readonly');
            }
        });
    });

    return false;
}

// Get item type and action data
function getItem(data) {

    var $item = {};

    for (var i in data) {
        $item.action = (i);
        $item.val = data[i];
    }

    return $item;
}

// Return to the previous window location
function goBack(back) {

    if (back === '' || typeof(back) === 'undefined') {

        if (Cookies.get('goBack')) {
            back = Cookies.get('goBack');
            Cookies.remove('goBack');
        } else {
            back = baseUrl + 'admin';
        }
    }

    window.location.replace(back);
}

// Assign panel actions
function dashNavActns() {

    var $panel = $('#actionPanel'),
        $buttons = $panel.find('[data-create], [data-setup], [data-del]'),
        $type = $panel.attr('data-type'),
        $goBack = $('[data-goback]');

    // Go back button
    $goBack.on('click', function() {
        goBack();
    });

    // Nav action buttons
    $buttons.on('click', function() {

        var $item = getItem($(this).data());

        switch ($item.action) {

            case 'create':
            		var pid = ($item.val !== '') ? '/' + $item.val : '';

                Cookies.set('goBack', window.location.href);
                window.location.replace(index + 'create/' + $type + pid);
                break;
            case 'setup':
                Cookies.set('goBack', window.location.href);
                window.location.replace($(this).attr('data-setup'));
                break;
            case 'del':
                ItemAction.del($type);
                break;
        }
    });
}

// Assign main actions
function dashLstActns() {

    togExtrButs();

    // List actions
    var $list = $('#elList'),
        $type = $('#actionPanel').attr('data-type'),
        $chkAll = $('#checkAll'),
        $chkOne = $list.find('input:checkbox:not(#checkAll)'),
        $sort = $list.find('[data-uk-sortable]'),
        $listAction = $list.find('[data-view], [data-edit], [data-copy], [data-del], [data-pub]');

    $listAction.on('click', function() {

        $(this).on('click', function(event) {
            event.preventDefault();
        });

        var $clicked = $(this),
            $item = getItem($clicked.data()),
            $id = $clicked.closest('[data-id]').attr('data-id');

        switch ($item.action) {

        		case 'view':
        		    Cookies.set('goBack', window.location.href);
        		    window.location.replace(index + 'view/' + $id);
        		    break;
            case 'edit':
                Cookies.set('goBack', window.location.href);
                window.location.replace(index + 'edit/' + $type + '/' + $id);
                break;
            case 'copy':
                ItemAction.copy($type, $id);
                break;
            case 'del':
                ItemAction.del($type, $id);
                break;
            case 'pub':
                ItemAction.pub($clicked, $type, $id);
                break;
        }
    });

    // Select all items in list
    $chkAll.on('click', function() {
        if ($chkOne.length > 0) {
            $chkOne.prop('checked', $(this).prop('checked'));
            togExtrButs();
        } else {
            return false;
        }
        ItemAction.select();
    });

    // Select one(more) item in list
    $chkOne.on('change', function() {
        $chkAll.prop('checked', ($chkOne.filter(':checked').length === $chkOne.length) ? true : false);
        ItemAction.select();
        togExtrButs();
    });

    // Sort items
    $sort.on('start.uk.sortable', function(e) {
        $('html').css('overflow-x', 'hidden');
    }).on('stop.uk.sortable', function() {
        ItemAction.sort($sort);
        $('html').css('overflow-x', 'auto');
    });
}


// Item actions API
var ItemAction = (function() {

    //  Create selected items list
    var select = function() {

        var selected = {},
            list, el = 0;

        // Count selected
        $('#elList').find('input:checkbox:checked:not(#checkAll)').each(function() {
            selected[el++] = $(this).val();
        });

        // Prepare stringified JSON data (if > 0)
        if (jsum(selected) > 0) {
            list = JSON.stringify(selected);
        } else {
            list = 0;
        }

        // Save data to select all input dta attribute
        $('#checkAll').attr('data-selected', list);
    };

    // Copy item
    var copy = function(type, id) {
        $.post({
            url: index + 'copy/' + type + '/' + id,
            success: function(msg) {
                if (msg) {
                    MechAlert.no(msg);
                } else {
                    xReload('#elList');
                }
            }
        });
        return false;
    };

    // Change item publicate state
    var pub = function(el, type, id) {
        xChange(index + 'pub/' + type + '/' + id, function(msg) {
            xReload('#elList');
        });
    };

    // Delete item
    var del = function(type, id) {

        var callback = $('[data-del]').attr('data-del'),
            list = {},
            action, el = 0;

        if (id) {
            action = type + '/' + id;
        } else {
            action = type;
            list = { "data": $('#checkAll').attr('data-selected') };
        }

        UIkit.modal.confirm('Видалити остаточно?', function() {
            $.post({
                url: index + 'del/' + action,
                data: list,
                success: function(msg) {
                    if (msg) {
                        MechAlert.no(msg);
                    } else {
                        if (callback && callback[0] !== 'undefined') {
                            window[callback].apply();
                        } else {
                            MechAlert.yes(null, function() {
                                xReload('#elList');
                            });
                        }
                    }
                }
            });
        });
        return false;
    };

    // Sort items (drag&drop)
    var sort = function(sortable) {

        // Show sort order
        function setSort() {
            var ordering = 1;
            sortable.find('>.movable').each(function() {
                $(this).data('ordering', ordering)
                    .find('.uk-sortable-handle')
                    .text(ordering);
                ordering++;
            });
        }

        // Save sort order
        function saveSort() {
            var order = {},
                $el = $('#actionPanel').data('type');

            sortable.find('>.movable').each(function() {
                var $sorted = $(this);
                order[$sorted.data('id')] = $sorted.data('ordering');
            });

            $.post({
                url: index + 'sort/' + $el,
                data: { "data": JSON.stringify(order) },
                success: function(msg) {
                    xReload('#elList');
                }
            });
        }

        setSort();
        saveSort();
    };

    return {
        copy: copy,
        pub: pub,
        del: del,
        select: select,
        sort: sort
    };
})();


// AJAX custom DIV reload
function xReload(divId) {
    $.get(location + divId, function(content) {
        $(divId).replaceWith($(content).find(divId));
        dashLstActns();
        togCatList();
    });
}

// Change custom values vy Ajax|PHP
function xChange(act, callback) {
    $.ajax({
        url: act,
        success: function() {
            if (callback && typeof(callback) === 'function') {
                callback();
            } else if (callback && typeof(callback) === 'string') {
                MechAlert.yes(callback);
            }
        }
    });
}