<?php echo form_open(base_url('feedback/submit'), 'class="el-form" data-form-submit="simple" data-bot="true"'); ?>
<div class="form-container">
<p class="el-dark-text title-artcl">Попередній запис</p>
    <input type="text" name="name" placeholder="Ім’я">
    <input type="email" name="email" placeholder="Пошта">
    <input type="tel" name="tel" placeholder="Телефон">
    <textarea name="message" placeholder="Ваше повідомлення"></textarea>
   	<button type="submit" class="el-btn el-mint-btn-two">Надіслати</button>
</div>
<?php echo form_close();?>
