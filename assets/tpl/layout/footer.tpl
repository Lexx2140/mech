<footer>
    <div class="el-footer">
        <div class="uk-grid uk-grid-width-medium-1-2 uk-width-medium-7-10 uk-flex uk-flex-middle">
            <!-- Form -->
            <div id="footerForm" data-uk-scrollspy="{cls:'uk-animation-fade', delay:400}">
                <?php echo Modules::run('feedback/view', 'footer'); ?>
            </div>
            <!-- Contacts -->
            <div class="el-contacts-container">
                <div class="el-footer-contacts el-white-text uk-hidden-small">
                    <!-- Tels -->
                    <?php if (isset($tels)) : ?>
                    <div class="uk-grid uk-margin uk-grid-collapse">
                        <div class="uk-width-1-10 uk-flex-left">
                            <i class="uk-icon-phone"></i>
                        </div>
                        <p class="uk-width-9-10">
                            <?php foreach ($tels as $tel): ?>
                            <a href="tel:+<?php echo $tel['href']; ?>">
                                <?php echo $tel['tel']; ?>
                            </a>
                            <?php endforeach; ?>
                        </p>
                    </div>
                    <?php endif; ?>
                    <!-- Emails -->
                    <?php if (isset($emails)) : ?>
                    <div class="uk-grid uk-margin uk-grid-collapse">
                        <div class="uk-width-1-10 uk-flex-left">
                            <i class="uk-icon-envelope"></i>
                        </div>
                        <p class="uk-width-9-10">
                            <?php foreach ($emails as $email): ?>
                            <?php echo safe_mailto($email, $email) . "\n";?>
                            <?php endforeach; ?>
                        </p>
                    </div>
                    <?php endif; ?>
                    <!-- Address -->
                    <?php if (isset($address)) : ?>
                    <div class="uk-grid uk-margin uk-grid-collapse">
                        <div class="uk-width-1-10 uk-flex-left">
                            <i class="uk-icon-map-marker"></i>
                        </div>
                        <p class="uk-width-9-10">
                            <?php echo $address; ?>
                        </p>
                    </div>
                    <?php endif; ?>
                    <!-- Open hours -->
                    <?php if (isset($open)) : ?>
                    <div class="uk-grid uk-margin uk-grid-collapse">
                        <div class="uk-width-1-10 uk-flex-left">
                            <i class="uk-icon-clock-o"></i>
                        </div>
                        <p class="uk-width-9-10">
                            <?php echo $open; ?>
                        </p>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    <!-- Created by-->
    <div class="createdby">
        <p class="uk-width-9-10 uk-container-center">&copy; 2018.
            <?php echo $this->config->item('sitename', 'app') ?>. Created by <a href="https://www.8hid.com.ua" target="_blank" title="Design & Production. 8HID"><img src="<?php echo base_url('assets/img/8hid.svg') ?>" alt="Design & Production. 8HID" width="40" height="20"></a>
        </p>
    </div>
</footer>