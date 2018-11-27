<?php echo form_open_multipart($save, 'class="uk-form uk-margin uk-form-horizontal" id="saveForm"'); ?>

<!-- Navigation -->
<div class="uk-navbar uk-navbar-attached uk-text-uppercase" data-uk-sticky>
    <!-- Module title-->
    <ul class="uk-navbar-nav">
        <li class="uk-active">
            <a href="">
                <i class="uk-icon-small uk-icon-wrench"></i>&ensp;Налаштування: <?php echo $title; ?>
            </a>
        </li>
    </ul>
   <!-- Submit -->
   <div class="uk-navbar-content uk-navbar-flip">
        <div class="uk-button-group">
            <button type="button" id="saveApply" data-save="apply" class="uk-button uk-button-success"><i class="uk-icon-small uk-icon-save"></i></button>
            <button type="button" id="saveExit" data-save="exit" class="uk-button uk-button-success"><i class="uk-icon-small uk-icon-check"></i></button>

            <!-- Exit -->
            <button type="button" data-goback class="uk-button uk-button-danger">
                <i class="uk-icon-small uk-icon-close"></i>
            </button>
        </div>
   </div>
</div>
<div class="mech-box">
    <?php echo $content; ?>
</div>
<?php echo form_close(); ?>