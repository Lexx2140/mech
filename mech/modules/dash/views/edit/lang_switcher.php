<?php if ($multi) { ?>
<div class="uk-form-row">
		<label class="uk-form-label">Мова:</label>
    <div class="uk-form-controls">
	    <ul class="uk-tab uk-margin" data-uk-tab="{connect:'<?php echo $ul_id; ?>', swiping: false}">
	    		<?php foreach ($langs as $lang) : ?>
	    		    <li>

	    		    		<a href="">
	    		    				<img src="<?php echo base_url('assets/img/flags/' . $lang['slug']. '.svg'); ?>" width="15" height="15">&nbsp;
	    		    				<?php echo $lang['title']; ?>
	        				</a>

	    		    		<?php if (isset($cid)) :
	    		    			echo form_hidden('cid['.$lang['slug'].']', $cid[$lang['slug']]); ?>
	    		    		<?php endif ?>

	    		    </li>
	    		<?php endforeach; ?>
	    </ul>
    </div>
</div>

<?php } else { ?>

	<ul class="uk-tab uk-margin uk-hidden" data-uk-tab="{connect:'<?php echo $ul_id; ?>', swiping: false}">
			<?php foreach ($langs as $lang) : ?>
			    <li>

			    		<?php if (isset($cid)) :
			    			echo form_hidden('cid['.$lang['slug'].']', $cid[$lang['slug']]); ?>
			    		<?php endif ?>

			    </li>
			<?php endforeach; ?>
	</ul>

<?php } ?>