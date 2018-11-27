<div class="offline uk-height-viewport uk-flex uk-flex-middle uk-flex-center">
    <div class="uk-container" data-uk-scrollspy="{cls:'uk-animation-fade', repeat: true}">
        <div class="offspinner">
        	<i class="uk-icon-gear uk-icon-spin"></i>
        </div>
        <div class="uk-margin uk-contrast">
          	<?php echo $this->config->item('off_air_msg', 'app'); ?>
        </div>
        <div class="uk-position-bottom uk-accordion uk-text-center" data-uk-accordion="{showfirst: false}">
            <h3 class="uk-accordion-title uk-button uk-width-large-1-5">
                ТЕСТОВА ВЕРСІЯ
            </h3>
            <div class="uk-accordion-content uk-margin-top uk-margin-bottom">
                <?php echo form_open('user/login', 'id="loginForm" class="uk-form" data-redirect="'.base_url().'"'); ?>
                <div class="uk-form-row" data-uk-margin>
            				<div class="uk-form-icon">
            				    <i class="uk-icon-user-secret"></i>
		                    <?php echo form_input('login', '', 'class="uk-form-width-medium uk-form-large"', 'required'); ?>
            				</div>
                </div>
                <div class="uk-form-row uk-margin-bottom" data-uk-margin>
                		<div class="uk-form-icon">
                		    <i class="uk-icon-unlock"></i>
                 			  <?php echo form_password('pass', '', 'class="uk-form-width-medium uk-form-large"', 'required'); ?>
                		</div>
                </div>
                <button class="uk-button uk-button-large uk-button-success" type="submit">
                    УВІЙТИ
                </button>
                <?php echo form_close(); ?>
            </div>
        </div>
    </div>
</div>

<script>
	var home = "<?php echo base_url(); ?>";

	if (window.location.href !== home) {
			window.location.replace(home);
	}
</script>
