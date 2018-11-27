<div class="el-mob-menu uk-visible-small">
		<div class="mob-nav-left">
		    <div class="logo-header">
		    		<?php echo $this->config->item('logo', 'app'); ?>
		    </div>
		</div>
		<span id="mobMenuToggle" class="mob-nav-right" data-uk-toggle="{target:'#offMenu', animation:'uk-animation-slide-right'}">
				<i class="uk-icon-bars"></i>
		</span>
</div>
<div id="offMenu" class="el-offcanvas-bar uk-hidden">
    <span class="mob-close-btn" data-uk-toggle="{target:'#offMenu', animation:'uk-animation-slide-right'}">
    	<i class="uk-icon-remove"></i>
		</span>
   <ul id="mobMenu" class="mob-menu">
 			<?php echo $items; ?>
   </ul>

       <!-- Contacts mobile-->
       <div class="el-footer-blocks uk-visible-small">
           <!-- Tels -->
           <div class="el-footer-phone">
               <div>
                    <?php foreach ($tels as $tel): ?>
                     <a href="tel:+<?php echo $tel['href']; ?>">
                          <i class="uk-icon-phone"></i>
                     </a>
                     <?php endforeach; ?>
               </div>
           </div>
           <!-- Emails -->
           <div class="el-footer-envelope">
               <div>
                     <?php foreach ($emails as $email): ?>
                     <?php echo safe_mailto(''); ?>
                     <?php endforeach; ?>
               </div>
           </div>
           <!-- Address -->
           <div class="el-footer-address">
               <div>
   						 	<a href="https://www.google.com/maps/d/embed?mid=10pMtREthsMW5lM--HXq6CoHq21F0YMrh" target="_blank"><i class="uk-icon-map-marker"></i></a>
               </div>
           </div>
           <!-- Open hours -->
           <div class="el-footer-workhours">
           	   <div>
                  <details>
                  		<summary>
                  			<i class="uk-icon-clock-o"></i>
                  		</summary>
   									<p class="el-dark-text">По потребі пацієнта та узгодженні з лікарем</p>
                  </details>
               </div>
           </div>
       </div>


</div>