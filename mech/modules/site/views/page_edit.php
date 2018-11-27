<!-- Media options -->
<input type="hidden" id="mediaOptions" value='<?php echo $media_options ?? null ?>'>

<!-- Options -->
<ul class="uk-tab" data-uk-tab="{connect:'#pageOptions', swiping: false}">
    <li><a href=""><i class="uk-icon-small uk-icon-file-o"></i>&ensp;Загальні</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-edit"></i>&ensp;Вміст</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-picture-o"></i>&ensp;Медіавміст</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-search"></i>&ensp;SEO</a></li>
</ul>

<ul id="pageOptions" class="uk-switcher uk-margin">

    <!-- MAIN -->
    <li>
        <?php echo $this->lang_lib->lang_switcher('#titleTr'); ?>

        <ul id="titleTr" class="uk-switcher uk-margin">
          <?php foreach ($this->langs as $lang) : ?>
            <li>
              <!-- Title -->
              <div class="uk-form-row">
                  <label class="uk-form-label">Заголовок:</label>
                  <div class="uk-form-controls">
                      <?php echo form_input('title['.$lang["slug"].']', $title[$lang["slug"]] ?? '', 'class="uk-width-large-1-1" data-title2url autofocus'); ?>
                  </div>
              </div>
            </li>
          <?php endforeach; ?>
        </ul>

        <!-- URL -->
        <div class="uk-form-row">
            <label class="uk-form-label">URL:</label>
            <div class="uk-form-controls" data-uk-margin>
                <!-- URL Edit & preview -->
                <div class="uk-text-primary">
                    <!-- Slug URL preview -->
                    <?php echo base_url(); ?><span id="slugSpan"><?php echo $cat_slug ?? ''; ?></span>
                    <!-- Name input -->
                    <?php echo form_input('name', $name ?? '', 'id="autoUrl" class="uk-text-primary uk-width-large-1-2" data-url-check="slug"'); ?>
                    <!-- Auto translit -->
                    <button type="button" id="transLit" class="uk-button"><i class="uk-icon-small uk-icon-refresh uk-text-primary"></i></button>
                    <!-- URL input -->
                    <input type="hidden" name="url" value="<?php echo $url ?? ''; ?>" id="finUrl" data-oldurl="<?php echo $url ?? ''; ?>" />
                </div>
            </div>
        </div>
        <!-- Parent category -->
        <div class="uk-form-row">
            <label class="uk-form-label">Категорія:</label>
            <div class="uk-form-controls" data-uk-margin>
                <select class="uk-width-1-1" name="pid" id="catSelect">
                    <?php echo $cat_select; ?>
                </select>
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
    </li>

    <!-- Content -->
    <li>
        <!-- Page type (content editor) select -->
  			<?php if (($pid > 0 || $id)) {
  				echo form_hidden('ptype', $ptype ?? $parent['options']['pages_type'] ?? $default['pagetype']); ?>
  			<?php } else { ?>
        <div class="uk-form-row">
            <label class="uk-form-label">Тип сторінки:</label>
            <div class="uk-form-controls" data-uk-margin>
                <?php echo form_dropdown('ptype', $form['page_types'], $ptype ?? $parent['options']['pages_type'] ?? $default['pagetype'], 'class="uk-width-large-1-5" data-pagetype-select data-category="0" data-id="'. $id .'"'); ?>
            </div>
        </div>
      <?php } ?>

	      <!-- Content editor -->
	      <fieldset id="contentField" class="uk-margin-top uk-margin-bottom">
	        <?php echo $editor; ?>
	      </fieldset>
    </li>

    <!-- Media upload & edit -->
    <li>
      <?php echo $media_edit; ?>
    </li>

    <!-- MetaTags -->
    <li>
        <?php echo $this->lang_lib->lang_switcher('#metaTr'); ?>

        <ul id="metaTr" class="uk-switcher uk-margin">
            <?php foreach ($this->langs as $lang) : ?>
              <li>
              <!-- Meta title -->
              <div class="uk-form-row">
                  <label class="uk-form-label">Meta Title:</label>
                  <div class="uk-form-controls" data-uk-margin>
                      <?php echo form_input('m_title['.$lang["slug"].']', $m_title[$lang["slug"]] ?? '', 'maxlength="80" class="uk-width-large-1-1" data-text-count'); ?>
                      <span class="uk-text-muted">символів: <span data-show-count>0</span> з 80</span>
                  </div>
              </div>
              <!-- Meta description -->
              <div class="uk-form-row">
                  <label class="uk-form-label">Meta Description:</label>
                  <div class="uk-form-controls" data-uk-margin>
                      <?php echo form_textarea('m_desc['.$lang["slug"].']', $m_desc[$lang["slug"]] ?? '', 'maxlength="160" class="uk-width-large-1-1" data-text-count'); ?>
                       <span class="uk-text-muted">символів: <span data-show-count>0</span> з 160</span>
                  </div>
              </div>
              <!-- Meta keys -->
              <div class="uk-form-row">
                  <label class="uk-form-label">Meta Keywords:</label>
                  <div class="uk-form-controls" data-uk-margin>
                      <?php echo form_textarea('m_keys['.$lang["slug"].']', $m_keys[$lang["slug"]] ?? '', 'maxlength="250" class="uk-width-large-1-1" data-text-count'); ?>
                      <span class="uk-text-muted">символів: <span data-show-count>0</span> з 250</span>
                  </div>
              </div>
              </li>
            <?php endforeach; ?>
        </ul>
				<!-- Canonical page -->
        <div class="uk-form-row">
            <label class="uk-form-label">Канонічна сторінка: </label>
            <div class="uk-form-controls" data-uk-margin>
            		<i class="tf-toggle-icon"></i>
            		<input type="hidden" name="options[canonic]" value="<?php echo $options['canonic'] ?? 0 ;?>">
            </div>
        </div>
    </li>
</ul>