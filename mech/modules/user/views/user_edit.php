<!-- Title -->
<div class="uk-form-row">
	<label class="uk-form-label">Ім'я:</label>
	<div class="uk-form-controls" data-uk-margin>
		<?php echo form_input('fullname', $fullname ?? '', 'class="uk-width-1-1"'); ?>
	</div>
</div>

<!-- Email -->
<div class="uk-form-row">
	<label class="uk-form-label">Логін:</label>
	<div class="uk-form-controls" data-uk-margin>
		<?php echo form_input('login', $login ?? '', 'class="uk-width-1-1"'); ?>
	</div>
</div>

<!-- Email -->
<div class="uk-form-row">
	<label class="uk-form-label">Email:</label>
	<div class="uk-form-controls" data-uk-margin>
		<?php echo form_input(['name' => 'email', 'type' => 'email'], $email ?? '', 'class="uk-width-1-1"'); ?>
	</div>
</div>

<!-- Tel -->
<div class="uk-form-row">
	<label class="uk-form-label">Телефон:</label>
	<div class="uk-form-controls" data-uk-margin>
		<?php echo form_input(['name' => 'tel', 'type' => 'tel'], $tel ?? '', 'class="uk-width-1-1"'); ?>
	</div>
</div>

<!-- Password -->
<div class="uk-form-row">
	<label class="uk-form-label">Пароль:</label>
	<div class="uk-form-controls" data-uk-margin>
		<div class="uk-grid uk-grid-small" data-uk-margin>
			<div class="uk-form-password uk-width-large-1-2">
					<?php echo form_input($form['pass'], ''); ?>
			    <a href="" class="uk-form-password-toggle" data-uk-form-password="{lblShow:'Показати', lblHide:'Сховати'}">Показати</a>
			</div>
			<div class="uk-width-large-1-2">
					<button id="passGen" type="button" class="uk-button">Згенерувати пароль</button>
					<span id="passGenShow"></span>
			</div>
		</div>
	</div>
</div>

<!-- Password check -->
<div class="uk-form-row">
	<label class="uk-form-label">Повтор паролю:</label>
	<div class="uk-form-controls" data-uk-margin>
		<div class="uk-form-password uk-width-1-2">
				<?php echo form_input($form['pass_check'], ''); ?>
		    <a href="" class="uk-form-password-toggle" data-uk-form-password="{lblShow:'Показати', lblHide:'Сховати'}">Показати</a>
    </div>
	</div>
</div>
