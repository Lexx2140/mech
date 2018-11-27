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
	              ? $parent['title']
	              : $parent['title'][$this->app['def_lang']['slug']];
              ?>
            </a>
        </li>
        <?php endif; ?>
    </ul>

    <!-- Submit -->
    <div class="uk-navbar-content uk-navbar-flip">
        <button type="button" class="uk-button uk-button-danger" data-goback>
        	<i class="uk-icon-small uk-icon-reply"></i>
        </button>
    </div>
</div>

<!-- Content view -->
<div class="mech-box">
    <?php echo $view; ?>
</div>
