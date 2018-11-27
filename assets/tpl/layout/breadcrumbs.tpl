<ul id="breadCrumbs" class="el-breadcrumbs" itemscope="" itemtype="http://data-vocabulary.org/BreadcrumbList">
<?php for ($i = 0; $i < $count; $i++) : ?>
   <li itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem">
   		<a href="<?php echo $crumbs[$i]['url']; ?>" itemprop="name"><span itemprop="name"><?php echo $crumbs[$i]['title']; ?></span></a><meta itemprop="position" content="<?php echo $i + 1; ?>">
   	</li>
<?php endfor; ?>
		<li class="uk-active" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem">
			<span itemprop="name"><?php echo $current; ?></span>
				<meta itemprop="position" content="<?php echo $count + 1; ?>">
		</li>
</ul>
