<!-- Parent id -->
<input type="hidden" name="pid" value="<?php echo $pid ?? $parent['id'] ?>">

<!-- Multilanguage switcher -->
<?php echo $this->lang_lib->lang_switcher('#titleTr'); ?>

<!-- Title -->
<ul id="titleTr" class="uk-switcher uk-margin">
		<?php foreach ($this->langs as $lang) : ?>
				<li>
					<div class="uk-form-row">
					    <label class="uk-form-label">Заголовок:</label>
					    <div class="uk-form-controls">
					        <?php echo form_input('title['.$lang["slug"].']', $title[$lang["slug"]] ?? '', 'class="uk-width-large-1-1" data-page2title'); ?>
					    </div>
					</div>
					<div class="uk-form-row">
					    <label class="uk-form-label">SEO-title:</label>
					    <div class="uk-form-controls">
					        <?php echo form_input('seo_title['.$lang["slug"].']', $seo_title[$lang["slug"]] ?? '', 'class="uk-width-large-1-1"'); ?>
					    </div>
					</div>
				</li>
		<?php endforeach; ?>
</ul>

<!-- Type -->
<div class="uk-form-row">
    <label class="uk-form-label">Тип пункту:</label>
    <div class="uk-form-controls" data-uk-margin>
        <?php echo form_dropdown('item_type', $form['item_type'], $item_type ?? 'link', 'id="itemTypeSelect"'); ?>
				&ensp;Категорія:&nbsp;
        <select name="cat_id">
            <?php echo $cat_select; ?>
        </select>
    </div>
</div>

<!-- URL Edit  -->
<fieldset id="urlField">
		<hr>
    <!-- URL Select -->
    <div class="uk-form-row">
        <label class="uk-form-label" data-uk-margin>Сторінка:</label>
        <div class="uk-form-controls">
            <select id="urlIdSelect" class="uk-width-1-1">
                <?php echo $url_select; ?>
            </select>
        </div>
    </div>

    <!-- Anchor -->
    <div class="uk-form-row">
        <label class="uk-form-label" data-uk-margin>Якір:</label>
        <div class="uk-form-controls">
        		<?php echo form_input('anchor', $anchor ?? '', 'class="uk-width-1-1"'); ?>
        </div>
    </div>

    <!-- URL Input-->
    <div class="uk-form-row">
        <label class="uk-form-label">URL:</label>
        <div class="uk-form-controls" data-uk-margin>
            <div class="uk-grid uk-grid-small">
                <div class="uk-width-large-9-10">
                    <!-- URL Preview/Edit -->
                		<?php
	                		$disabled = (isset($link) && $link) ? '' : 'disabled';
	                		$enabled = (isset($link) && !$link) ? 'disabled' : '';
											$fin_link = $url ?? $link ?? '';
										?>

                    <?php echo form_input('', $fin_link . ($anchor ?? ''), 'id="linkPreview" class="uk-width-1-1" '. $disabled); ?>

                    <!-- Anchor/other url -->
                    <input type="hidden" name="link" value="<?php echo $link ?? ''; ?>" <?php echo $enabled; ?>>
                    <!-- Page link -->
                    <input type="hidden" name="url_id" value="<?php echo $url_id ?? '0'; ?>">
                </div>

                <div class="uk-width-large-1-10">
                    <button id="linkChange" type="button" class="uk-button uk-width-1-1"><i class="uk-icon-small uk-icon-pencil uk-text-primary"></i></button>
                </div>
            </div>
        </div>
    </div>

		<!-- Target -->
    <div class="uk-form-row">
        <label class="uk-form-label">Відкривати в:</label>
        <div class="uk-form-controls" data-uk-margin>
            <?php echo form_dropdown('target', $form['target'], $target ?? ''); ?>
        </div>
    </div>
    <hr>
</fieldset>

<!-- Icon -->
<div class="uk-form-row uk-margin-top">
    <label class="uk-form-label" data-uk-margin>Іконка:</label>
    <div class="uk-form-controls">
				<?php echo $icon_edit; ?>
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