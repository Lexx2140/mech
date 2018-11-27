$(function() {
	editMediaLib();
});

// Edit medialib in frame (modal)
function editMediaLib() {

    // Toggle medialib edit button
    $('[data-select-lib]')
        .on('change', function() {
            showLibList($(this));
        })
        .each(function() {
            showLibList($(this));
        });

    function showLibList(lib) {
        lib.siblings('[data-lib-list]').toggle(lib.val() > 0);
    }

    // Edit medialib in frame
    $('[data-lib-list]')
        .on('click', function() {

            var $lib = $(this),
                libName = $lib.closest('[data-libname]').attr('data-libname');

            $data = {
                'lib_id': $lib.siblings('select').val(),
                'page_id': $lib.attr('data-lib-list')
            };

            // AJAX load modal with widget list
            $.get(baseUrl + 'admin/medialib/page_list', $data, function(data) {

                // Load data
                $('body').append(data);

                // Show list
                listLibItems(libName);

                // Open modal
                UIkit.modal('#itemsModal')
                    .show()
                    .on({
                        'hide.uk.modal': function() {
                            $(this).remove();
                        }
                    });
            });
        });
}


// Control items to show on page
function listLibItems(libName) {

    var list = $('#itemsList'),
        showAll = list.find('[data-show-all]'),
        items = list.find('tr[data-id]'),
        input = $('input[name="options[widget][' + libName + '][items]"]'),
        obj = input.val().split(","),
        allState = (obj[0] == '-1') ? 1 : 0;

    items
        // Toggle items on load
        .each(function() {
            toggleItemState($(this), input);
            setItemState($(this), input);
        })

        // Toggle items on click
        .on('click', '[data-item-view]', function() {

            var item = $(this).closest('tr[data-id]'),
                show = (item.attr('data-show') == 1) ? 0 : 1;

            // Save show attribute to item
            item.attr('data-show', show);

            // Change item view
            setItemState(item, input);

            // Save to input
            saveToInput(input, items);
        });

    // Toggle all|none items
    showAll
        .attr('data-show-all', allState)
        .toggleClass('uk-text-success', allState === 1)
        .on('click', function() {

            var all = $(this),
                state = (all.attr('data-show-all') == 1) ? 0 : 1;

        		all
        		.toggleClass('uk-text-success', state === 1)
            .attr('data-show-all', state);

            items.each(function() {

                // Change item state
                $(this).attr('data-show', state);

                // Change item view
                setItemState($(this), input);
            });

            // Save to input
            saveToInput(input, items);
        });
}

// Toggle each lib item
function toggleItemState(item, input) {

    var id = item.attr('data-id'),
        obj = input.val().split(",");

    item.attr('data-show', (obj.includes(id) || obj[0] == -1) ? 1 : 0);
}

// Set shown|hidden item view
function setItemState(item) {

    var show = item.attr('data-show'),
        view = item.find('[data-item-view]'),
        shown = 'uk-text-success',
        hidden = 'inactive uk-overlay-grayscale';

    if (show == 1) {
        view.addClass(shown);
        item.removeClass(hidden);
    } else {
        view.removeClass(shown);
        item.addClass(hidden);
    }
}

// Save items array to input
function saveToInput(input, items) {

    var selected = items.filter('[data-show="1"]'),
    		all = $('[data-show-all]'),
        count1 = items.length,
        count2 = selected.length,
        obj = [],
        i = 0;

    // All items
    if (count2 === count1) {
        obj = '-1';
        all.attr('data-show-all', 1).addClass('uk-text-success');
    }

    // No items
    else if (count2 === 0) {
        obj = '0';
        all.attr('data-show-all', 0).removeClass('uk-text-success');
    }

    // If some selected
    else {
        all.attr('data-show-all', 0).removeClass('uk-text-success');
        selected.each(function() {
            obj[i++] = parseInt($(this).closest('tr[data-id]').attr('data-id'));
        });
    }

    // Save object to inputs
    input.val(obj);
}