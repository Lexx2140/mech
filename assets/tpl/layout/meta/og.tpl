<meta property="og:locale" content='<?php echo $this->page["lang"]; ?>'>
<meta property="og:url" content='<?php echo current_url(); ?>'>
<meta property="og:title" content='<?php echo $this->page["m_title"]; ?>'>
<meta property="og:description" content='<?php echo $this->page["m_desc"] ?? ''; ?>'>
<meta property="og:type" content='article'>
<?php if (isset($this->page['img_path']) && !empty($this->page['img'])) : ?>
<meta property="og:image" content="<?php echo $this->page['img_path']; ?>">
<?php endif; ?>