<div id="actionPanel" class="uk-navbar uk-navbar-attached uk-margin-bottom" data-type="comment" data-uk-sticky>

  <!-- Module -->
  <ul class="uk-navbar-nav uk-text-uppercase">
       <li class="uk-active">
        <a href="<?php echo $mod['index']; ?>">
            <i class="uk-icon-small <?php echo $mod['icon']; ?>"></i>&ensp;<?php echo $mod['title']; ?>
        </a>
    </li>
  </ul>

  <!-- Status/Delete -->
  <div class="uk-navbar-content uk-navbar-flip">
			<button class="uk-button uk-button-danger hidden" data-del="ReloadComments">
			  <i class="uk-icon-small uk-icon-trash"></i>
			</button>
  </div>

	<!-- Status change -->
  <ul class="uk-navbar-nav uk-text-uppercase hidden" data-status>
      <li class="uk-parent" data-uk-dropdown="{mode: 'click'}">
          <a href="" class="uk-button" >
	        	СТАТУС&ensp;<i class="uk-icon-small uk-icon-caret-down"></i>
        	</a>
          <div class="uk-dropdown uk-dropdown-navbar">
              <ul id="commentStates" class="uk-nav uk-nav-navbar">
                  <li><a href="" data-comment-state="1">На модерацію</a></li>
                  <li><a href="" data-comment-state="2">Схвалено</a></li>
                  <li><a href="" data-comment-state="3">В спам</a></li>
              </ul>
          </div>
      </li>
  </ul>
</div>

<!-- List -->
<!-- <div class="mech-box"> -->
<div id="elList" class="mech-box">
  <?php echo $list; ?>
</div>