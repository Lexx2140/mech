<?php echo form_open_multipart($save, 'class="uk-form uk-margin uk-form-horizontal" id="saveForm"'); ?>

<!-- Navigation -->
<div class="uk-navbar uk-navbar-attached uk-text-uppercase" data-uk-sticky>
    <ul class="uk-navbar-nav uk-text-uppercase">
        <!-- Module -->
        <li class="uk-active">
            <a href="" onclick="return false;">
							<i class="uk-icon-small <?php echo $mod['icon']; ?>"></i>&ensp;<?php echo $mod['title']; ?>
						</a>
        </li>
        <!-- Parent -->
        <?php if (isset($parent)) : ?>
        <li>
            <a href="" onclick="return false;">
              <?php echo (!is_array($parent['title']))
              ? $parent['title'] : $parent['title'][$this->app['def_lang']['slug']];
              ?>
            </a>
        </li>
        <?php endif; ?>
    </ul>
    <!-- Element edit name -->
    <div class="uk-navbar-content">
        <span class="uk-text-primary">
				<?php echo $this->credit; ?>
				<?php if (isset($title)) : ?>
					:<b>
					<?php echo (!is_array($title)) ? $title	: $title[$this->app['def_lang']['slug']]; ?>
					</b>
				<?php endif ?>
			</span>
    </div>

    <!-- Submit -->
    <div class="uk-navbar-content uk-navbar-flip">
        <div class="uk-button-group" data-id="<?php echo $id ?? null; ?>">

            <!-- Save & exit -->
            <button type="button" id="saveExit" data-save="exit" class="uk-button uk-button-success"><i class="uk-icon-small uk-icon-save"></i></button>

            <!-- Exit -->
            <button type="button" data-goback class="uk-button uk-button-danger"><i class="uk-icon-small uk-icon-reply"></i></button>

        </div>
    </div>
</div>

<!-- Content edit form -->
<div class="mech-box">
    <?php echo $edit; ?>
</div>
<?php echo form_close(); ?>