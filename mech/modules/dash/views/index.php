<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<!DOCTYPE html>
<html lang="uk-UA">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="robots" content="noindex, nofollow">
		<title><?php echo $mod['title'] ?? 'Панель керування'; ?></title>
		<link rel="shortcut icon" href="<?php echo base_url('mech/modules/dash/views/assets/img/mechanic.ico'); ?>" type="image/x-icon">

		<!-- СSS -->
		<link href="<?php echo base_url('mech/modules/dash/views/assets/css/admin.min.css'); ?>" rel="stylesheet">

		<!-- Base vars -->
		<script>
		    var baseUrl = "<?php echo base_url(); ?>",
						modName = "<?php echo $mod['name'] ?? ''; ?>",
						index  = "<?php echo $mod['index'] ?? ''; ?>";
		</script>
	</head>
	<body>
		<!-- Preloader -->
		<div id="mechPreloader" class="hidden mech-preloader">
				<i class="uk-icon-large uk-icon-gear uk-icon-spin"></i>
		</div>

		<!-- Dashboard / Login -->
		<?php echo $content; ?>

		<!-- JQuery -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
		<script>if (!window.jQuery) {document.write('<script src="'+ "<?php echo base_url('assets/js/jquery-3.3.1.min.js'); ?>" +'"></' + 'script>');	}</script>

		<!-- Scripts -->
		<script src="<?php echo base_url('mech/modules/dash/views/assets/js/admin.min.js'); ?>"></script>
		<?php echo $scripts ?? null; ?>
	</body>
</html>
