<div class="el-dark-bg uk-grid uk-grid-collapse uk-grid-width-medium-1-2">
    <h1 class="el-gaslo uk-visible-small"><?php echo $this->app['slogan']; ?></h1>
  	<div class="first-screen-btn uk-visible-small">
  	    <a href="#footerForm" class="el-btn el-mint-btn">Записатись на прийом</a>
  	    <a href="#aboutUs" class="el-btn el-transparent-btn">Дізнатись більше</a>
  	</div>
    <div class="el-text-block uk-push-1-2" data-uk-scrollspy="{cls:'uk-animation-fade', delay:4200}">
        <div data-uk-margin>
            <p class="el-white-text uk-width-1-2 uk-hidden-small">
                Кабінет
                <br>дитячої та підліткової
                <br>гінекології
            </p>

            <h1 class="el-gaslo uk-hidden-small uk-margin-large-bottom"><?php echo $this->app['slogan']; ?></h1>

            <div class="first-screen-btn uk-hidden-small">
                <a href="#footerForm" class="el-btn el-mint-btn">Записатись на прийом</a>
                <a href="#aboutUs" class="el-btn el-transparent-btn">Дізнатись більше</a>
            </div>
        </div>
    </div>

    <div class="el-tree-div uk-pull-1-2">
        <?php echo load_inline('assets/img/tree.svg'); ?>
    </div>
</div>

<!--About us-->
<div id="aboutUs" class="el-light-bg el-aboutus">
    <div class="uk-width-medium-7-10 uk-container-center">
        <div class="uk-grid">
            <div class="el-text-block-left uk-width-medium-1-3">
                <div data-uk-scrollspy="{cls:'uk-animation-slide-left, delay:700'}">
                    <h1 class="el-h1 el-dark-text el-text-border-bottom"><?php echo $content['about_title']; ?></h1>
                </div>
            </div>
            <div class="el-text-block-left uk-width-medium-2-3">
                <div class="el-text-border el-dark-text el-article-mob" data-uk-scrollspy="{cls:'uk-animation-slide-right, delay:700'}">
                    <?php echo $content['about']; ?>
                </div>
            </div>
        </div>
    </div>
</div>
<!--Services-->
<div id="poslugy" class="el-dark-bg el-services">
    <div class="uk-width-medium-7-10 main-container uk-container-center" >
        <div data-uk-scrollspy="{cls:'uk-animation-fade', delay:300}">
            <div class="uk-grid el-services">
                <div class="uk-width-medium-1-5">
                    <img class="el-services-icon" src="<?php echo base_url('assets/img/why-doctor.svg'); ?>" alt="Чому слід звертатися до лікаря?">
                </div>
                <div class="uk-width-medium-4-5">
                    <h1 class="el-h1 el-white-text"><?php echo $content['b1_title']; ?></h1>
                </div>
            </div>
            <div class="el-white-text lx-article-text uk-margin-top">
                <?php echo $content['b1']; ?>
            </div>
        </div>
    </div>
</div>
<div id="testhome" class="el-light-bg el-services">
    <div class="uk-width-medium-7-10 main-container uk-container-center">
        <div data-uk-scrollspy="{cls:'uk-animation-fade', delay:300}">
            <div class="uk-grid el-services">
                <div class="uk-width-medium-1-5">
                    <img class="el-services-icon" src="<?php echo base_url('assets/img/diagnosis.svg'); ?>" alt="Діагностика та лікування">
                </div>
                <div class="uk-width-medium-4-5">
                    <h1 class="el-h1 el-dark-text"><?php echo $content['b2_title']; ?></h1>
                </div>
            </div>
            <div class="el-dark-text lx-article-text uk-margin-top">
                <?php echo $content['b2']; ?>
            </div>
        </div>
    </div>
</div>
<div class="el-dark-bg el-services">
    <div class="uk-width-medium-7-10 main-container uk-container-center">
        <div data-uk-scrollspy="{cls:'uk-animation-fade', delay:300}">
            <div class="uk-grid el-services">
                <div class="uk-width-medium-1-5">
                    <img class="el-services-icon" src="<?php echo base_url('assets/img/consultancy.svg'); ?>" alt="Консультування">
                </div>
                <div class="uk-width-medium-4-5">
                    <h1 class="el-h1 el-white-text"><?php echo $content['b3_title']; ?></h1>
                </div>
            </div>
            <div class="el-white-text lx-article-text uk-margin-top">
                <?php echo $content['b3']; ?>
            </div>
        </div>
    </div>
</div>

<!-- Blog preview -->
<?php echo $cat_preview; ?>
