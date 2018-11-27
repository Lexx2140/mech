$(function() {
    BotCheck();
});

// Check for spam
function BotCheck() {

    $('[data-form-submit]').each(function() {
        var $form = $(this),
            $inputs = $form.find(':input');

        $inputs.each(function() {
            $(this).on('blur', function() {
                $form.removeAttr('data-bot');
            });
        });
    });
}

// Feedback form submit
$(function() {
    $('[data-form-submit]').on('submit', function(e) {
        e.preventDefault();

        var $form = $(this),
            $formName = $form.attr('data-form-submit'),
            formData = new FormData($form[0]),
            $modal;

        // Append page title
        formData.append('pagetitle', document.title);

        // Bot spam protect
        if ($form.attr('data-bot')) {
        	formData.append('bot', true);
        }

        // Append form name
        if (typeof($formName !== 'undefined')) {
            formData.append('form', $formName);
        }

        $.post({
            url: $form.attr('action'),
            data: formData,
            contentType: false,
            processData: false,
            success: function(msg) {
                if (IsJsonString(msg)) {
                    MechAlert.yes($.parseJSON(msg).success, function() {

                    		// Reset form and bot check
                        $form.trigger('reset').attr('data-bot', 'true');

                        // Hide modal (if isset)
                        $modal = $form.closest('.uk-modal');

                        if ($modal) {
                            UIkit.modal($modal).hide();
                        }
                    });
                } else {
                    MechAlert.no(msg);
                }
            }
        });
        return false;
    });
});

