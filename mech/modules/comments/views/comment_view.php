<div id="commentInModal" class="uk-modal" data-comment-id="<?php echo $comment['id']; ?>">
    <div class="uk-modal-dialog uk-modal-large">
        <a class="uk-modal-close uk-close"></a>
        <div class="uk-panel">
      			<article class="uk-comment">
      			    <header class="uk-comment-header">
      			        <i class="uk-icon-large uk-icon-user"></i>
      			        <h4 class="uk-comment-title"><?php echo $comment['user_name']; ?></h4>
      			        <h5 class="uk-comment-title"><?php echo $comment['user_email']; ?></h5>
      			        <div class="uk-comment-meta"><?php echo $comment['created']; ?></div>
      			        <div class="uk-comment-meta">
      			        		Зі сторінки: <a href="<?php echo base_url($comment['url']); ?>" target="_blank"><?php echo $comment['title']; ?></a>
      			        </div>
      			    </header>
      			    <div class="uk-comment-body"><?php echo $comment['msg']; ?></div>
      			</article>

        		<div class="uk-margin">
        			Статус:&emsp;<?php echo form_dropdown('status', $statuses, $comment['status'], 'disabled'); ?>
        		</div>
        </div>
    </div>
</div>