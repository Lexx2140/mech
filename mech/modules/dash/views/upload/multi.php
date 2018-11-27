<div id="multiUpload" class="uk-form-row">
    <label class="uk-form-label">Завантажити файл(и):<br>
	    <span class="uk-text-muted">
		    макс. кількість: <?php echo ini_get('max_file_uploads'); ?><br>
		    макс. розмір: <?php echo ini_get('post_max_size'); ?>
	    </span>
    </label>
    <div class="uk-form-controls mech-placeholder">
      	<?php echo form_upload('userfile[]','','multiple data-maxfiles="' . ini_get('max_file_uploads') .'"'); ?>
    </div>
</div>
