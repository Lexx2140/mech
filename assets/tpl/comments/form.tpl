<?php echo form_open(base_url('comments/send'), 'class="uk-form uk-form-stacked uk-margin-top" id="commentForm" data-form-submit="comment"'); ?>
     <div class="el-comment-form">
      <div class="uk-form-row">
          <label class="el-comment-label"><?php echo lang('form_name'); ?></label>
          <div class="uk-form-controls">
              <input type="text" name="user_name" class="uk-width-medium-1-2" autofocus>
          </div>
      </div>
			<div class="uk-form-row">
			    <label class="el-comment-label"><?php echo lang('form_email'); ?></label>
			    <div class="uk-form-controls">
			        <input type="email" name="user_email" class="uk-width-medium-1-2">
			    </div>
			</div>
      <div class="uk-form-row">
          <label class="el-comment-label"><?php echo lang('form_comment'); ?></label>
          <div class="uk-form-controls">
              <textarea class="uk-width-medium-1-2" rows="5" name="msg" maxlength="500"></textarea>
          </div>
      </div>
      <input type="hidden" name="bcheck" value="true">
      <div class="uk-margin">
      	<button type="submit" class="el-btn el-mint-btn uk-margin-small-right"><?php echo lang('form_send'); ?></button>
      	<button type="reset" class="el-btn el-transparent-btn"><?php echo lang('form_cancel'); ?></button>
      </div>
     </div>
<?php echo form_close(); ?>
