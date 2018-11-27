// Image crop & resize API

function MechImageAPI() {

		preventSubmit();

    var $editor = $('#mechImgEditor'),
        $origImg = $('#origImg'),
        $crop = $editor.find('[data-img-crop]'),
        $lock = $editor.find('[data-lock]'),
        $reset = $editor.find('[data-img-reset]'),
        $resize = $editor.find('[data-img-size]').find(':input[type=number]'),
        $cropModal = $('#cropModal'),
        $saveCrop = $cropModal.find(':input[data-crop-save]');

    // Manual crop
    $crop.on('click', function() {
        CropImage($(this).attr('data-img-crop'));
    });

    // Save crop
    $saveCrop.on('click', function() {
        SaveCrop();
    });

    // Lock proportions
    $lock.on('click', function() {
        ToggleLock($(this));
    });

    // Resize image
    $resize.on('change', function() {
        ResizeImage($(this));
    });

    // Reset image
    $reset.on('click', function() {
        ResetImage($(this).attr('data-img-reset'));
    });

    // Get real image size
    var GetRealSize = function() {
        return {
            'w': parseInt($origImg.attr('width')),
            'h': parseInt($origImg.attr('height'))
        };
    };

    // Get previous crop coordinates (if isset)
    var GetPreviousCrop = function(src) {

        var $cropCoords = {
            'x': parseInt($(':input[name=' + src + '_cx]').val()),
            'y': parseInt($(':input[name=' + src + '_cy]').val()),
            'w': parseInt($(':input[name=' + src + '_cw]').val()),
            'h': parseInt($(':input[name=' + src + '_ch]').val())
        };

        return (jsum($cropCoords) > 0) ? $cropCoords : null;
    };

    // Get input sizes
    var GetInputSize = function(src) {
        return {
            w: parseInt($editor.find(':input[name=' + src + '_w]').val()),
            h: parseInt($editor.find(':input[name=' + src + '_h]').val())
        };
    };

    // Get ratio for proportional resize
    var GetResizeRatio = function(input, crop) {

        var real = GetRealSize(),

            rx = input.w / ((crop) ? crop.w : real.w),
            ry = input.h / ((crop) ? crop.h : real.h);

        return Math.max(rx, ry);
    };

    // Crop image API
    var CropImage = function(src) {

        // Save active src image to data()
        $origImg.data('active', src);

        // Get previous crop data
        var crop = GetPreviousCrop(src);

        // Get cropped size
        var cropped = CroppedSizes(src);

        // Set selection for crop
        var $setSelect = [
            (!crop) ? (cropped.left / cropped.ratio).toFixed() : crop.x,
            (!crop) ? (cropped.top / cropped.ratio).toFixed() : crop.y,
            (!crop) ? cropped.w / cropped.ratio : crop.w,
            (!crop) ? cropped.h / cropped.ratio : crop.h
        ];

        // Initialize Crop API
        $origImg.Jcrop({
            setSelect: $setSelect,
            boxWidth: $origImg.parent().width(),
            aspectRatio: cropped.w / cropped.h,
            bgOpacity: 0.5,
            onSelect: UpdateCoord
            // onChange: UpdateCoord
        });

        // Open modal for crop
        var $cropModal = UIkit.modal('#cropModal', { center: true, bgclose: false, keyboard: false });

        $cropModal.show().on({
            'hide.uk.modal': function() {
            		if ($origImg.data('Jcrop')) {
            		    $origImg.data('Jcrop').destroy();
            		    $origImg.removeAttr('style');
            		}
            }
        });
    };

    // Save crop coordinates (in temp data())
    var UpdateCoord = function(c) {
        $origImg.data('temp', {
            x: c.x,
            y: c.y,
            w: c.w,
            h: c.h
        });
    };

    // Save crop coordinates
    var SaveCrop = function() {

        var $temp = $origImg.data('temp'),
            src = $origImg.data('active');

        $(':input[name=' + src + '_cx]').val(parseInt($temp.x));
        $(':input[name=' + src + '_cy]').val(parseInt($temp.y));
        $(':input[name=' + src + '_cw]').val(parseInt($temp.w));
        $(':input[name=' + src + '_ch]').val(parseInt($temp.h));

        PreviewCropped(src);
    };

    // Get cropped sizes & margin
    var CroppedSizes = function(src) {

        // Get real image size
        var real = GetRealSize();

        // Get width & height values from input
        var input = GetInputSize(src);

        // Check if crop data isset
        var crop = GetPreviousCrop(src);

        // Get resize ratio
        var resizeRatio = GetResizeRatio(input, crop);

        // Get max original image size
        var max = {
            'maxW': (real.w * resizeRatio).toFixed(),
            'maxH': (real.h * resizeRatio).toFixed()
        };

        // Set top/left margin for cropped image
        var step = {
            'left': ((crop) ? (crop.x * resizeRatio) : (max.maxW - input.w) / 2).toFixed(),
            'top': ((crop) ? (crop.y * resizeRatio) : (max.maxH - input.h) / 2).toFixed()
        };

        return Object.assign(max, step, input, { ratio: resizeRatio });
    };

    // Preview cropped image
    var PreviewCropped = function(src) {

        // Get cropped size
        var cropped = CroppedSizes(src);

        // Change CSS for image
        function ImageResize() {

            $('#' + src + 'C').css({
                width: cropped.maxW + 'px',
                height: cropped.maxH + 'px',
                maxWidth: cropped.maxW + 'px',
                maxHeight: cropped.maxH + 'px',
                left: (cropped.left > 0) ? '-' + cropped.left + 'px' : '0',
                top: (cropped.top > 0) ? '-' + cropped.top + 'px' : '0'
            });
        }

        // Change CSS for image container
        function FigureResize() {

            $('#' + src + 'C').parent('figure').css({
                width: cropped.w + 'px',
                height: cropped.h + 'px',
                overflow: (cropped.w > $editor.width()) ? 'auto' : 'hidden'
            });
        }

        ImageResize();
        FigureResize();
    };

    // Reset image crop & size
    var ResetImage = function(src) {

        // Reset width & height
        $('#' + src + 'Preview').find('input[type=number]').each(function() {
            $(this).val($(this).prop('defaultValue'));
        });

        // Reset crop data
        $('#' + src + 'Cinput').find('input').each(function() {
            $(this).val(null);
        });

        // Rest image preview
        PreviewCropped(src);
    };

    // Resize image
    var ResizeImage = function($input) {

        // Get default value of current input
        var def = $input.prop('defaultValue');

        // Get default Value of neighbor input
        var $neighbor = $input.siblings('input[type=number]'),
            ndef = $neighbor.prop('defaultValue');

        // Get lock
        var $locked = $input.siblings('button[data-lock]').attr('data-lock');

        if ($locked === 'true') {
            $neighbor.val(($input.val() * ndef / def).toFixed());
        }

        PreviewCropped($input.closest('[data-img-size]').attr('data-img-size'));
    };

}