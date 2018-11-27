<!-- List menu -->
<div id="actionPanel" class="uk-navbar uk-navbar-attached uk-margin-bottom" data-type="item" data-uk-sticky>

  <!-- Module -->
  <ul class="uk-navbar-nav uk-text-uppercase">
	   <li class="uk-active">
	   		 <?php if (!$this->session->page_id): ?>
	       <a id="medialibActive" href="<?php echo $mod['index']; ?>">
	           <i class="uk-icon-small <?php echo $mod['icon']; ?>"></i>&ensp;<?php echo $mod['title']; ?>
	       </a>
   			<?php endif ?>
	   </li>
  </ul>

  <!-- Medialib -->
  <div class="uk-navbar-content">
    <span class="uk-text-uppercase"><?php echo $lib['name']; ?></span>
    <button type="button" class="uk-button mech-icon-button uk-margin-small-left" data-setup="<?php echo $mod['index'] . 'edit/medialib/' . $lib['id']; ?>">
      <i class="uk-icon-small uk-icon-edit"></i>
    </button>
  </div>

  <!-- Add/Delete -->
  <div class="uk-navbar-content uk-navbar-flip">
  		<div class="uk-button-group">
  	      <button class="uk-button uk-button-danger hidden" data-del>
          <i class="uk-icon-small uk-icon-trash"></i>
        </button>
        <button class="uk-button uk-button-success" data-create="<?php echo $lib['id']; ?>">
          <i class="uk-icon-small uk-icon-plus"></i>
        </button>
  		</div>
  </div>
</div>

<!-- Items list -->
<div id="elList" class="mech-box">
  <?php echo $list; ?>
</div>