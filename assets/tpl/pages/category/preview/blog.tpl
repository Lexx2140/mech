<div class="el-light-bg">
    <div class="uk-width-medium-7-10 el-blog el-services uk-hidden-small">
        <div>
            <!-- Category title -->
            <h1 class="el-h1 el-dark-text uk-margin-top uk-margin-large">
            	<?php echo $title; ?>
          	</h1>

            <?php if (!empty($subs['pages'])) : ?>

            <div class="uk-grid uk-grid-width-medium-1-3" data-uk-scrollspy="{cls:'uk-animation-fade uk-invisible', target:'.show-bl', delay:400}">
                <?php foreach ($subs['pages'] as $page) : ?>

                <div class="uk-invisible show-bl">
                    <div class="el-blog-land">

                    		<!-- Image -->
                        <?php load_inline('assets/img/blog-bg.svg'); ?>

												<!-- Title -->
                        <div class="el-blog-title">
	                        	<div>
		                            <h3 class="el-dark-text title-artcl el-h3"><?php echo $page['title']; ?></h3>
	                        	</div>
                        </div>

												<!-- Text -->
                        <div class="el-blog-text">
                            <p class="el-dark-text"><?php echo ellipsize($page['content'], 150); ?></p>
                        </div>

												<!-- Button -->
                        <div class="uk-text-center el-blog-btn">
                            <a href="<?php echo $page['url'] ?>" class="el-btn el-transparent-btn-two" title="">Читати далі</a>
                        </div>

                    </div>
                </div>

                <?php endforeach; ?>
            </div>


            <?php endif; ?>
            <div class="uk-text-center uk-margin-large-top uk-margin-large">
                <a href="<?php echo $url; ?>" class="el-btn el-mint-btn-two" title="Блог">Усі статті</a>
            </div>
        </div>
    </div>

    <!--Mob Blog-->
    <?php if (isset($subs) && !empty($subs)) : ?>
    <div class="uk-hidden-medium uk-hidden-large el-text-border-bottom">
        <h1 class="el-h1 el-dark-text el-text-block">
		    	<?php echo $title; ?>
		  	</h1>
        <div class="uk-slidenav-position" data-uk-slider>
            <div class="uk-slider-container">
                <ul class="uk-slider uk-grid-width-1-1">
                    <?php foreach ($subs['pages'] as $sub) : ?>
                    <li class="el-blog-land">
                        <div>
                            <img class="el-blog-bg" src="<?php echo base_url('assets/img/blog-bg.svg'); ?>" alt="<?php echo $sub['title']; ?>">
                            <div class="el-blog-preview">
                                <div class="el-blog-title">
                                    <h3 class="el-dark-text title-artcl el-h3"><?php echo $sub['title']; ?></h3>
                                </div>
                                <div class="el-blog-text">
                                    <p class="el-dark-text">
                                        <?php echo ellipsize($sub['content'], 175); ?>
                                    </p>
                                </div>
                                <div class="uk-text-center el-blog-btn">
                                    <a href="<?php echo $sub['url']; ?>" class="el-btn el-transparent-btn-two" title="<?php echo $sub['title']; ?>">Читати далі</a>
                                </div>
                            </div>
                        </div>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <!--Slide nav-->
            <a href="" class="el-slidenav uk-slidenav-previous" data-uk-slider-item="previous"></a>
            <a href="" class="el-slidenav uk-slidenav-next" data-uk-slider-item="next"></a>
        </div>
        <div class="uk-text-center uk-margin-large-top uk-margin-large">
            <a href="<?php echo $url; ?>" class="el-btn el-mint-btn-two" title="Блог">Усі статті</a>
        </div>
        <?php endif; ?>
    </div>
</div>