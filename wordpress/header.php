<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

    <!-- Page Transition Curtain -->
    <div class="page-transition-curtain"></div>

    <canvas id="grid-canvas"></canvas>
    
    <!-- Theme Toggle -->
    <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme">
        <svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zm1.41-13.78c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zM7.28 17.28c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29z"/></svg>
    </button>

    <button class="mobile-nav-toggle" aria-label="Menu"><span></span><span></span></button>
    
    <a href="<?php echo home_url(); ?>" class="mobile-logo">NRS</a>

    <div class="mobile-nav-overlay">
        <nav class="mobile-nav-links">
            <a href="<?php echo home_url(); ?>">Home</a>
            <a href="<?php echo home_url('/work'); ?>">Work</a>
            <a href="<?php echo home_url('/about'); ?>">About</a>
            <a href="<?php echo home_url('/blog'); ?>">Writing</a>
            <a href="<?php echo home_url('/products'); ?>">Products</a>
            <a href="<?php echo home_url('/contact'); ?>">Contact</a>
        </nav>
    </div>

    <nav class="nav-wrapper">
      <div class="nav-pill">
        <a href="<?php echo home_url(); ?>" class="nav-link <?php echo is_front_page() ? 'active' : ''; ?>">Home</a>
        <a href="<?php echo home_url('/work'); ?>" class="nav-link <?php echo is_page('work') || is_page('projects') || is_post_type_archive('project') ? 'active' : ''; ?>">Work</a>
        <a href="<?php echo home_url('/about'); ?>" class="nav-link <?php echo is_page('about') ? 'active' : ''; ?>">About</a>
        <a href="<?php echo home_url('/blog'); ?>" class="nav-link <?php echo is_home() || is_page('blog') ? 'active' : ''; ?>">Writing</a>
        <a href="<?php echo home_url('/products'); ?>" class="nav-link <?php echo is_page('products') ? 'active' : ''; ?>">Products</a>
        <a href="<?php echo home_url('/contact'); ?>" class="nav-link <?php echo is_page('contact') ? 'active' : ''; ?>">Contact</a>
      </div>
    </nav>