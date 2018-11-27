<!-- Top nav -->
<nav class="mech-top-menu" data-uk-sticky>
		<a href="<?php echo base_url('admin/dash/setup'); ?>" class="uk-icon uk-icon-hover uk-icon-gears" title="Налаштування"></a>
		<a href="<?php echo base_url(); ?>" class="uk-icon uk-icon-hover uk-icon-home" title="Перейти на сайт" target="_blank"></a>
		<a href="<?php echo base_url('user/logout'); ?>" class="uk-icon uk-icon-hover uk-icon-sign-out" title="Вийти"></a>
</nav>

<!-- Sidebar menu -->
<ul id="dashMenu" class="mech-dash-menu uk-nav uk-nav-offcanvas uk-margin">
	<!-- Admin -->
	<?php foreach ($modules['system'] as $amod): ?>
	<li>
		<a href="<?php echo base_url('admin/' . $amod['name']); ?>"><i class="uk-icon-justify uk-icon-small <?php echo $amod['icon']; ?>"></i>&emsp;<?php echo $amod['title']; ?></a>
	</li>
	<?php endforeach; ?>
	<!-- Site -->
	<li>
		<a id="siteHref" href="<?php echo base_url('admin/site'); ?>"><i class="uk-icon-justify uk-icon-small uk-icon-html5"></i>&emsp;Сайт</a>
		<ul class="uk-nav-sub uk-margin-left">
			<li id="catsHref">
				<a href="<?php echo base_url('admin/site/categories'); ?>">
					<i class="uk-icon-justify uk-icon-folder"></i>&emsp;Категорії
				</a>
			</li>
			<li id="pagesHref">
				<a href="<?php echo base_url('admin/site/pages'); ?>">
					<i class="uk-icon-justify uk-icon-clone"></i>&emsp;Сторінки
				</a>
			</li>
		</ul>
	</li>
	<!-- Navigation -->
	<?php foreach ($modules['nav'] as $nav): ?>
	<li>
		<a href="<?php echo base_url('admin/' . $nav['name']); ?>"><i class="uk-icon-small uk-icon-justify <?php echo $nav['icon']; ?>"></i>&emsp;<?php echo $nav['title']; ?></a>
	</li>
	<?php endforeach; ?>
	<!-- Plugins -->
	<?php foreach ($modules['plugin'] as $plugin): ?>
	<li>
		<a href="<?php echo base_url('admin/' . $plugin['name']); ?>"><i class="uk-icon-small uk-icon-justify <?php echo $plugin['icon']; ?>"></i>&emsp;<?php echo $plugin['title']; ?>
			<?php if ($plugin['notify']) : ?>
			<span id="<?php echo $plugin['name']; ?>_notify" class="hidden uk-align-right">
			</span>
			<?php endif; ?>
		</a>
	</li>
	<?php endforeach; ?>
</ul>