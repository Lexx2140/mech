<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

<?php echo $table['thead']; ?>

    <?php echo $table['th_sort']; ?>
    <th class="uk-width-2-10">Зображення</th>
    <th class="uk-width-2-10">Заголовок</th>
    <th class="uk-width-3-10">Опис</th>
    <?php echo $table['th_pub']; ?>
    <?php echo $table['th_edit']; ?>

<?php echo $table['tbody'];

if (!empty($table['elems'])) { foreach ($table['elems'] as $el) : ?>

      <?php echo $el['tr_open']; ?>

				<!-- Sort -->
				<?php echo $el['td_sort']; ?>

				<!-- Thumbnail -->
				<td class="uk-width-2-10">
				 	<a class="uk-thumbnail" href="<?php echo base_url($path . $parent['name'] .'/'. $el['img']); ?>" data-uk-lightbox="{group:'img_list'}" data-lightbox-type="image" title="<?php echo $el['title']; ?>">
				 		<img src="<?php echo base_url($path . $parent['name'] . '/' . $el['thumb']); ?>" width="50" height="50">
			 		</a>
				</td>

				<!-- Title -->
				<td class="uk-width-2-10 uk-text-bold">
				 	<?php echo ellipsize($el['title'], 30); ?>
				</td>

				<!-- Description -->
				<td class="uk-width-3-10">
					<?php echo ellipsize($el['content'], 100); ?>
				</td>

				<!-- Publish -->
				<?php echo $el['td_pub']; ?>

				<!-- Edit -->
				<?php echo $table['td_edit']; ?>

    <?php echo $el['tr_close']; ?>

  <?php endforeach; }; ?>

<?php echo $table['table_close']; ?>