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
                <th class="uk-width-4-10">Логін</th>
                <th class="uk-width-4-10">E-mail</th>
                <th class="uk-width-1-10 uk-text-center"><i class="uk-icon-small uk-icon-edit"></i></th>
            </tr>
        </thead>
        <tbody class="uk-sortable" data-uk-sortable="{handleClass:'uk-sortable-handle', dragCustomClass:'uk-button', animation:0}">
            <?php if (!empty($elems)) : foreach ($elems as $el) : ?>
            <tr class="movable uk-table-middle uk-visible-hover" data-id="<?php echo $el['id']; ?>">
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
                <!-- Login -->
                <td class="uk-width-4-10 uk-text-bold">
        						<?php echo $el['login']; ?>
                </td>
                <!-- Email -->
                <td class="uk-width-4-10">
        					<?php echo $el['email']; ?>
                </td>
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