<ul id="commentStatus" class="uk-tab uk-tab-grid uk-text-uppercase" data-comments data-uk-tab>
    <li class="uk-width-1-4 uk-active">
    		<a href="<?php echo $mod['index']; ?>">
  				<i class="uk-icon-commenting-o"></i>&ensp;Всі
    		</a>
  			<div class="mech-badge mech-badge-primary <?php echo ($count['all'] === 0) ? 'hidden' : ''; ?>" data-status="all"><?php echo $count['all']; ?></div>
  	</li>
    <li class="uk-width-1-4">
    		<a href="<?php echo $mod['index'] .'list/1'; ?>">
    			<i class="uk-icon-edit"></i>&ensp;На модерації
    		</a>
   			<div class="mech-badge <?php echo ($count['mod'] === 0) ? 'hidden' : ''; ?>" data-status="mod"><?php echo $count['mod']; ?></div>
		</li>
    <li class="uk-width-1-4">
    		<a href="<?php echo $mod['index'] .'list/2'; ?>">
    			<i class="uk-icon-check-square-o"></i>&ensp;Схвалені
    		</a>
   			<div class="mech-badge <?php echo ($count['approved'] === 0) ? 'hidden' : ''; ?>" data-status="approved"><?php echo $count['approved']; ?></div>
		</li>
    <li class="uk-width-1-4">
    		<a href="<?php echo $mod['index'] .'list/3'; ?>">
    			<i class="uk-icon-exclamation-triangle"></i>&ensp;Спам
  			</a>
 				<div class="mech-badge <?php echo ($count['spam'] === 0) ? 'hidden' : ''; ?>" data-status="spam"><?php echo $count['spam']; ?></div>
		</li>
</ul>

<div class="uk-overflow-container uk-margin">
	  <table class="mech-table uk-table uk-table-hover uk-table-condensed" id="comments_table">
	    <thead>
	      <tr>
	        <th class="uk-width-1-10 uk-text-center"><input type="checkbox" id="checkAll" data-selected></th>
	        <th class="uk-width-3-10">Повідомлення</th>
	        <th class="uk-width-2-10">Користувач</th>
	        <th class="uk-width-2-10">Email</th>
	        <th class="uk-width-2-10">Сторінка</th>
	      </tr>
	    </thead>
	    <tbody>
  			<?php if (!empty($elems)) : foreach ($elems as $el) : ?>
  			  <tr class="uk-table-middle">
  			      <!-- ID -->
  			      <td class="uk-width-1-10 uk-text-center">
  			      	<input type="checkbox" value="<?php echo $el['id']; ?>">
  			    	</td>
  			      <!-- Message -->
  			      <td class="uk-width-3-10">
  			        <span class="uk-text-small uk-text-muted"><?php echo $el['created']; ?></span><br>
  			        <p><?php echo ellipsize($el['msg'], 150); ?></p>
  			        <a href="<?php echo $mod['index'] . 'view/' . $el['id']; ?>" data-ajax-modal>Переглянути</a>
  			      </td>
  			      <!-- User -->
  			      <td class="uk-width-2-10"><?php echo $el['user_name']; ?></td>
  			      <!-- Email -->
  			      <td class="uk-width-2-10"><?php echo $el['user_email']; ?></td>
  			      <!-- On page -->
  			      <td class="uk-width-2-10">
  			      	<a href="<?php echo base_url($el['url']); ?>" target="_blank"><?php echo $el['title']; ?></a>
  			      </td>
  			  </tr>
  			<?php endforeach; endif; ?>
	     </tbody>
	   </table>
		 <!-- <ul class="uk-pagination" data-uk-pagination="{items:6, itemsOnPage:2}"></ul> -->
</div>