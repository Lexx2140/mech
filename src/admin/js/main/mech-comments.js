// Comments control
$(function() {
    NotifyComments();
    ToggleComments();
    ChangeCommentStatus();
    ViewComment();
});

// Toggle between comment tabs with content reload (w AJAX load)
function ToggleComments() {
    $('ul[data-comments]').find('li > a').on('click', function(event) {
        event.preventDefault();

        var $tab = $(this);

        if ($tab.parent('li').hasClass('uk-active')) {
            // Prevent reloading active tab
            return false;
        } else {
            ReloadComments($tab);
        }
    });
}

// Refresh comments container (w AJAX)
function ReloadComments($tab) {

    var $li, $link, notify;

    if (typeof($tab) === 'undefined') {
        notify = true;
        $li = $('#elList').find('ul[data-comments]').find('li.uk-active');
        $link = $li.find('a');
    } else {
        $link = $tab;
        notify = false;
    }

    // Reload comments table
    $('#comments_table').load($link.attr('href') + ' #comments_table > *', function() {
        dashLstActns();

        if (notify) {
            NotifyComments();
            SetCommentsCount();
        }

        ViewComment();
    });
}

// Change comments status
function ChangeCommentStatus() {

    $('#commentStates').find('li > a').on('click', function(event) {
        event.preventDefault();

        $.post({
            url: index + 'change_status/' + $(this).attr('data-comment-state'),
            data: { "data": $('#checkAll').attr('data-selected') },
            success: function(msg) {
                if (msg) {
                    MechAlert.no(msg);
                } else {
                    ReloadComments();
                }
            }
        });
        return false;
    });
}

// Change comments count in comments tab header
function SetCommentsCount() {

    var $commentTabs = $('#commentStatus');

    if (typeof($commentTabs[0]) !== 'undefined') {

        $.get(index + 'count_comments', function(data) {

            var $comStates = $commentTabs.find('[data-status]'),
                $count = JSON.parse(data);

            $comStates.each(function() {

                var $badge = $(this),
                    $status = $badge.attr('data-status'),
                    $num = $count[$status];

                $badge.html($num).toggle($num > 0);
            });
        });
    }
}

// Notify new comments in sidebar
function NotifyComments() {
    $.get(baseUrl + 'admin/comments/notify', function(data) {
        $('#comments_notify').toggle(data > 0).html(data);
    });
}

// View/edit comment
function ViewComment() {
    $('[data-ajax-modal]').on('click', function(event) {
        event.preventDefault();

        // AJAX load modal
        $.get($(this).attr('href'), function(data) {

            $('body').append(data);

            var $modal = UIkit.modal('#commentInModal');

            // Open modal
            $modal.show().on({
                'hide.uk.modal': function() {
                    $(this).remove();
                }
            });
        });
    });
}