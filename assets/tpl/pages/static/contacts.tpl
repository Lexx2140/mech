<div class="uk-margin-large-top uk-hidden-small"></div>
<div class="el-contacts">

    <?php if (!empty($this->app['gmap'])) : ?>
    <!-- Якщо є карта - показувати ЦЕ: -->
    <div class="el-footer-map">
        <?php echo $this->app['gmap']; ?>
    </div>
        <div class="el-contacts-bg uk-width-medium-1-3">
            <div class="contacts">
                <!-- Tels -->
                <?php if (isset($this->app['tels'])) : ?>
                <div class="uk-grid uk-margin uk-grid-collapse">
                    <div class="uk-width-1-5 uk-flex-middle uk-flex-center uk-text-center">
                        <i class="uk-icon-phone"></i>
                    </div>
                    <p class="uk-width-4-5">
                        <?php foreach ($this->app['tels'] as $tel): ?>
                        <a href="tel:+<?php echo $tel['href']; ?>">
                            <?php echo $tel['tel']; ?>
                        </a>
                        <br>
                        <?php endforeach; ?>
                    </p>
                </div>
                <?php endif; ?>
                <!-- Emails -->
                <?php if (isset($this->app['emails'])) : ?>
                <div class="uk-grid uk-margin uk-grid-collapse">
                    <div class="uk-width-1-5 uk-flex-middle uk-flex-center uk-text-center">
                        <i class="uk-icon-envelope"></i>
                    </div>
                    <p class="uk-width-4-5">
                        <?php foreach ($this->app['emails'] as $email): ?>
                        <?php echo safe_mailto($email, $email) . "\n";?>
                        <?php endforeach; ?>
                    </p>
                </div>
                <?php endif; ?>
                <!-- Address -->
                <?php if (isset($this->app['address'])) : ?>
                <div class="uk-grid uk-margin uk-grid-collapse">
                    <div class="uk-width-1-5 uk-flex-middle uk-flex-center uk-text-center">
                        <i class="uk-icon-map-marker"></i>
                    </div>
                    <p class="uk-width-4-5 el-white-text">
                        <?php echo $this->app['address']; ?>
                    </p>
                </div>
                <?php endif; ?>
                <!-- Open hours -->
                <?php if (isset($this->app['open'])) : ?>
                <div class="uk-grid uk-margin uk-grid-collapse">
                    <div class="uk-width-1-5 uk-flex-middle uk-flex-center uk-text-center">
                        <i class="uk-icon-clock-o"></i>
                    </div>
                    <p class="uk-width-4-5 el-white-text">
                        <?php echo $this->app['open']; ?>
                    </p>
                </div>
                <?php endif; ?>

								<!-- Social -->
								<?php if (isset($this->app['social'][0]) && !empty($this->app['social'][0]['href'])) : ?>
                <div class="el-social">
                    <p class="el-white-text">Ми у соціальних мережах:
                    </p>
                    	<?php foreach ($this->app['social'] as $soc): ?>

                        <a class="el-social-icon" href="<?php echo $soc['href']; ?>" target="_blank" title="<?php echo $soc['title']; ?>"><i class="uk-icon-<?php echo $soc['icon']; ?>"></i></a>

                      <?php endforeach; ?>
                </div>
              <?php endif; ?>

            </div>
-        </div>
    <?php endif; ?>
</div>
