<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
	    <meta http-equiv="Content-Type" content="text/html; charset='<?php echo strtolower($this->config->item("charset")); ?>'" />
	    <title>
	        <?php echo html_escape($subject); ?>
	    </title>
	    <style type="text/css">
	    body {
	        font-family: Arial, Verdana, Helvetica, sans-serif;
	        font-size: 16px;
	    }
	    </style>
	</head>
	<body>
	    <?php echo $message; ?>
	</body>
</html>