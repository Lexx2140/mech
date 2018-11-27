<div id="actionPanel" class="uk-navbar uk-navbar-attached uk-margin-bottom" data-type="user" data-uk-sticky>

  <!-- Module -->
  <ul class="uk-navbar-nav uk-text-uppercase">
    <li class="uk-active">
        <a href="<?php echo $mod['index']; ?>">
            <i class="uk-icon-small <?php echo $mod['icon']; ?>"></i>&ensp;<?php echo $mod['title']; ?>
        </a>
    </li>
  	<!-- Group -->
    <li>
        <a href="<?php echo $mod['index'] .'users/'. $parent['id']; ?>" >
            <?php echo $parent['title']; ?>
        </a>
    </li>
    <li>
        <a href="<?php echo $mod['index'] . 'edit/group/' . $parent['id']; ?>" >
            <i class="uk-icon-small uk-icon-edit"></i>
        </a>
    </li>
  </ul>

  <!-- Add/Delete -->
  <div class="uk-navbar-content uk-navbar-flip">
      <button class="uk-button uk-button-danger hidden" data-del>
        <i class="uk-icon-small uk-icon-trash"></i>
      </button>
      <button class="uk-button uk-button-success" data-create>
        <i class="uk-icon-small uk-icon-plus"></i>
      </button>
  </div>

</div>

<!-- List -->
<div id="elList" class="mech-box">
  <?php echo $list; ?>
</div>