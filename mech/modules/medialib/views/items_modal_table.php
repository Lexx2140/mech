<table id="itemsList" class="mech-table uk-table uk-table-hover">
    <thead>
        <tr>
            <th class="uk-width-1-10 uk-text-center">
            	<i class="uk-icon-small uk-icon-eye uk-icon-hover" data-show-all data-uk-tooltip title="Показати/Сховати усі"></i>
            </th>
            <th class="uk-width-2-10 uk-text-center">Медіа</th>
            <th class="uk-width-3-10">Заголовок</th>
            <th class="uk-width-4-10">Опис</th>
        </tr>
    </thead>
    <tbody>
        <?php if (!empty($elems)) : foreach ($elems as $el) : ?>
        <tr class="uk-table-middle" data-id="<?php echo $el['id']; ?>" data-show>

						<!-- Publish -->
						<td class="uk-width-1-10 uk-text-center">
						    <i class="uk-icon-eye uk-icon-small uk-icon-hover" data-item-view></i>
						</td>

          	<!-- Thumbnail (by type) -->
          	<td class="uk-width-2-10 uk-text-center">

					    <!-- URL -->
							<?php if ($el['src'] === 'url') : ?>
								<a class="uk-thumbnail" href="<?php echo $el['media']; ?>" data-uk-lightbox title="<?php echo $el['title']; ?>">
								  <img src="<?php echo $el['media']; ?>" width="50" height="50" alt="<?php echo $el['title']; ?>">
								</a>
							<?php endif; ?>

					    <!-- Icon -->
							<?php if ($el['src'] === 'icon') : ?>
								<i class="uk-icon uk-icon-large uk-icon-<?php echo $el['media']?>"></i>
							<?php endif; ?>

              <!-- File -->
              <?php if ($el['src'] === 'file') : ?>

                  <!-- Get type of file -->
                  <?php $type = explode('/', $el['mime']); ?>

                  <!-- Image -->
                  <?php if ($type[0] === 'image' ) { ?>
                      <a class="uk-thumbnail" href="<?php echo base_url($path . $el['media']); ?>" data-uk-lightbox data-lightbox-type="image" title="<?php echo $el['title']; ?>">
                        <img src="<?php echo base_url($path . $el['thumb']); ?>" width="50" height="50" alt="<?php echo $el['title']; ?>">
                      </a>

                  <!-- Video -->
                  <?php } if ($type[0] === 'video') { ?>
                    <a class="uk-thumbnail" href="<?php echo base_url($path . $el['media']); ?>" data-uk-lightbox data-lightbox-type="video" title="<?php echo $el['title']; ?>">
                      <video style="width: 50px; height: 50px;object-fit:cover;">
                        <source src="<?php echo base_url($path . $el['media']); ?>" type="<?php echo $el['mime']; ?>">
                      </video>
                    </a>

                  <!-- Audio -->
                  <?php } if ($type[0] === 'audio') { ?>
                  		 <audio controls>
                  		  <source src="<?php echo base_url($path . $el['media']); ?>" type="<?php echo $el['mime']; ?>">
                  		</audio>

                  <!-- PDF -->
                  <?php } if ($type[1] === 'pdf') { ?>
                  	<a class="uk-thumbnail" href="<?php echo base_url($path . $el['media']); ?>" data-uk-lightbox data-lightbox-type="iframe" title="<?php echo $el['title']; ?>" style="width: 50px; height: 50px;object-fit:cover;">
                    <i class="uk-icon uk-icon-large uk-text-success uk-icon-file-pdf-o"></i>
										</a>
									<!-- Other files -->
                  <?php } elseif ($type[0] === 'application' || $type[0] === 'text') { ?>
                  	<a class="uk-thumbnail" href="<?php echo base_url($path . $el['media']); ?>" style="width: 50px; height: 50px;object-fit:cover;">
                    	<i class="uk-icon uk-icon-large uk-text-success uk-icon-file-o"></i>
                  	</a>
                  <?php } ?>
              <?php endif; ?>
          	</td>

            <!-- Title -->
            <td class="uk-width-3-10 uk-text-bold">
             	<?php echo ellipsize($el['title'], 30); ?>
            </td>
            <!-- Description -->
            <td class="uk-width-4-10">
              <?php echo ellipsize($el['content'], 100); ?>
            </td>
        </tr>
        <?php endforeach; endif; ?>
    </tbody>
</table>
