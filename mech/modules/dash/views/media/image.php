<?php $disabled = (isset($src) ? '' : 'disabled'); ?>

<div id="mechImgEditor">

  <!-- Image/thumb switch buttons -->
  <div class="uk-button-group" data-uk-switcher="{connect:'#imgCtrl', swiping: false}">
      <button class="uk-button uk-button-primary">Зображення</button>
      <button class="uk-button uk-button-primary">Мініатюра</button>
  </div>

  <ul id="imgCtrl" class="uk-switcher uk-margin">

    <!-- Image control -->
    <li id="imgPreview">
      <!-- Size -->
      <span data-img-size="img">
        Ширина (px):
        <input type="number" min="0" name="img_w" <?php echo $disabled; ?> value="<?php echo $img_w; ?>" placeholder="auto">
        Висота (px):
        <input type="number" min="0" name="img_h" <?php echo $disabled; ?> value="<?php echo $img_h; ?>" placeholder="auto">
        <!-- Proportion lock -->
        <button type="button" class="uk-button" <?php echo $disabled; ?> data-lock="true" data-uk-tooltip title="Lock proportion">
          <i class="uk-icon-small uk-icon-lock"></i>
        </button>
      </span>

      <!-- Crop/reset -->
      <span class="uk-button-group uk-margin-left">
        <button type="button" class="uk-button" <?php echo $disabled; ?> data-img-crop="img"  data-uk-tooltip title="Crop">
          <i class="uk-icon-small uk-icon-crop"></i>
        </button>
        <button type="button" class="uk-button" <?php echo $disabled; ?> data-img-reset="img"  data-uk-tooltip title="Reset">
          <i class="uk-icon-small uk-icon-refresh"></i>
        </button>
      </span>

      <!-- Crop params -->
      <div id="imgCinput">
        <input type="hidden" name="img_cx">
        <input type="hidden" name="img_cy">
        <input type="hidden" name="img_cw">
        <input type="hidden" name="img_ch">
      </div>

      <!-- Preview -->
      <figure class="mech-img-preview uk-overlay" style="width:<?php echo $img_w; ?>px;height:<?php echo $img_h; ?>px;overflow:<?php echo $img_overflow ?? 'auto'; ?>;">
          <img id="imgC" src="<?php echo $img_src ?? $src; ?>" style="min-width:<?php echo $img_w; ?>px;min-height:<?php echo $img_h; ?>px;max-width:<?php echo $max_img_w; ?>px;max-height:<?php echo $max_img_h?>px;left:<?php echo $img_left ?>px;top:<?php echo $img_top; ?>px;">
      </figure>
    </li>

    <!-- Thumbnail control -->
    <li id="thumbPreview">
      <!-- Size -->
      <span data-img-size="thumb">
        Ширина (px):
        <input type="number" min="0" name="thumb_w" <?php echo $disabled; ?> value="<?php echo $thumb_w; ?>" placeholder="auto">
        Висота (px):
        <input type="number" min="0" name="thumb_h" <?php echo $disabled; ?> value="<?php echo $thumb_h; ?>" placeholder="auto">
        <!-- Proportion lock -->
        <button type="button" class="uk-button" <?php echo $disabled; ?> data-lock="true" data-uk-tooltip title="Lock proportion">
          <i class="uk-icon-small uk-icon-lock"></i>
        </button>
      </span>

      <!-- Crop/reset -->
      <span class="uk-button-group uk-margin-left">
        <button type="button" class="uk-button" <?php echo $disabled; ?> data-img-crop="thumb" data-uk-tooltip title="Crop">
          <i class="uk-icon-small uk-icon-crop"></i>
        </button>
        <button type="button" class="uk-button" <?php echo $disabled; ?> data-img-reset="thumb" data-uk-tooltip title="Reset">
          <i class="uk-icon-small uk-icon-refresh"></i>
        </button>
      </span>

      <!-- Crop params -->
      <div id="thumbCinput">
        <input type="hidden" name="thumb_cx">
        <input type="hidden" name="thumb_cy">
        <input type="hidden" name="thumb_cw">
        <input type="hidden" name="thumb_ch">
      </div>

      <!-- Preview -->
      <figure class="mech-img-preview uk-overlay" style="width:<?php echo $thumb_w; ?>px;height:<?php echo $thumb_h; ?>px;overflow:<?php echo $thumb_overflow ?? 'auto'; ?>;">
          <img id="thumbC" src="<?php echo $thumb_src ?? $src; ?>" style="min-width:<?php echo $thumb_w; ?>px;min-height:<?php echo $thumb_h; ?>px;max-width:<?php echo $max_thumb_w; ?>px;max-height:<?php echo $max_thumb_h?>px;left:<?php echo $thumb_left ?>px;top:<?php echo $thumb_top; ?>px;">
      </figure>
    </li>

  </ul>
</div>

<!-- Crop Modal -->
<?php if (isset($src)) :?>
<div id="cropModal" class="uk-modal">
  <div class="uk-modal-dialog uk-modal-dialog-lightbox">
      <img id="origImg" src="<?php echo $src; ?>" width="<?php echo $width; ?>" height="<?php echo $height; ?>">
      <div class="uk-modal-caption uk-button-group">
        <button type="button" class="uk-modal-close uk-button uk-button-success" data-crop-save><i class="uk-icon-small uk-icon-save"></i></button>
        <button type="button" class="uk-modal-close uk-button uk-button-danger"><i class="uk-icon-small uk-icon-remove"></i></button>
      </div>
  </div>
</div>
<?php endif; ?>
