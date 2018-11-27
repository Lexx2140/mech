<div class="uk-height-viewport uk-vertical-align uk-text-center mech-dash">
    <div class="uk-container uk-vertical-align-middle">
        <?php echo form_open('user/login', 'id="loginForm" class="uk-form" data-redirect="' . $redirect . '"'); ?>
        <div class="uk-form-row" data-uk-margin>
            <label class="uk-form-label"><i class="uk-icon-justify uk-icon-medium uk-icon-user-secret"></i></label>
            <?php echo form_input('login', '', 'class="uk-form-width-medium uk-form-large" required autofocus'); ?>
        </div>
        <div class="uk-form-row" data-uk-margin>
            <label class="uk-form-label"><i class="uk-icon-justify uk-icon-medium uk-icon-unlock"></i></label>
            <?php echo form_password('pass', '', 'class="uk-form-width-medium uk-form-large" required'); ?>
        </div>
        <div class="uk-margin-large" data-uk-margin>
            <div class="uk-button-group">
                <button class="uk-button uk-button-large uk-button-success" type="submit">УВІЙТИ</button>
                <a class="uk-button uk-button-large uk-button-primary" href="<?php echo base_url(); ?>">ПЕРЕЙТИ НА САЙТ</a>
            </div>
        </div>
        <?php echo form_close(); ?>
    </div>
</div>
