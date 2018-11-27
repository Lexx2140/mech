<div class="uk-overflow-container">
    <table class="mech-table uk-table uk-table-hover">
        <thead>
            <tr>
            		<th class="uk-width-1-10 uk-text-center"><input type="checkbox" id="checkAll"></th>
                <th class="uk-width-3-10">Замовник</th>
                <th class="uk-width-3-10">Повідомлення</th>
                <th class="uk-width-2-10">Дата</th>
                <th class="uk-width-1-10 uk-text-center"><i class="uk-icon-small uk-icon-edit"></i></th>
            </tr>
        </thead>
        <tbody>
            <?php if (!empty($elems)) : foreach ($elems as $el) : ?>
            <tr class="uk-table-middle uk-visible-hover" data-id="<?php echo $el['id']; ?>">
               <td class="uk-width-1-10 uk-text-center">
               		<input type="checkbox" value="<?php echo $el['id']; ?>">
               </td>
                <!-- User name -->
                <td class="uk-width-3-10">
                  <?php echo $el['name']; ?> <br>
                  <span class="uk-text-muted"><?php echo $el['email']; ?></span> <br>
                  <span class="uk-text-muted"><?php echo $el['tel']; ?></span>
                </td>
                <!-- User contacts -->
                <td class="uk-width-3-10">
                  <?php echo ellipsize($el['message'], 50); ?>
                </td>
                <!-- Date -->
                <td class="uk-width-2-10">
                  <?php echo $el['created']; ?>
                </td>
                <!-- Edit -->
                <td class="uk-width-1-1 uk-text-center">
                    <div class="uk-hidden uk-grid uk-grid-width-1-2 uk-grid-small uk-icon-small">
                      	<i class="uk-icon-hover uk-icon-eye" data-view></i>
                        <i class="uk-icon-hover uk-icon-trash" data-del></i>
                    </div>
                </td>
            </tr>
            <?php endforeach; endif; ?>
        </tbody>
    </table>
</div>