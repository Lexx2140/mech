<?php if (!empty($subs['pages'])) : ?>
<div class="el-light-bg">
    <div class="uk-width-medium-3-5 el-blog">
        <div>
	        <div id="pageContent">
	            <h1 class="el-h1 el-dark-text uk-margin-top"><?php echo $title; ?></h1>
	          	<?php foreach ($subs['pages'] as $sub): ?>
	            <div class="lx-article-text el-blog-artcl uk-grid">
	                <div class="uk-width-medium-1-3">
	                    <?php load_inline('assets/img/blog-bg.svg'); ?>
	                </div>
	                <div class="uk-width-medium-2-3 el-dark-text">
	                    <h3 class="title-artcl el-dark-text el-h3"><?php echo $sub['title']; ?></h3>
	                    <p><?php echo ellipsize($sub['content'], 200); ?></p>
	                    <a href="<?php echo $sub['url']; ?>" class="el-btn el-mint-btn-two uk-align-right" title="<?php echo $sub['title']; ?>">Читати далі</a>
	                </div>
	            </div>
	            <?php endforeach; ?>
	        </div>
					<!-- Pagination -->
					<?php echo $pagination; ?>
        </div>
    </div>
</div>
<?php endif; ?>