<?php
/* Basic starter template so WP recognizes the theme */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php bloginfo('name'); ?></title>
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <main style="padding:2rem;">
    <h1>Haritam Theme Active</h1>
    <p>If you see this on the site, the theme is installed correctly.</p>
  </main>
  <?php wp_footer(); ?>
</body>
</html>
