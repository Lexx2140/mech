<header>
    <div class="el-top uk-hidden-small">
        <!-- Logo -->
        <div class="uk-grid">
            <div class="uk-width-medium-1-4 uk-flex uk-flex-middle">
                <div class="logo-header">
                    <?php echo $this->app['logo']; ?>
                </div>
            </div>
            <div class="uk-width-medium-3-4">
                <!-- Top menu -->
                <?php echo Modules::run('menu/show_menu', 'header'); ?>
            </div>
        </div>
    </div>
</header>

