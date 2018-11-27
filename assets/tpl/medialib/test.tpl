<div class="uk-margin-large-top uk-container uk-container-center uk-margin-large">
		<?php if (!empty($title)) : ?>
	 		<h2 class="uk-margin-large-bottom"><?php echo $title; ?></h2>
 		<?php endif; ?>

		<?php if (!empty($content)) : ?>
	 		<div class="uk-margin-large-bottom"><?php echo $content; ?></div>
 		<?php endif; ?>

		<?php if (!empty($items)) : ?>
    <div class="uk-grid uk-grid-width-medium-1-3" data-uk-grid-match>
	    <?php foreach ($items as $item) : ?>
					<div>

						<figure class="uk-overlay uk-overlay-hover">
						    <?php echo $item['thumb']; ?>

						    <figcaption class="uk-overlay-panel uk-overlay-background uk-flex uk-flex-center uk-flex-middle uk-text-center">
						    		<div class="uk-width-8-10 uk-container-center">
						    		<?php if (!empty($item['title'])) : ?>
						        	<h2><?php echo $item['title']; ?></h2>
						      	<?php endif; ?>
						  				<?php echo $item['content']; ?>
						  			</div>
						    </figcaption>

						    <?php if ($item['href']) { ?>
						    <a class="uk-position-cover" href="<?php echo $item['link']; ?>"></a>
						    <?php } else { ?>
								<a class="uk-position-cover" href="<?php echo $item['src']; ?>" data-uk-lightbox="{group:'my-group'}" title="<?php echo $item['title']; ?>"></a>
						    <?php } ?>
						</figure>
					</div>

	    <?php endforeach; ?>
    </div>
    <?php endif; ?>
</div>