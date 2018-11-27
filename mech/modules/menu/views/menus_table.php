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
                <th class="uk-width-3-10">Назва</th>
                <th class="uk-width-2-10">Розташування</th>
                <th class="uk-width-2-10">Шаблон</th>
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
                  <a href="<?php echo $mod['index'] . 'items/' . $el['id']; ?>"><?php echo ellipsize($el['title'], 30); ?></a>
                </td>
                <!-- Position -->
                <td class="uk-width-2-10">
                  <?php echo $el['pos']; ?>
                </td>
                <!-- Template -->
                <td class="uk-width-2-10">
                  <?php echo $el['tpl']; ?>
                </td>
                <!-- Published -->
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