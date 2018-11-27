// File Upload API
$(function() {
    if ($('#mechUpLoader')[0]) {
        MechUploadAPI();
    }
});

function MechUploadAPI() {

    var $fUpLoad = $('#fUpload'),
        $fUp = $fUpLoad.find(':file'),
        $fRemove = $('#fRemove'),
        $fDel = $('#fDel'),
        $fInfo = $('#fInfo'),
        $fShowName = $('#fName'),
        $fShowSize = $('#fSize'),
        $fPreview = $('#fPreview');

    // Select file to upload
    $fUp.on('change', function() {
        return FileUp(this.files[0]);
    });

    // Remove uploaded file
    $fRemove.on('click', function() {
        return FileDel();
    });

    // Upload file
    var FileUp = function(file) {

        // Add delete content input (for server side file delete)
        $fDel.prop('disabled', true);

        // Hide upload button, show remove button && base file info
        $fUpLoad.add($fInfo).add($fPreview).toggle();

        // Read file and show preview
        FilePreview(file);
    };

    // Remove uploaded file
    var FileDel = function() {

        // Add delete content input (for server side file delete)
        $fDel.prop('disabled', false);

        // Clean input
        $fUp.val(null);

        // Remove preview
        $fPreview.empty();

        // Show upload button, hide remove button && file info
        $fInfo.add($fUpLoad).add($fPreview).toggle();
    };


    // Get file dimensions
    var GetFileDims = function(file, src, callback) {

        // Get image width/height
        function ImgSize() {

            var $holderW = $('#mechUpLoader').width();

            // Image load
            var img = new Image();
            img.src = src;

            img.onload = function() {

                var $optsHolder = $('#mediaOptions'),
                    size = {
                        'width': this.width,
                        'height': this.height,
                        'holder_w': $holderW
                    },
                    $options = {};

                // Parse options
                if ($optsHolder[0] !== 'undefined') {
                    $options = JSON.parse($optsHolder.val());
                }

                callback(Object.assign($options, size));
            };
        }

        // Get image width/height
        if (file.type.match('image.*')) {
            return ImgSize();
        }

        callback(null);
    };

    // Show file preview
    var FilePreview = function(file) {

        // Create temp blob src for file
        var src = URL.createObjectURL(file);

        // Get file dimensions && show preview
        GetFileDims(file, src, function(options) {

            var fileInfo = {
                'name': file.name,
                'size': file.size,
                'type': file.type,
                'src': src,
            };

            var data = Object.assign(fileInfo, options);

            // Get template for current file type
            $.get(index + 'file_upload', { 'blob': data }, function(tpl) {
                $fPreview.html(tpl);
                MechImageAPI();
            });
        });

        // Show file name & size
        $fShowName.html(file.name);
        $fShowSize.html((file.size / 1024 / 1024).toFixed(2));
    };
}