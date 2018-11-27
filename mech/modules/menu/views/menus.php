<!-- List menu -->
<div id="actionPanel" class="uk-navbar uk-navbar-attached uk-margin-bottom" data-type="menu" data-uk-sticky>

	<!-- Module -->
	<ul class="uk-navbar-nav uk-text-uppercase">
		<li class="uk-active">
			<a href="">
				<i class="uk-icon-small <?php echo $mod['icon']; ?>"></i>&ensp;<?php echo $mod['title']; ?>
			</a>
		</li>
	</ul>

	<!-- Add/Delete -->
	<div class="uk-navbar-content uk-navbar-flip">
			<div class="uk-button-group">
				<button class="uk-button uk-button-danger hidden" data-del>
					<i class="uk-icon-small uk-icon-trash"></i>
				</button>
				<button class="uk-button uk-button-success" data-create>
					<i class="uk-icon-small uk-icon-plus"></i>
				</button>
			</div>
	</div>
</div>

<!-- Parents list -->
<div id="elList" class="mech-box">
	<?php echo $list; ?>
</div>