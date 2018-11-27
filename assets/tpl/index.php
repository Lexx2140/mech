<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

<!DOCTYPE html>
<html lang="<?php echo $this->page['lang']; ?>">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php echo $alt_hreflang; ?>
    <title><?php echo $this->page['m_title']; ?></title>
    <meta name="description" content='<?php echo $this->page['m_desc'] ?? null; ?>'>
    <meta name="keywords" content='<?php echo $this->page['m_keys'] ?? null; ?>'>
    <?php if(isset($this->app['m_rev'])) : ?>
  	<meta name="revisit-after" content="1 days"/>
  	<?php endif; ?>
	  <?php if(isset($this->app['m_glob'])) : ?>
		<meta name="distribution" content="Global"/>
		<?php endif; ?>
		<?php if (isset($this->page['options']['canonic']) && $this->page['options']['canonic']) : ?>
		<link rel="canonical" href="<?php echo base_url($this->page['url']); ?>"/>
		<?php endif ?>

    <!-- Favicon(s) -->
    <?php echo $favicon; ?>

    <!-- Google LJSON microdata -->
    <?php echo $ljson; ?>

    <!-- Opengraph microdata -->
    <?php echo $og; ?>

    <!-- Font Loader -->
    <?php echo $fonts_js; ?>

    <!-- Main APP CSS -->
    <link href="<?php echo base_url('assets/css/main.min.css'); ?>" rel="stylesheet" media="all">
    <script>var baseUrl = "<?php echo base_url(); ?>";</script>

    <!-- Head JS -->
    <?php echo $head_js; ?>
  </head>

  <body>
    <?php echo $preloader; ?>

    <!-- Mobile menu -->
    <?php echo Modules::run('menu/show_menu', 'mobile'); ?>

    <?php echo $header; ?>
    <?php echo $content; ?>
    <?php echo $footer; ?>

    <!-- jQuery -->
    <script src="<?php echo base_url('assets/js/jquery-3.3.1.min.js'); ?>"></script>
    <!-- <?php //echo $jquery; ?> -->

    <!-- Main APP JS -->
    <script src="<?php echo base_url('assets/js/mscript.min.js'); ?>"></script>

    <!-- Body JS -->
    <?php echo $body_js; ?>

    <!-- GoTop -->
    <?php echo $gotop; ?>

  </body>
</html>