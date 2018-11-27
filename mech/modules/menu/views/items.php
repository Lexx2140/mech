<!-- List menu -->
<div id="actionPanel" class="uk-navbar uk-navbar-attached uk-margin-bottom" data-type="item" data-uk-sticky>

  <!-- Module -->
  <ul class="uk-navbar-nav uk-text-uppercase">
    <li class="uk-active">
        <a href="<?php echo $mod['index']; ?>">
            <i class="uk-icon-small <?php echo $mod['icon']; ?>"></i>&ensp;<?php echo $mod['title']; ?>
        </a>
    </li>

  	<!-- Parent menu -->
    <li>
        <a href="<?php echo $mod['index'] .'items/'. $parent['id']; ?>" >
            <?php echo $parent['title']; ?>
        </a>
    </li>
    <li>
        <a href="<?php echo $mod['index'] . 'edit/menu/' . $parent['id']; ?>" >
            <i class="uk-icon-small uk-icon-edit"></i>
        </a>
    </li>
  </ul>

  <!-- Add/Delete -->
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

<!-- List -->
<div class="mech-box">
	<div id="elList" class="uk-grid uk-grid-small">

		<!-- Categories list -->
		<div class="uk-width-medium-1-5">
		  <div class="uk-overflow-container">
		    <table id="catList" class="mech-cat-table uk-table uk-table-hover">
		      <?php echo $cats; ?>
		    </table>
		  </div>
		</div>

		<!-- Items & subcategories list -->
		<div class="uk-width-medium-4-5">
		  	<?php echo $list; ?>
		</div>
	</div>
</div>
