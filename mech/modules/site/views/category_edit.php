<!-- Media options -->
<input type="hidden" id="mediaOptions" value='<?php echo $media_options ?? null; ?>'>

<!-- Options -->
<ul class="uk-tab" data-uk-tab="{connect:'#catOptions', swiping: false}">
    <li><a href=""><i class="uk-icon-small uk-icon-file-o"></i>&ensp;Загальні</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-edit"></i>&ensp;Вміст</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-picture-o"></i>&ensp;Медіавміст</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-search"></i>&ensp;SEO</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-sliders"></i>&ensp;Параметри категорії</a></li>
</ul>

<ul id="catOptions" class="uk-switcher uk-margin">

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
		                <?php echo form_input('title['.$lang["slug"].']', $title[$lang["slug"]] ?? '', 'class="uk-width-large-1-1" data-title2url'); ?>
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
                 <?php echo form_input('name', $name ?? '', 'id="autoUrl" class="uk-text-primary uk-width-1-2"'); ?>
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
			<!-- Category editor select -->
    	<div class="uk-form-row">
    	    <label class="uk-form-label">Шаблон категорії:</label>
    	    <div class="uk-form-controls" data-uk-margin>
    	        <?php echo form_dropdown('options[tpl]', $cat_tpl_select, $options['tpl'] ?? $parent['options']['tpl'] ?? 'default', 'class="uk-width-large-1-5"'); ?>
    	    </div>
    	</div>
    	<hr>

      <!-- Multilanguage switcher -->
      <?php echo $this->lang_lib->lang_switcher('#contentTr'); ?>

      <ul id="contentTr" class="uk-switcher uk-margin">
        <?php foreach ($this->langs as $lang) : ?>
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

    <!-- Category options -->
    <li class="uk-accordion" data-uk-accordion>

    		    <h3 class="uk-accordion-title"><i class="uk-icon-caret-right"></i> Параметри сторінок</h3>
    		    <div class="uk-accordion-content">

    		    		<!-- Default category pages type -->
    		    		<div class="uk-form-row uk-margin-large">
    		    		    <label class="uk-form-label">Тип сторінок:</label>

    		    		    <div class="uk-form-controls" data-uk-margin>
    		    		        <?php $id = (isset($id)) ? $id : null; ?>
    		    		        <?php echo form_dropdown('options[subp_type]', $form['page_types'], $options['subp_type'] ?? $parent['options']['subp_type'] ?? '', 'class="uk-width-large-1-5" data-subpage-type data-id="'. $id .'"'); ?>
    		    		      &ensp;

    		    		      <!-- Default category pages template -->
    		    		      Шаблон (за замовч.):
    		    		      <span id="subTplSelect">
    		    		      <?php echo form_dropdown('options[subp_tpl]', $page_tpl_select, $options['subp_tpl'] ?? $parent['options']['subp_tpl'] ?? '', 'class="uk-width-large-1-5"'); ?>
    		    		      </span>
    		    		    </div>
    		    		</div>

    		    		<!-- Category pages num on one page -->
    		    		<div class="uk-form-row">
    		    		    <label class="uk-form-label">Сторінок на одному екрані:</label>
    		    		    <div class="uk-form-controls" data-uk-margin>
    		    		        <?php echo form_input($form['items_num'], $options['items_num'] ?? '0'); ?>
    		    		    </div>
    		    		</div>

    		    		<!-- Category pages sort -->
    		    		<div class="uk-form-row">
    		    		    <label class="uk-form-label">Сортування:</label>
    		    		    <div class="uk-form-controls" data-uk-margin>
    		    		        <?php echo form_dropdown('options[items_sort]', $form['items_sort'], $options['items_sort'] ?? 'sort', 'class="uk-width-large-1-5"'); ?>
    		    		        <?php echo form_dropdown('options[items_sort_dir]', $form['items_sort_dir'], $options['items_sort_dir'] ?? '', 'class="uk-width-large-1-5"'); ?>
    		    		    </div>
    		    		</div>

    		    		<!-- Category TOP pages num -->
    		    		<div class="uk-form-row">
    		    		    <label class="uk-form-label">TOP FIRST:</label>
    		    		    <div class="uk-form-controls" data-uk-margin>
    		    		        <?php echo form_input($form['items_top'], $options['items_top'] ?? '0'); ?>
    		    		    </div>
    		    		</div>

    		    		<!-- Add category URL -->
    		    		<div class="uk-form-row uk-margin-large-top">
    		    		    <label class="uk-form-label">Додавати URL категорії до URL сторінок:</label>
    		    		    <div class="uk-form-controls" data-uk-margin>
    		    		    		<i class="tf-toggle-icon"></i>
    		    		    		<input type="hidden" name="options[add_url]" value="<?php echo $options['add_url'] ?? $parent['options']['add_url'] ?? $default['add_url'] ;?>">
    		    		    </div>
    		    		</div>

		    		    <!-- Show comments -->
		    		    <div class="uk-form-row">
		    		        <label class="uk-form-label">Відображати коментарі для сторінок:</label>
		    		        <div class="uk-form-controls" data-uk-margin>
		    		        		<i class="tf-toggle-icon"></i>
		    		        		<input type="hidden" name="options[comments]" value="<?php echo $options['comments'] ?? 0 ;?>">
		    		        </div>
		    		    </div>
    		    </div>

    		    <h3 class="uk-accordion-title"><i class="uk-icon-caret-right"></i> Зображення сторінок</h3>
    		    <div class="uk-accordion-content">
    		    	<!-- Image size -->
    		    	<div class="uk-form-row">
    		    	    <label class="uk-form-label">Зображення <br>(за замовч.):</label>
    		    	    <div class="uk-form-controls" data-uk-margin>
    		    	        <?php echo form_input($form['subs_img_w'], $options['img_w'] ?? $parent['options']['img_w'] ?? $default['img_w']); ?>
    		    	        &nbsp;x&nbsp;
    		    	        <?php echo form_input($form['subs_img_h'], $options['img_h'] ?? $parent['options']['img_h'] ?? $default['img_h']); ?>
    		    	        (px)
    		    	    </div>
    		    	</div>

    		    	<!-- Thumb size -->
    		    	<div class="uk-form-row">
    		    	    <label class="uk-form-label">Мініатюри <br>(за замовч.):</label>
    		    	    <div class="uk-form-controls" data-uk-margin>
    		    	        <?php echo form_input($form['subs_thumb_w'], $options['thumb_w'] ?? $parent['options']['thumb_w'] ?? $default['thumb_w']); ?>
    		    	        &nbsp;x&nbsp;
    		    	        <?php echo form_input($form['subs_thumb_h'], $options['thumb_h'] ?? $parent['options']['thumb_w'] ?? $default['thumb_h']); ?>
    		    	        (px)
    		    	    </div>
    		    	</div>
    		    </div>

    		    <h3 class="uk-accordion-title"><i class="uk-icon-caret-right"></i> Сторінки інших категорій</h3>
    		    <div class="uk-accordion-content">

    		    	<!-- Allied categories -->
    		    	<div class="uk-form-row">
    		    	    <label class="uk-form-label">Відображати сторінки <br>інших категорій:</label>
    		    	    <div class="uk-form-controls" data-uk-margin>
    		    	        <div class="uk-scrollable-box uk-width-1-1">
    		    	            <ul class="uk-list" id="multiCheck">
    		    	                <?php echo $allied_cats; ?>
    		    	            </ul>
    		    	        </div>
    		    	    </div>
    		    	</div>

    		    	<!-- Allied categories pages num -->
    		    	<div class="uk-form-row">
    		    	    <label class="uk-form-label">К-сть сторінок для відображення:</label>
    		    	    <div class="uk-form-controls" data-uk-margin>
    		    	        <?php echo form_input($form['allied_num'], $options['allied_num'] ?? '0'); ?>
    		    	    </div>
    		    	</div>
    		    </div>
    </li>
</ul>