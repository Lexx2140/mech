$(function() {
	NewComment();
});

// Comments add/reply
function NewComment() {
    var $addComment = $('#addComment'),
        $replyComment = $('[data-comment-reply]'),
        $commentDIV = $('#commentDIV'),
        $url_id = $commentDIV.attr('data-comment-page');

    // Add new comment
    $addComment.on('click', function() {

        $commentDIV.fadeOut('200', function() {

            // Load comment form
            $(this).load(baseUrl + 'comments/add', function() {

            		var $commForm = $('#commentForm');

                // Check for bot spam
                BotCheck();

                // Focus on first input
                $commForm.find(":input:enabled:visible:first").focus();

                // Submit/reset form
                $commForm
                    .on('submit', function(event) {
                        event.preventDefault();
                        CommentSubmit($(this), $url_id);
                    })
                    .on('reset', function() {
                        $commentDIV.fadeOut('400', function() {
                            xReload('#commentsList', function() {
                                NewComment();
                            });
                        });
                    });
            });
        }).fadeIn('2000');

    });

    // Reply to comment
    $replyComment.on('click', function() {

        var $reply = $(this),
            $replyDiv = $reply.closest('.comment-reply'),
            $otherReplies = $('.comment-reply').not($replyDiv).add($addComment),
            $commentPid = $reply.attr('data-comment-reply');

        // Load comment form
        $replyDiv.load(baseUrl + 'comments/add', function(data) {

        		var $commForm = $('#commentForm');

            // Hide add other comment buttons
            $otherReplies.hide();

            // Check for bot spam
            BotCheck();

            // Focus on first input
            $commForm.find(":input:enabled:visible:first").focus();

            // Submit/reset form
            $commForm.on('submit', function(event) {
                event.preventDefault();
                CommentSubmit($(this), $url_id, $commentPid);
            }).on('reset', function(event) {
                xReload('#commentsList', function() {
                    NewComment();
                });
            });
        });
    });
}


// Submit comment
function CommentSubmit($form, $url_id, $pid) {

    var $formData = new FormData($form[0]);

    $pid = ($pid) ? $pid : '0';

    // Append page title, url_id & parent comment
    $formData.append('pagetitle', document.title);
    $formData.append('url_id', $url_id);
    $formData.append('pid', $pid);

    $.post({
        url: $form.attr('action'),
        data: $formData,
        contentType: false,
        processData: false,
        success: function(msg) {
            if (IsJsonString(msg)) {
                MechAlert.yes($.parseJSON(msg).success, function() {
                    xReload('#commentsList');
                });
            } else {
                MechAlert.no(msg);
            }
        }
    });
    return false;
}