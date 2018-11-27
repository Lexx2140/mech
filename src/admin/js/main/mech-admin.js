// Basic dash scripts
$(function() {
    chkUrlInput();
    limitUpload();

    // Set CSRF Token for all ajax requests (for Codeigniter)
    $.ajaxSetup({ data: { csrf_token: Cookies.set('csrf_cookie') } });

    // Login
    var $logForm = $('#loginForm'),
        $logRedirect = $logForm.attr('data-redirect');


    $logForm.on('submit', function(event) {
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
                    location.replace($logRedirect);
                }
            }
        });
        return false;
    });

    // Format Codeigniter profiler
    $('#codeigniter_profiler').css({
        'position': 'relative',
        'bottom': 0,
        'right': 0,
        'margin-left': '18%',
        'margin-bottom': '50px'
    });

    // Show JQuery & UIkit version
    $('#jq').html((window.jQuery) ? 'JQuery: ' + $().jquery + '. UIkit: ' + $.UIkit.version : 'JQuery not loaded!!!');

    // Pass check
    if ($('#pass')[0]) {

        var $pass = $('#pass'),
            $pass_check = $('#pass_check');

        $pass_check.add($pass).on('change', function() {
            if ($pass_check.val() !== '' && $pass.val() !== $pass_check.val()) {
                $pass_check.addClass('uk-form-danger');
            } else if ($pass_check.val() !== '' && $pass.val() === $pass_check.val()) {
                $pass_check.addClass('uk-form-success');
            }
        });

        // Password generate
        $('#passGen').on('click', function() {
            var pass = $.passGen();
            copyToClipboard(pass);
            $('#passGenShow').html(pass);
        });
    }

    // Check alpha/num on input
    $(':input[data-alpha-num]')
        .on('keyup', function() {
            $(this).toggleClass('uk-form-danger', !AlphaNumCheck($(this).val()));
        })
        .on('change', function() {
            if (!AlphaNumCheck($(this).val())) {
                MechAlert.no('Допустимі тільки латинські символи та цифри, символи "_" та "-" ');
            }
        });

    // Count symbols in input/textarea field while typing
    $(':input[data-text-count]').each(function() {

        var $count = $(this),
            $show = $count.siblings('span').children('[data-show-count]');

        $count.on('keyup', function() {
            $show.html($(this).val().length);
        });

        $show.html($count.val().length);
    });

    // Autoenter with translit for [name] input from [title] input
    $('#autoName').on('focus', function() {
        if ($(this).val() === '') {
            urlAutoTranslit(true);
        }
        return false;
    });

    // Phone input mask
    // $('#saveForm').find('input[type="tel"]').each(function(index, el) {
    // 	$(this).mask('(999) 999-99-99', { autoсlear: false });
    // });
});

// Prevent form submit by enter
function preventSubmit () {
	$('#saveForm').find(':input').not('[type=submit]').on('keypress', function(event) {

	    if (event.keyCode == 13) {

	        event.preventDefault();

	        // Focus on next input
	        var inputs = $(this).parents("form").eq(0).find(":input"),
	            idx = inputs.index(this);

	        // Find if the last input (last == submit)
	        if (idx == inputs.length - 1) {
	            inputs[0].select();
	        } else {
	            inputs[idx + 1].focus();
	            // inputs[idx + 1].select();
	        }
	        return false;
	    }
	});
}

// Check input (alpha/num)
function AlphaNumCheck(input) {
    var pattern = /^[a-zA-Z0-9_-]*$/;
    return pattern.test(input);
}

// Calculate object sum
function jsum(obj) {
    var sum = 0;

    for (var el in obj) {
        if (obj.hasOwnProperty(el)) {
            sum += parseFloat(obj[el]);
        }
    }
    return sum;
}

// Copy to clipboard
function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    if (document.execCommand("copy")) {
        MechAlert.info('Пароль скопійовано в буфер обміну');
    }
    $temp.remove();
}

// Max files upload limit
function limitUpload() {

    $('#multiUpload').find('input[data-maxfiles]').on('change', function() {

        var max = $(this).attr('data-maxfiles');

        if (this.files.length > max) {
            MechAlert.no('Максимальна кількість файлів для одночасного завантаження:  ' + max);
            this.value = '';
        }
    });
}


// Check different inputs with urls/links/anchors (by type)
function chkUrlInput() {

    $('#saveForm').find(':input[data-url-check]').on('change', function() {

        var chkd = chkUrl($(this).val, $(this).attr('data-url-check'));

        if (chkd) {
            $urlInput.removeClass('uk-form-danger');
        } else {
            $urlInput.addClass('uk-form-danger');
        }
    });
}

// Check URL with regEx
function chkUrl(url, pattern) {

    if (!pattern) {
        pattern = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
    } else {
        pattern = /^[a-z0-9-_]/;
    }

    return (pattern.test(url)) ? true : false;
}

// Remove &nbsp(s) at the beginning of selected text
function clSpcSelect(selected) {

    var str = selected.text();

    if (/^\s/.test(str)) {
        str = $.trim(str);
        selected.text(str);
    }

    return str;
}

// Trim functions
function trim(str, chars) {
    return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function rtrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}


// MechAlert
var MechAlert = (function() {
    var notify = UIkit.notify,
        text = '<div class="uk-text-center"><i class="uk-icon-small uk-icon-check-square-o"></i></div>';

    return {
        yes: function(msg, callback) {
            if (msg || typeof(msg) === "string") {
                text = msg;
            }

            notify(text, {
                status: 'success',
                timeout: 200,
                pos: 'top-center',
                onClose: function() {
                    if (callback && typeof(callback) === "function") {
                        callback();
                    }
                }
            });
        },
        no: function(msg) {
            notify(msg, {
                status: 'danger',
                timeout: 0,
                pos: 'top-center'
            });
        },
        info: function(msg) {
            notify(msg, {
                timeout: 1000,
                pos: 'top-center'
            });
        },

    };
})();