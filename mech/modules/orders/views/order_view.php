<div class="uk-container uk-margin">
	<article class="uk-article uk-margin">
	    <p class="uk-article-lead"><?php echo $name; ?></p>
	    <p class="uk-article-meta"><?php echo $email .'. ' . $tel; ?></p>
	    <?php echo $message; ?>
	    <hr class="uk-article-divider">
	</article>

	<?php if (!empty($uploaded)) : ?>
	<div class="uk-grid uk-grid-width-large-1-4 uk-text-center order-img">
			<?php foreach ($uploaded as $file) : ?>
				<a class="uk-thumbnail uk-flex uk-flex-middle uk-flex-center" href="<?php echo base_url($file['file']); ?>" target="_blank">
				    <?php echo $file['thumb']; ?>
				</a>
			<?php endforeach; ?>
	</div>
	<?php endif; ?>
</div>