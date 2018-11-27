<!-- Title -->
<div class="uk-form-row">
    <label class="uk-form-label">Назва:</label>
    <div class="uk-form-controls" data-uk-margin>
        <?php echo form_input('title', $title ?? '', 'class="uk-width-large-1-1"'); ?>
    </div>
</div>

<!-- Position -->
<div class="uk-form-row">
    <label class="uk-form-label">Розташування:</label>
    <div class="uk-form-controls" data-uk-margin>
        <?php echo form_dropdown('pos', $form['position'], $pos ?? $default['pos'], 'class="uk-width-large-1-2"'); ?>
    </div>
</div>

<!-- Template -->
<div class="uk-form-row">
    <label class="uk-form-label">Шаблон:</label>
    <div class="uk-form-controls" data-uk-margin>
        <?php echo form_dropdown('tpl', $tpl_select, $tpl ?? $default['tpl']); ?>
    </div>
</div>

<!-- Publish -->
<div class="uk-form-row">
    <label class="uk-form-label">Публікувати:</label>
    <div class="uk-form-controls" data-uk-margin>
				<i class="tf-toggle-icon"></i>
				<input type="hidden" name="pub" value="<?php echo $pub ?? 1 ;?>">
    </div>
</div>
