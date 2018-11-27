<div id="actionPanel" class="uk-navbar uk-navbar-attached uk-margin-bottom" data-type="page" data-uk-sticky>
  <ul class="uk-navbar-nav uk-text-uppercase">
	  <li class="uk-active">
	      <a href="<?php echo $mod['index']; ?>">
	          <i class="uk-icon-small <?php echo $mod['icon']; ?>"></i>&ensp;<?php echo $mod['title']; ?>
	      </a>
	  </li>
	  <li>
	  		<a href=""><i class="uk-icon-clone">&ensp;</i>Сторінки</a>
	  </li>
  </ul>

  <!-- Category -->
  <div class="uk-navbar-content">
    <span class="uk-text-uppercase">
      <?php echo $parent['title'][$this->app['def_lang']['slug']] ?? $parent['title']; ?>
    </span>
    <?php if ($parent['id']) : ?>
    <button type="button" class="uk-button mech-icon-button uk-margin-small-left" data-setup="<?php echo $mod['index'] . 'edit/category/' . $parent['id']; ?>">
      <i class="uk-icon-small uk-icon-edit"></i>
    </button>
    <?php endif; ?>
  </div>

  <!-- Add/Delete element(s) -->
  <div class="uk-navbar-content uk-navbar-flip">
			<div class="uk-button-group">
		      <button class="uk-button uk-button-danger hidden" data-del>
	        <i class="uk-icon-small uk-icon-trash"></i>
	      </button>
	      <button class="uk-button uk-button-success" data-create="<?php echo $parent['id']; ?>">
	        <i class="uk-icon-small uk-icon-plus"></i>
	      </button>
			</div>
  </div>
</div>

<div class="mech-box">

	<!-- List -->
	<div id="elList" class="uk-grid uk-grid-small uk-margin">
		<!-- Categories list -->
		<div class="uk-width-medium-1-5">
		  <div class="uk-overflow-container">
		    <table id="catList" class="mech-cat-table uk-table uk-table-hover">
		      <?php echo $cats; ?>
		    </table>
		  </div>
		</div>

		<!-- Pages list -->
		<div class="uk-width-medium-4-5">
		  	<?php echo $list; ?>
		</div>
	</div>
</div>