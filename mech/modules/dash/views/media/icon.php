<div class="mech-placeholder">
  <fieldset data-field>
        <a class="uk-button uk-button-large mech-icon-button" href="#iconSelect" data-icon-change>
          <?php echo (isset($icon) && !empty($icon))
            ? '<i class="uk-icon-large uk-icon-'. $icon .'"></i>'
            : '<i class="uk-icon-plus"></i>';
          ?>
        </a>
        <i class="<?php echo (empty($icon)) ? 'hidden' : ''; ?> uk-icon-hover uk-icon-small uk-icon-trash" data-icon-del></i>
        <input type="hidden" name="<?php echo $icon_cell ?>" value="<?php echo $icon ?? ''; ?>" data-name="icon">
  </fieldset>
</div>