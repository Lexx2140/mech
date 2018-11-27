<div class="uk-overflow-container">
    <table class="mech-table uk-table uk-table-hover">
        <thead>
            <tr>
                <th class="uk-width-1-10">
                    <div class="uk-grid uk-grid-collapse uk-grid-width-1-2">
                        <div class="uk-text-right">
                        	<i class="uk-icon-sort"></i>
                      	</div>
                        <div class="uk-text-center">
                            <input type="checkbox" id="checkAll">
                        </div>
                    </div>
                </th>
                <th class="uk-width-2-10 uk-text-center">Медіа</th>
                <th class="uk-width-2-10">Заголовок</th>
                <th class="uk-width-3-10">Опис</th>
                <th class="uk-width-1-10 uk-text-center"><i class="uk-icon-small uk-icon-eye"></i></th>
                <th class="uk-width-1-10 uk-text-center"><i class="uk-icon-small uk-icon-edit"></i></th>
            </tr>
        </thead>
        <tbody class="uk-sortable" data-uk-sortable="{handleClass:'uk-sortable-handle', dragCustomClass:'uk-button', animation:0}">
            <?php if (!empty($elems)) : foreach ($elems as $el) : ?>
            <tr class="movable uk-table-middle uk-visible-hover <?php echo ($el['pub']) ? '' : 'uk-overlay-grayscale'; ?>" data-id="<?php echo $el['id']; ?>">
                <td class="uk-width-1-10">
                    <div class="uk-grid uk-grid-collapse uk-grid-width-1-2">
												<div class="uk-sortable-handle uk-text-right">
												    <?php echo $el['sort']; ?>
												</div>
                        <div class="uk-text-center">
                            <input type="checkbox" value="<?php echo $el['id']; ?>">
                        </div>
                    </div>
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
                  <?php if ($el['src'] === 'file' && !empty($el['media']) && !empty($el['mime'])) : ?>

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
                      	<a class="uk-thumbnail" href="<?php echo base_url($path . $el['media']); ?>" data-uk-lightbox data-lightbox-type="iframe" title="<?php echo $el['title']; ?>" style="width: 50px; height: 50px;object-fit:cover;">
                        	<i class="uk-icon uk-icon-large uk-text-success uk-icon-file-o"></i>
                      	</a>
                      <?php } ?>
                  <?php endif; ?>
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
                <td class="uk-width-1-10 uk-text-center">
	                <?php
	                	$class = ($el['pub']) ? 'uk-text-success' : 'uk-text-muted';
	                	$icon = ($el['pub']) ? 'uk-icon-eye' : 'uk-icon-eye-slash';
	                 ?>
                    <i class="<?php echo $class; ?> uk-icon-small uk-icon-hover <?php echo $icon; ?>" data-pub></i></td>
                <!-- Edit -->
                <td class="uk-width-1-1 uk-text-center">
                    <div class="uk-hidden uk-grid uk-grid-width-1-2 uk-grid-small uk-icon-small">
                        <i class="uk-icon-hover uk-icon-pencil" data-edit></i>
                        <i class="uk-icon-hover uk-icon-trash" data-del></i>
                    </div>
                </td>
            </tr>
            <?php endforeach; endif; ?>
        </tbody>
    </table>
</div>