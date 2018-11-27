<!-- MechaniCMS Dashboard -->
<div id="mechDash" class="uk-grid uk-grid-collapse mech-dash">

    <!-- Sidebar panel -->
    <div id="mechSidebar" class="mech-sidebar uk-width-medium-1-6">
			<!-- Menu -->
			<div data-uk-sticky>
      	<?php echo $sidebar; ?>
      </div>
      <div class="mech-info">
      		<details>
      		  <summary>&copy;&ensp;2016 - <?php echo date('Y'); ?> | MechaniCMS <i class="uk-icon-info-circle"></i></summary>
      		  <p>Codeigniter <?php echo CI_VERSION; ?> <br> Loaded: {elapsed_time} s | {memory_usage} RAM <br><span id="jq"></span></p>
      		</details>
      </div>
    </div>

    <!-- Dashboard panel -->
    <div id="mechContent" class="mech-content uk-width-medium-5-6">
        <?php echo $dash_content; ?>
    </div>

</div>