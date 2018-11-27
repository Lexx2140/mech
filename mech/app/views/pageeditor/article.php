<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

<!-- Page template -->
<div class="uk-form-row">
    <label class="uk-form-label">Шаблон сторінки:</label>
    <div class="uk-form-controls" data-uk-margin>
        <?php echo form_dropdown('options[tpl]', $tpl_select, $options['tpl'] ?? $parent['options']['pages_tpl'] ?? 'default', ' class="uk-width-large-1-5"'); ?>
    </div>
</div>

<!-- Multilanguage switcher -->
<?php echo $this->lang_lib->lang_switcher('#defTr'); ?>

<ul id="defTr" class="uk-switcher uk-margin">
  <?php foreach ($langs as $lang) : ?>
    <li>
    	<!-- Intro -->
			<p class="uk-margin-top">Вступ:</p>
      <?php echo form_textarea('intro['.$lang['slug'].']', $intro[$lang['slug']] ?? '', 'class="mech-editor"'); ?>
      <!-- Content -->
  		<p class="uk-margin-top">Основний вміст:</p>
      <?php echo form_textarea('content['.$lang['slug'].']', $content[$lang['slug']] ?? '', 'class="mech-editor"'); ?>
    </li>
  <?php endforeach; ?>
</ul>