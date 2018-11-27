<div class="uk-overflow-container">
    <table class="mech-table uk-table uk-table-hover">
        <thead>
            <tr>
                <th class="uk-width-1-10">
                    <div class="uk-grid uk-grid-collapse uk-grid-width-1-2">
                        <div class="uk-text-right"><i class="uk-icon-sort"></i></div>
                        <div class="uk-text-center">
                            <input type="checkbox" id="checkAll">
                        </div>
                    </div>
                </th>
                <th class="uk-width-3-10">Заголовок</th>
                <th class="uk-width-1-10">Тип</th>
                <th class="uk-width-3-10">URL</th>
                <th class="uk-width-1-10 uk-text-center"><i class="uk-icon-small uk-icon-eye"></i></th>
                <th class="uk-width-1-10 uk-text-center"><i class="uk-icon-small uk-icon-edit"></i></th>
            </tr>
        </thead>
        <tbody class="uk-sortable" data-uk-sortable="{handleClass:'uk-sortable-handle', dragCustomClass:'uk-button', animation:0}">
            <?php if (!empty($elems)) : foreach ($elems as $el) : ?>
            <tr class="movable uk-table-middle uk-visible-hover<?php echo ($el['pub']) ? '' : ' uk-overlay-grayscale'; ?>" data-id="<?php echo $el['id']; ?>">
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
                <!-- Title -->
                <td class="uk-width-3-10 uk-text-bold">
                  <?php $ico = (!empty($el['icon']))
              					? '<i class="uk-icon-justify uk-icon-'.$el['icon'].'"></i>&ensp;' : '';

                  switch ($el['item_type']) {
                    case 'cat':
                      echo '<a href="' . $mod['index'] .'items/'. ($el['pid'] ?? '0') . '/' . $el['id'] . '">' . $ico . ellipsize($el['title'], 30) . '</a>';
                      break;

                    case 'link':
                      echo $ico . ellipsize($el['title'], 30);
                      break;

                    case 'header':
                      echo '--- ' . $ico . ellipsize($el['title'], 30) . ' ---';
                      break; } ?>
                </td>
                <!-- Item type -->
                <td class="uk-width-1-10">
                  <?php switch ($el['item_type']) {
                    case 'link':
                      echo 'Посилання';
                      break;
                    case 'cat':
                      echo 'Категорія';
                      break;
                    case 'header':
                      echo 'Заголовок';
                      break;
                    case 'div':
                      echo 'Розділювач';
                      break; } ?>
                </td>
                <!-- URL -->
                <td class="uk-width-3-10">
                    <?php if ($el['item_type'] === 'link' || $el['item_type'] === 'cat') :

                		// IF ANY LINK ISSET
              			if ($el['url_id'] || !empty($el['link'])) {

	      				      // SITE PAGE
	      				  		if ($el['url_id'])
	      				  		{
	      				  				// GET URL
	      				  				$url = ($el['home']) ? rtrim(base_url(), '/')	: base_url($el['url']);

	      				  				// GET ANCHOR
	      				  				$url .= ($el['anchor']) ? '/'. $el['anchor'] : null;
	      				  		}

	      				  		// OTHER LINK
	      				  		if (!empty($el['link']))
	      				  		{
	      									$url = $el['link'];
	      				  		}

	      				  		echo '<a href="' . $url . '" target="_blank" title="'. $url .'">' . ellipsize($url, 30) . '</a>';
              			}

              			// IF ONLY ANCHOR ISSET
              			elseif (!empty($el['anchor'])) {
	      				  		echo $el['anchor'];
              			}

                    endif; ?>
                </td>
                <!-- Publish -->
                <td class="uk-width-1-10 uk-text-center">
                    <?php if ($el['pub'])
                {
                    $class = 'uk-text-success';
                    $icon  = ($el['home']) ? 'uk-icon-home' : 'uk-icon-eye';
                }
                else
                {
                    $class = 'uk-text-muted';
                    $icon  = ($el['home']) ? 'uk-icon-home' : 'uk-icon-eye-slash';
                }; ?>
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