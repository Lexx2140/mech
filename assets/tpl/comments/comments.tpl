<div id="commentsList" class="el-comments def-comments">
  <hr>
	<?php if (!empty($comments)) { ?>
		<ul>
			<?php echo $comments; ?>
		</ul>
	<?php } else { ?>
		<p><?php echo lang('comments_empty'); ?></p>
	<?php } ?>
	<div id="commentDIV" data-comment-page="<?php echo $page_id; ?>">
		<div class="uk-margin uk-text-right">
			<button id="addComment" class="el-btn el-mint-btn-two"><?php echo lang('comments_new'); ?></button>
		</div>
	</div>
</div>