<!-- Title -->
<div class="uk-form-row">
    <label class="uk-form-label">Назва групи:</label>
    <div class="uk-form-controls" data-uk-margin>
        <?php echo form_input('title', $title ?? '', 'class="uk-width-large-1-1"'); ?>
    </div>
</div>

<!-- Role -->
<div class="uk-form-row">
    <label class="uk-form-label">Права:</label>
    <div class="uk-form-controls" data-uk-margin>
        <?php echo form_dropdown('role', $form['role'], $role ?? $default['role']); ?>
    </div>
</div>

