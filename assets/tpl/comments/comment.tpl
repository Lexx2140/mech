<div itemscope itemtype="http://schema.org/UserComments" class="el-comment">
	<div class="uk-grid" data-uk-grid-margin>
		<div class="uk-width-medium-1-10 uk-width-1-3">
		    <img src="<?php echo base_url('assets/img/user.svg'); ?>">
		</div>
		<div class="uk-width-medium-9-10">
		    <span itemprop="creator" itemscope itemtype="http://schema.org/Person">
		      <div itemprop="name" class="el-comment-title"><?php echo $user_name; ?></div>
		    </span>
		    <div itemprop="commentTime" class="el-comment-meta">
		        <?php echo $created; ?>
		    </div>
		    <div itemprop="commentText" class="el-comment-body">
		        <?php echo $msg; ?>
		    </div>
				<div class="comment-reply uk-margin">
				    <button class="el-btn el-transparent-btn-two" data-comment-reply="<?php echo $id; ?>">
				        <?php echo lang('comments_reply'); ?>
				    </button>
				</div>
		</div>
	</div>
</div>
