<div class="uk-form-row" data-libname="<?php echo $widget_name; ?>">
    <label class="uk-form-label"><?php echo $label; ?></label>
    <div class="uk-form-controls" data-uk-margin>
        <?php echo form_dropdown('options[widget]['.$widget_name.'][id]', $widgets, $lib_id, 'class="uk-width-large-1-2" data-select-lib'); ?>
        	<?php $id = (isset($id)) ? $id : null; ?>
        &ensp;<i class="uk-icon-small uk-icon-hover uk-icon-list" data-lib-list="<?php echo $id; ?>" data-uk-tooltip title="Редагувати список елементів"></i>
        <input type="hidden" name="options[widget][<?php echo $widget_name; ?>][items]" value='<?php echo $items; ?>'>
    </div>
</div>
