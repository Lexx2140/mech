<div class="uk-overflow-container">
    <table class="mech-table uk-table uk-table-hover" id="page_table">
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
                <th class="uk-width-4-10">URL</th>
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
                		<?php if ($this->uri->segment(3) === 'categories') { ?>
                			<a href="<?php echo $mod['index'] .'categories/'. $el['id']; ?>">
	                        <?php echo ellipsize($el['title'], 50); ?>
	                    </a>
                		<?php } else { ?>
                  		<?php echo ellipsize($el['title'], 50); ?>
                		<?php } ?>
                </td>
                <!-- URL -->
                <td class="uk-width-4-10">
                    <?php $url = ($el['home']) ? rtrim(base_url(), '/') : base_url($el['url']); ?>
                    <a href="<?php echo $url; ?>" target="_blank" title="<?php echo $url; ?>">
                        <?php echo ellipsize($url, 50); ?>
                    </a>
                </td>
                <!-- PUBLISHED -->
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
                } ?>
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
		<?php echo $pagination; ?>
</div>