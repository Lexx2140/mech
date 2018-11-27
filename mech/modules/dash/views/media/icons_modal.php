<!-- Icon select modal -->
<div id="iconSelect" class="uk-modal">
    <div class="uk-modal-dialog uk-modal-dialog-large">
    			<nav class="uk-navbar uk-margin-bottom">
    			    <div class="uk-navbar-content uk-hidden-small">
    			        <div class="uk-margin-remove uk-display-inline-block">
    			        		<div class="uk-form-icon">
    			        		    <i class="uk-icon-search"></i>
    			        		    <input id="icoSearch" type="text">
    			        		</div>
    			        </div>
    			    </div>
    			    <div class="uk-navbar-content uk-navbar-flip">
    			    	<a class="uk-modal-close uk-close"></a>
    			    </div>
    			</nav>
        <div class="uk-panel uk-overflow-container uk-text-center">
          <div class="uk-grid uk-grid-small uk-grid-width-large-1-10" data-uk-margin data-uk-grid-match="{row: false}">
            <?php foreach ($icons as $key => $val) : ?>
                <a class="icon-thumb" href="" data-icon-name="<?php echo $val; ?>">
                  <i class="uk-icon-small uk-icon-<?php echo $val; ?>"></i>
                  <div class="uk-thumbnail-caption"><?php echo $val; ?></div>
                </a>
            <?php endforeach; ?>
          </div>
        </div>
    </div>
</div>