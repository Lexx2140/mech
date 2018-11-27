<script type="application/ld+json">
{
    "@context" : "http://schema.org",
    "@type" : "WebSite",
    "name" : "<?php echo $this->app['sitename']; ?>",
    "alternateName" : "<?php echo $this->app['company']; ?>",
    "url" : "<?php echo rtrim(base_url(), '/'); ?>"
}
</script>
<script type="application/ld+json">
{
    "@context" : "http://schema.org",
    "@type" : "LocalBusiness",
    "name" : "<?php echo $this->app['company']; ?>",
    "url" : "<?php echo rtrim(base_url(), '/'); ?>",
    <?php echo $logo; ?>
    <?php echo $address; ?>
    <?php echo $open; ?>
    <?php echo $tel; ?>
    <?php echo $email; ?>
    <?php echo $sameas; ?>
}
</script>