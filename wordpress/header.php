<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <link rel="icon" type="image/svg+xml" href="<?php echo get_template_directory_uri(); ?>/assets/images/favicon.svg">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

    <canvas id="grid-canvas"></canvas>
    <div class="custom-cursor-dot"></div>
    <div class="custom-cursor-outline"></div>

    <button class="mobile-nav-toggle" aria-label="Menu"><span></span><span></span></button>
    
    <!-- Dynamic Logo -->
    <a href="<?php echo home_url(); ?>" class="mobile-logo">
        <?php if ( has_custom_logo() ) : 
            $custom_logo_id = get_theme_mod( 'custom_logo' );
            $logo = wp_get_attachment_image_src( $custom_logo_id , 'full' );
            echo '<img src="' . esc_url( $logo[0] ) . '" alt="' . get_bloginfo( 'name' ) . '">';
        else : ?>
            NRS
        <?php endif; ?>
    </a>

    <div class="mobile-nav-overlay">
        <nav class="mobile-nav-links">
            <a href="<?php echo home_url(); ?>" class="<?php echo is_front_page() ? 'active' : ''; ?>">Home</a>
            <a href="<?php echo home_url('/work'); ?>" class="<?php echo is_page('work') || is_page('projects') ? 'active' : ''; ?>">Work</a>
            <a href="<?php echo home_url('/about'); ?>" class="<?php echo is_page('about') ? 'active' : ''; ?>">About</a>
            <a href="<?php echo home_url('/blog'); ?>" class="<?php echo is_home() ? 'active' : ''; ?>">Writing</a>
            <a href="<?php echo home_url('/contact'); ?>" class="<?php echo is_page('contact') ? 'active' : ''; ?>">Contact</a>
        </nav>
    </div>

    <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme">
        <svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>
    </button>

    <nav class="nav-wrapper">
      <div class="nav-pill">
        <div class="nav-glider"></div>
        <a href="<?php echo home_url(); ?>" class="nav-link <?php echo is_front_page() ? 'active' : ''; ?>">Home</a>
        <a href="<?php echo home_url('/work'); ?>" class="nav-link <?php echo is_page('work') || is_page('projects') ? 'active' : ''; ?>">Work</a>
        <a href="<?php echo home_url('/about'); ?>" class="nav-link <?php echo is_page('about') ? 'active' : ''; ?>">About</a>
        <a href="<?php echo home_url('/blog'); ?>" class="nav-link <?php echo is_home() ? 'active' : ''; ?>">Writing</a>
        <a href="<?php echo home_url('/contact'); ?>" class="nav-link <?php echo is_page('contact') ? 'active' : ''; ?>">Contact</a>
      </div>
    </nav>