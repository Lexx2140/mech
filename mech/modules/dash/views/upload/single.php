<?php
  $new = (isset($file_preview)) ? 'hidden ' : '';
  $old = (isset($file_preview)) ? '' : 'hidden ';
?>

<!-- Loader Placeholder -->
<div id="mechUpLoader" class="mech-placeholder">

  <!-- File upload -->
  <div class="<?php echo $new; ?>uk-form-file" id="fUpload">
      <button class="uk-button uk-button-large uk-button-success">
          <i class="uk-icon-plus"></i>
      </button>
      <input type="file" name="userfile" accept="<?php echo $accept ?? '*'; ?>">
  </div>

  <!-- File info / remove -->
  <div id="fInfo" class="<?php echo $old; ?>uk-container-center uk-button-group uk-margin-bottom">
    <button class="uk-button uk-button-success" disabled>
      <span id="fName" class="uk-text-bold"><?php echo $file_name ?? ''; ?></span>
      (<span id="fSize"><?php echo $file_size ?? ''; ?></span> Mb)
    </button>

    <!-- File remove -->
    <button type="button" id="fRemove" class="uk-button uk-button-danger">
      <i class="uk-icon-small uk-icon-trash"></i>
    </button>
    <!-- Hidden input activated by js -->
    <input id="fDel" type="hidden" name="file_del" value="1" disabled>
  </div>

  <!-- File preview -->
  <div id="fPreview" class="<?php echo $old; ?>uk-container-center">
      <?php echo $file_preview ?? ''; ?>
  </div>
</div>
