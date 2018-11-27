<?php defined('BASEPATH') or exit('No direct script access allowed'); ?>
<!-- Title -->
<div class="uk-form-row">
    <label class="uk-form-label">Заголовок:</label>
    <div class="uk-form-controls" data-uk-margin>
        <?php echo form_input('title', $title ?? '', 'class="uk-width-1-1"'); ?>
    </div>
</div>
<!-- Image load -->
<div class="uk-form-row">
    <label class="uk-form-label">Зображення:</label>
    <div class="uk-form-controls uk-margin" data-uk-margin>
        <?php echo $img_edit; ?>
    </div>
</div>
<!-- Type -->
<div class="uk-form-row">
    <label class="uk-form-label">Тип пункту:</label>
    <div class="uk-form-controls" data-uk-margin>
        <?php echo form_dropdown('item_type', $form['item_type'], $item_type ?? 'img', 'id="itemTypeSelect"'); ?>
    </div>
</div>
<fieldset id="urlField">
    <hr>
    <!-- URL Select -->
    <div class="uk-form-row">
        <label class="uk-form-label" data-uk-margin>Посилання на сторінку:</label>
        <div class="uk-form-controls">
            <select id="urlIdSelect" class="uk-width-1-1">
                <?php echo $url_select; ?>
            </select>
        </div>
    </div>
    <!-- URL Input-->
    <div class="uk-form-row">
        <label class="uk-form-label">Власний URL:</label>
        <div class="uk-form-controls" data-uk-margin>
            <div class="uk-grid uk-grid-small">
                <div class="uk-width-large-9-10">
                    <!-- URL Preview/Edit -->
                    <?php echo form_input('', $url ?? $link ?? '', 'id="linkPreview" class="uk-width-1-1" disabled'); ?>
                    <!-- Anchor/other url -->
                    <input type="hidden" name="link" value="<?php echo $url ?? $link ?? ''; ?>">
                    <!-- Page link -->
                    <input type="hidden" name="url_id" value="<?php echo $url_id ?? '0'; ?>">
                </div>
                <div class="uk-width-large-1-10">
                    <button id="linkChange" type="button" class="uk-button uk-width-1-1"><i class="uk-icon-small uk-icon-pencil uk-text-primary"></i></button>
                </div>
            </div>
        </div>
    </div>
</fieldset>
<hr>
<!-- Description -->
<div class="uk-form-row">
    <label class="uk-form-label">Опис:</label>
    <div class="uk-form-controls" data-uk-margin>
        <?php echo form_textarea('content', $content ?? '', 'class="mech-editor"'); ?>
    </div>
</div>
<!-- Publish -->
<div class="uk-form-row">
    <label class="uk-form-label">Публікувати:</label>
    <div class="uk-form-controls" data-uk-margin>
        <div class="uk-button uk-form-select" data-uk-form-select>
            <span></span>
            <?php echo form_dropdown('pub', $form['bool'], $pub ?? 'true'); ?>
        </div>
    </div>
</div>