// Max files upload limit
$(function() {
    var $multiFiles = $('input[data-maxfiles]'),
        $maxFiles;

    $multiFiles.on('change', function() {

        $maxFiles = $(this).attr('data-maxfiles');

        if (this.files.length > $maxFiles) {
            MechAlert.no('Максимальна кількість файлів для одночасного завантаження:  ' + $maxFiles);
            this.value = '';
        }
    });
});