<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

<!-- Page template -->
<div class="uk-form-row uk-margin">
    <label class="uk-form-label">Шаблон сторінки:</label>
    <div class="uk-form-controls" data-uk-margin>
        <?php echo form_dropdown('options[tpl]', $tpl_select, $options['tpl'] ?? $parent['options']['pages_tpl'] ?? 'default', ' class="uk-width-large-1-5"'); ?>
    </div>
</div>

<!-- Page content type (JSON/different cells)-->
<?php echo form_hidden('json', true); ?>

<!-- Multilanguage switcher -->
<?php echo $this->lang_lib->lang_switcher('#defTr'); ?>

<ul id="defTr" class="uk-switcher uk-margin">
  <?php foreach ($langs as $lang) : ?>
  <li>

    <!-- About us -->
    <div class="uk-form-row">
        <label class="uk-form-label">Про нас (заголовок):</label>
        <div class="uk-form-controls" data-uk-margin>
    			<?php echo form_input('content['.$lang['slug'].'][about_title]', $content[$lang['slug']]['about_title'] ?? '', 'class="uk-width-1-1"'); ?>
        </div>
    </div>
    <div class="uk-form-row">
        <label class="uk-form-label">Про нас (текст):</label>
        <div class="uk-form-controls" data-uk-margin>
    			<?php echo form_textarea('content['.$lang['slug'].'][about]', $content[$lang['slug']]['about'] ?? '', 'class="mech-editor"'); ?>
        </div>
    </div>
    <hr>

		<!-- Blocks -->
		<div class="uk-form-row">
		    <label class="uk-form-label">Блок-1 (заголовок):</label>
		    <div class="uk-form-controls" data-uk-margin>
					<?php echo form_input('content['.$lang['slug'].'][b1_title]', $content[$lang['slug']]['b1_title'] ?? '', 'class="uk-width-1-1"'); ?>
		    </div>
		</div>
		<div class="uk-form-row">
		    <label class="uk-form-label">Блок-1 (текст):</label>
	      <div class="uk-form-controls" data-uk-margin>
	  			<?php echo form_textarea('content['.$lang['slug'].'][b1]', $content[$lang['slug']]['b1'] ?? '', 'class="mech-editor"'); ?>
	      </div>
		</div>
		<hr>
		<div class="uk-form-row">
		    <label class="uk-form-label">Блок-2 (заголовок):</label>
		    <div class="uk-form-controls" data-uk-margin>
					<?php echo form_input('content['.$lang['slug'].'][b2_title]', $content[$lang['slug']]['b2_title'] ?? '', 'class="uk-width-1-1"'); ?>
		    </div>
		</div>
		<div class="uk-form-row">
		    <label class="uk-form-label">Блок-2 (текст):</label>
	      <div class="uk-form-controls" data-uk-margin>
	  			<?php echo form_textarea('content['.$lang['slug'].'][b2]', $content[$lang['slug']]['b2'] ?? '', 'class="mech-editor"'); ?>
	      </div>
		</div>
		<hr>

		<div class="uk-form-row">
		    <label class="uk-form-label">Блок-3 (заголовок):</label>
		    <div class="uk-form-controls" data-uk-margin>
					<?php echo form_input('content['.$lang['slug'].'][b3_title]', $content[$lang['slug']]['b3_title'] ?? '', 'class="uk-width-1-1"'); ?>
		    </div>
		</div>
		<div class="uk-form-row">
		    <label class="uk-form-label">Блок-3 (текст):</label>
	      <div class="uk-form-controls" data-uk-margin>
	  			<?php echo form_textarea('content['.$lang['slug'].'][b3]', $content[$lang['slug']]['b3'] ?? '', 'class="mech-editor"'); ?>
	      </div>
		</div>
  </li>
  <?php endforeach; ?>
</ul>

<!-- Category preview select -->
<div class="uk-form-row">
    <label class="uk-form-label" data-uk-margin>Блог:</label>
    <div class="uk-form-controls">
        <select name="options[cat_preview]" class="uk-width-1-1">
            <?php echo $cat_preview; ?>
        </select>
    </div>
</div>