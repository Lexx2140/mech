<div class="el-light-bg">
    <div class="main-container">
        <div class="el-white-tree"></div>
        <div class="uk-margin-large-top">
            <div class="uk-width-medium-7-10 el-article">
                <?php echo $this->page['breadcrumbs']; ?>
                <h1 class="el-h1 el-dark-text"><?php echo $title; ?></h1>
                <div class="el-dark-text">
                    <div>
                        <?php echo $content; ?>
                        <p>Поділитись:</p>
                        <a class="el-social-icon" href="https://www.facebook.com/sharer/sharer.php?u=" target="_blank" title="Поділитись на Facebook"><i class="uk-icon-facebook"></i></a>
                    </div>
                </div>
                <?php echo Modules::run('comments/show', $this->page['id'], $this->page['comments'] ?? null); ?>
            </div>
        </div>
    </div>
</div>