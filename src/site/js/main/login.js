// Login form
$(function() {

    $('#loginForm').on('submit', function(event) {
        event.preventDefault();

        $.post({
            url: $(this).attr('action'),
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(msg) {
                if (msg) {
                    MechAlert.no(msg);
                } else {
                    location.replace($(this).data('redirect'));
                }
            }
        });
        return false;
    });
});