<ul class="uk-tab" data-uk-tab="{connect:'#appSetup', swiping: false}">
    <li><a href=""><i class="uk-icon-small uk-icon-gears"></i> Загальні</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-envelope"></i> Контакти</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-object-group"></i> Шаблон</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-code"></i> Скрипти</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-sliders"></i> Система</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-search"></i> SEO</a></li>
    <li><a href=""><i class="uk-icon-small uk-icon-money"></i> Комерція</a></li>
</ul>

<ul id="appSetup" class="uk-switcher uk-margin">

    <!-- MAIN SITE OPTIONS -->
    <li>
        <!-- Multilanguage switcher -->
        <?php echo $this->lang_lib->lang_switcher('#mainTr'); ?>

        <ul id="mainTr" class="uk-switcher uk-margin">
        <?php foreach ($this->langs as $lang) : ?>
          <li>
            <!-- Site title -->
            <div class="uk-form-row">
                <label class="uk-form-label">Заголовок сайту:</label>
                <div class="uk-form-controls" data-uk-margin>
                    <?php echo form_input('sitename['.$lang["slug"].']', $sitename[$lang["slug"]] ?? '', 'class="uk-width-1-1"'); ?>
                </div>
            </div>

            <!-- Title suffix -->
            <div class="uk-form-row">
                <label class="uk-form-label">Суффікс заголовку:</label>
                <div class="uk-form-controls" data-uk-margin>
                    <?php echo form_input('suff['.$lang["slug"].']', $suff[$lang["slug"]] ?? '', 'class="uk-width-1-1"'); ?>
                </div>
            </div>

            <!-- Slogan -->
            <div class="uk-form-row">
                <label class="uk-form-label">Гасло:</label>
                <div class="uk-form-controls" data-uk-margin>
                    <?php echo form_input('slogan['.$lang["slug"].']', $slogan[$lang["slug"]] ?? '', 'class="uk-width-1-1"'); ?>
                </div>
            </div>
          </li>
        <?php endforeach; ?>
        </ul>

        <!-- Homepage -->
        <div class="uk-form-row">
            <label class="uk-form-label">Головна сторінка:</label>
            <div class="uk-form-controls" data-uk-margin>
                <select name="homepage">
                    <?php echo $homepage_select; ?>
                </select>
            </div>
        </div>

        <!-- Logo -->
        <div class="uk-form-row">
            <!-- Logo options -->
            <input type="hidden" id="mediaOptions" value='<?php echo $logo_options ?? null ?>'>
            <label class="uk-form-label">Логотип:</label>
            <div class="uk-form-controls" data-uk-margin>
                <?php echo $logo_edit?>
            </div>
        </div>
    </li>

    <!-- CONTACTS -->
    <li>
        <!-- Multilanguage switcher -->
        <?php echo $this->lang_lib->lang_switcher('#contactsTr'); ?>

        <ul id="contactsTr" class="uk-switcher uk-margin">
        <?php foreach ($this->langs as $lang) : ?>
          <li>
          <!-- Company title -->
          <div class="uk-form-row">
              <label class="uk-form-label">Назва компанії:</label>
              <div class="uk-form-controls" data-uk-margin>
                  <?php echo form_input('company['.$lang["slug"].']', $company[$lang["slug"]] ?? '', 'class="uk-width-1-1"'); ?>
              </div>
          </div>
          <!-- Address -->
          <div class="uk-form-row">
              <label class="uk-form-label">Адреса:</label>
              <div class="uk-form-controls" data-uk-margin>
                  <?php echo form_textarea('address['.$lang["slug"].']', $address[$lang["slug"]] ?? '', 'class="uk-width-1-1"'); ?>
              </div>
          </div>

          <!-- Open hours -->
          <div class="uk-form-row">
              <label class="uk-form-label">Графік роботи:</label>
              <div class="uk-form-controls" data-uk-margin>
                  <?php echo form_textarea('open['.$lang["slug"].']', $open[$lang["slug"]] ?? '', 'class="uk-width-1-1"'); ?>
              </div>
          </div>
        </li>
        <?php endforeach; ?>
        </ul>

        <!-- Google map -->
        <div class="uk-form-row">
            <label class="uk-form-label">Google map:</label>
            <div class="uk-form-controls" data-uk-margin>
                <?php echo form_input('gmap', $gmap ?? '', 'class="uk-width-1-1"'); ?>
            </div>
        </div>

        <!-- Email -->
        <div class="uk-form-row">
            <label class="uk-form-label">E-mail:</label>
            <div class="uk-form-controls" data-uk-margin>
            <?php foreach ($emails as $email) : ?>
                <fieldset data-field>
                    <div class="uk-grid uk-grid-small uk-margin-small-bottom">
                        <div class="uk-width-large-9-10">
                        		<input type="email" name="emails[]" value="<?php echo $email ?? '' ?>" class="uk-width-1-1">
                        </div>
                        <div class="uk-width-large-1-10 uk-flex uk-flex-middle">
                            <div>
                              <i class="uk-icon-hover uk-icon-plus" data-field-copy></i>
                              <i class="uk-icon-hover uk-icon-minus" data-field-del></i>
                            </div>
                        </div>
                    </div>
                </fieldset>
            <?php endforeach; ?>
          </div>
        </div>

        <!-- Callback email -->
        <div class="uk-form-row">
            <label class="uk-form-label">E-mail для зворотнього зв’язку:</label>
            <div class="uk-form-controls" data-uk-margin>
            		<input type="email" name="callback_email" value="<?php echo $callback_email ?? '' ?>" class="uk-width-9-10">
            </div>
        </div>

        <!-- Tels -->
        <div class="uk-form-row">
            <label class="uk-form-label">Телефони:</label>
            <div class="uk-form-controls" data-uk-margin>
            <?php foreach ($tels as $tel) : ?>
                <fieldset data-field>
                    <div class="uk-grid uk-grid-small uk-margin-small-bottom">
                        <div class="uk-width-large-9-10">
                        		<input type="tel" name="tels[]" value="<?php echo $tel['tel'] ?? '' ?>" class="uk-width-large-1-1">
                        </div>
                        <div class="uk-width-large-1-10 uk-flex uk-flex-middle">
                            <div>
                              <i class="uk-icon-hover uk-icon-plus" data-field-copy></i>
                              <i class="uk-icon-hover uk-icon-minus" data-field-del></i>
                            </div>
                        </div>
                    </div>
                </fieldset>
            <?php endforeach; ?>
            </div>
        </div>

        <!-- Social network -->
        <div class="uk-form-row">
            <label class="uk-form-label">Соціальні мережі:</label>
            <div class="uk-form-controls" data-uk-margin>
                <?php foreach ($social as $soc) : ?>
                 <fieldset data-field data-compile>
                  <div class="uk-grid uk-grid-small uk-margin-small-bottom">
                      <div class="uk-width-large-9-10">
                        <div class="uk-grid uk-grid-small" data-uk-margin>
                          <div class="uk-width-large-1-5">
                            <?php echo $this->media_lib->icon_edit('icon', $soc['icon']); ?>
                          </div>

                          <!-- Title & Href -->
                          <div class="uk-width-large-4-5">
                             <input type="text" class="uk-width-1-1 uk-margin-small-bottom" placeholder="Назва" data-name="title" value="<?php echo (isset($soc['title'])) ? $soc['title'] : ''; ?>">
                            <textarea class="uk-width-1-1" placeholder="Посилання" data-name="href"><?php echo (isset($soc['href'])) ? $soc['href'] : ''; ?></textarea>
                          </div>
                        </div>

                        <!-- Compiled input -->
                        <input type="hidden" name="social[]" value='<?php echo (!empty($soc)) ? json_encode($soc) : ''; ?>' data-compiled-input>
                      </div>

                      <div class="uk-width-large-1-10 uk-flex uk-flex-middle">
                          <div>
                            <i class="uk-icon-hover uk-icon-plus" data-field-copy></i>
                            <i class="uk-icon-hover uk-icon-minus" data-field-del></i>
                          </div>
                      </div>
                  </div>
                </fieldset>
                <?php endforeach; ?>
            </div>
        </div>
    </li>

    <!-- TEMPLATE -->
    <li>
        <div class="uk-form-row">
            <span class="uk-form-label">Хедер:</span>
            <div class="uk-form-controls" data-uk-margin>
            		<i class="tf-toggle-icon"></i>
            		<input type="hidden" name="header" value="<?php echo $header ?? 0 ;?>">
            </div>
        </div>

        <div class="uk-form-row">
            <span class="uk-form-label">Футер:</span>
            <div class="uk-form-controls" data-uk-margin>
            		<i class="tf-toggle-icon"></i>
            		<input type="hidden" name="footer" value="<?php echo $footer ?? 0 ;?>">
            </div>
        </div>

        <div class="uk-form-row">
            <span class="uk-form-label">Кнопка "Нагору":</span>
            <div class="uk-form-controls" data-uk-margin>
            		<i class="tf-toggle-icon"></i>
            		<input type="hidden" name="gotop" value="<?php echo $gotop ?? 0 ;?>">
            </div>
        </div>

        <div class="uk-form-row">
            <span class="uk-form-label">Preloader:</span>
            <div class="uk-form-controls" data-uk-margin>
            		<i class="tf-toggle-icon"></i>
            		<input type="hidden" name="preloader" value="<?php echo $preloader ?? 0 ;?>">
            </div>
        </div>
    </li>

    <!-- SCRIPTS -->
    <li>
        <!-- Head JS -->
        <div class="uk-form-row">
            <label class="uk-form-label">Перед тегом <code>&lt;/head&gt;</code></label>
            <div class="uk-form-controls" data-uk-margin>
                <?php echo form_textarea('head_js', $head_js ?? '', 'class="uk-width-1-1"'); ?>
            </div>
        </div>
        <!-- Footer JS -->
        <div class="uk-form-row">
            <label class="uk-form-label">Перед тегом <code>&lt;/body&gt;</code></label>
            <div class="uk-form-controls" data-uk-margin>
                <?php echo form_textarea('body_js', $body_js ?? '', 'class="uk-width-1-1"'); ?>
            </div>
        </div>
        <!-- jQuery (CDN)-->
        <div class="uk-form-row">
            <label class="uk-form-label">jQuery (CDN)</label>
            <div class="uk-form-controls" data-uk-margin>
                <?php echo form_input('jquery', $jquery ?? '', 'class="uk-width-1-1"'); ?>
            </div>
        </div>
        <!-- Fonts preloader -->
        <div class="uk-form-row">
            <label class="uk-form-label">Fonts Preloader:</label>
            <div class="uk-form-controls" data-uk-margin>
            		<i class="tf-toggle-icon"></i>
            		<input type="hidden" name="fonts_js" value="<?php echo $fonts_js ?? 0 ;?>">
            </div>
        </div>
    </li>

    <!-- SYSTEM -->
    <li>
        <!-- Site on air -->
        <div class="uk-form-row">
            <label class="uk-form-label">Сайт вимкнено:</label>
            <div class="uk-form-controls" data-uk-margin>
            		<i class="tf-toggle-icon" data-fieldset="#siteOff"></i>
            		<input type="hidden" name="off_air" value="<?php echo $off_air ?? 0 ;?>">
            </div>
        </div>
        <fieldset id="siteOff" class="uk-margin-top">
            <div class="uk-form-row">
                <label class="uk-form-label">Повідомлення при вимкнутому сайті:</label>
                <div class="uk-form-controls" data-uk-margin>
                    <?php echo form_textarea('off_air_msg', $off_air_msg ?? '', 'class="uk-width-1-1"'); ?>
                </div>
            </div>
        </fieldset>

        <hr>
				<div class="uk-form-row">
				    <label class="uk-form-label">Кешування:</label>
				    <div class="uk-form-controls" data-uk-margin>
				    		<i class="tf-toggle-icon" data-fieldset="#cacheCtrl"></i>
				    		<input type="hidden" name="cache" value="<?php echo $cache ?? 0 ;?>">
				    </div>
				</div>

        <fieldset id="cacheCtrl" class="uk-margin-top">
            <div class="uk-form-row">
                <label class="uk-form-label">Тривалість (хв):</label>
                <div class="uk-form-controls" data-uk-margin>
                  <?php echo form_input(['type' => 'number', 'name' => 'cache_time'], $cache_time ?? ''); ?>
                </div>
            </div>
        </fieldset>
        <hr>

        <!-- HTML Compress -->
        <div class="uk-form-row">
            <label class="uk-form-label">Стискати HTML:</label>
            <div class="uk-form-controls" data-uk-margin>
            		<i class="tf-toggle-icon"></i>
            		<input type="hidden" name="html_compress" value="<?php echo $html_compress ?? 0 ;?>">
            </div>
        </div>
    </li>

    <!-- SEO -->
    <li>
    		<div class="uk-form-row">
    		    <label class="uk-form-label">Revisit 1 day:</label>
    		    <div class="uk-form-controls" data-uk-margin>
    		    	<i class="tf-toggle-icon"></i>
    		    	<input type="hidden" name="m_rev" value="<?php echo $m_rev ?? 0 ;?>">
    		    </div>
    		</div>

    		<div class="uk-form-row">
    		    <label class="uk-form-label">Global:</label>
    		    <div class="uk-form-controls" data-uk-margin>
    		    		<i class="tf-toggle-icon"></i>
    		    		<input type="hidden" name="m_glob" value="<?php echo $m_glob ?? 0 ;?>">
    		    </div>
    		</div>
    </li>

    <!-- ECOMMERCE -->
    <li>
				<div class="uk-form-row">
				    <label class="uk-form-label">Валютні операції:</label>
				    <div class="uk-form-controls" data-uk-margin>
				    		<i class="tf-toggle-icon" data-fieldset="#ecommOpts"></i>
				    		<input type="hidden" name="ecomm" value="<?php echo $ecomm ?? 0 ;?>">
				    </div>
				</div>

				<fieldset id="ecommOpts" class="uk-margin-top">
	    		<div class="uk-form-row">
	    		    <label class="uk-form-label">Вихідна валюта:</label>
	    		    <div class="uk-form-controls" data-uk-margin>
			            <?php echo form_dropdown('curr', $currencies, $curr ?? ''); ?>
	    		    </div>
	    		</div>

	    		<div class="uk-form-row">
	    		    <label class="uk-form-label">Основна валюта:</label>
	    		    <div class="uk-form-controls" data-uk-margin>
			            <?php echo form_dropdown('base_curr', $currencies, $base_curr ?? ''); ?>
	    		    </div>
	    		</div>

	    		<div class="uk-form-row">
	    		    <label class="uk-form-label">Власний курс:</label>
	    		    <div class="uk-form-controls" data-uk-margin>
	    		    		<input type="number" name="curr_kurs" value="<?php echo $curr_kurs ?? ''; ?>">
	    		    </div>
	    		</div>
    		</fieldset>

    </li>
</ul>
