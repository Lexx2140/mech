<!-- Options -->
<ul class="uk-tab" data-uk-tab="{connect:'#medialibOptions', swiping: false}">
    <li><a href=""><i class="uk-icon-small uk-icon-list"></i>&ensp;Вміст</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-sliders"></i>&ensp;Налаштування</a></li>
</ul>

<ul id="medialibOptions" class="uk-switcher uk-margin">

  <!-- MAIN -->
  <li>
      <!-- Name -->
			<div class="uk-form-row">
			   <label class="uk-form-label">Назва:</label>
			   <div class="uk-form-controls">
			       <?php echo form_input('name', $name ?? '', 'class="uk-width-large-1-1" data-alpha-num'); ?>
			   </div>
			</div>

			<!-- Medialib type -->
			<div class="uk-form-row">
			    <label class="uk-form-label">Шаблон:</label>
			    <div class="uk-form-controls" data-uk-margin>
	            <?php echo form_dropdown('tpl', $tpl_select, $tpl ?? '', 'data-tpl-select');?>
			    </div>
			</div>
			<hr>

			<!-- Content -->
      <?php echo $this->lang_lib->lang_switcher('#contentTr'); ?>

			<ul id="contentTr" class="uk-switcher uk-margin">
			<?php foreach ($this->langs as $lang) : ?>
				<li>
					<!-- Title -->
					<div class="uk-form-row">
					    <label class="uk-form-label">Заголовок:</label>
					    <div class="uk-form-controls">
				        <?php echo form_input('title['.$lang["slug"].']', $title[$lang["slug"]] ?? '', 'class="uk-width-1-1"'); ?>
					    </div>
					</div>
					<!-- Description -->
					<div class="uk-form-row">
					    <label class="uk-form-label">Вміст:</label>
					    <div class="uk-form-controls">
				        <?php echo form_textarea('content['.$lang["slug"].']', $content[$lang["slug"]] ?? '', 'class="mech-editor"'); ?>
					    </div>
					</div>
				</li>
			<?php endforeach; ?>
			</ul>

			<!-- Files multiupload -->
			<?php //echo $items_multiupload; ?>

			<!-- Publish -->
			<div class="uk-form-row">
			    <label class="uk-form-label">Публікувати:</label>
			    <div class="uk-form-controls" data-uk-margin>
							<i class="tf-toggle-icon"></i>
							<input type="hidden" name="pub" value="<?php echo $pub ?? 1 ;?>">
			    </div>
			</div>
  </li>

  <!-- Medialib options -->
  <li>
			<!-- Widget custom ID -->
		<div class="uk-form-row">
		    <label class="uk-form-label">ID:</label>
		    <div class="uk-form-controls" data-uk-margin>
		        <?php echo form_input('options[custom_id]', $options['custom_id'] ?? '', 'class="uk-width-1-1"'); ?>
		    </div>
		</div>

		<!-- Widget custom class -->
		<div class="uk-form-row">
		    <label class="uk-form-label">CSS:</label>
		    <div class="uk-form-controls" data-uk-margin>
		        <?php echo form_input('options[custom_css]', $options['custom_css'] ?? '', 'class="uk-width-1-1"'); ?>
		    </div>
		</div>
		<hr>
    <!-- Items sort -->
    <div class="uk-form-row">
        <label class="uk-form-label">Сортування елементів:</label>
        <div class="uk-form-controls" data-uk-margin>
	          <?php echo form_dropdown('options[items_sort]', $form['items_sort'], $options['items_sort'] ?? 'sort', 'class="uk-width-large-1-5"'); ?>
	          <?php echo form_dropdown('options[items_sort_dir]', $form['items_sort_dir'], $options['items_sort_dir'] ?? '', 'class="uk-width-large-1-5"'); ?>
        </div>
    </div>

    <!-- Image size -->
    <div class="uk-form-row uk-margin">
        <label class="uk-form-label">Зображення (px):</label>
        <div class="uk-form-controls" data-uk-margin>
            <?php echo form_input($form['subs_img_w'], $options['img_w'] ?? $default['img_w'])?>
            &nbsp;x&nbsp;
            <?php echo form_input($form['subs_img_h'], $options['img_h'] ?? $default['img_h'])?>
        </div>
    </div>

    <!-- Thumb size -->
    <div class="uk-form-row">
      <label class="uk-form-label">Мініатюра (px):</label>
      <div class="uk-form-controls" data-uk-margin>
        <?php echo form_input($form['subs_thumb_w'], $options['thumb_w'] ?? $default['thumb_w'])?>
        &nbsp;x&nbsp;
        <?php echo form_input($form['subs_thumb_h'], $options['thumb_h'] ?? $default['thumb_h'])?>
      </div>
    </div>

	</li>
</ul>