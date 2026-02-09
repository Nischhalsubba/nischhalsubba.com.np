
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <?php if ( ! has_site_icon() ) : ?>
        <link rel="icon" type="image/svg+xml" href="<?php echo get_template_directory_uri(); ?>/assets/images/favicon.svg">
    <?php endif; ?>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

    <div class="page-transition-curtain"></div>
    <canvas id="grid-canvas"></canvas>
    
    <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme">
        <svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zm1.41-13.78c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zM7.28 17.28c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29z"/></svg>
    </button>

    <button class="mobile-nav-toggle" aria-label="Menu"><span></span><span></span></button>
    
    <a href="<?php echo home_url(); ?>" class="mobile-logo">
        <?php echo get_theme_mod('mobile_logo_text', 'NRS'); ?>
    </a>

    <?php 
    // Fetch menu items dynamically
    $menu_items = [];
    $locations = get_nav_menu_locations();
    
    if ( isset( $locations['primary'] ) ) {
        $menu_obj = wp_get_nav_menu_object( $locations['primary'] );
        if($menu_obj) {
            $menu_items = wp_get_nav_menu_items( $menu_obj->term_id );
        }
    }
    
    // Auto-populate if no menu is assigned yet
    if ( empty( $menu_items ) ) {
        if ( function_exists( 'nischhal_get_default_menu_items' ) ) {
            $menu_items = nischhal_get_default_menu_items();
        }
    }

    // Active State Logic
    $queried_id = get_queried_object_id();
    global $wp;
    $current_url = home_url( add_query_arg( array(), $wp->request ) );
    
    function nischhal_is_active($item, $qid, $curr_url) {
        if ( isset($item->object_id) && $item->object_id == $qid ) return true;
        if ( is_front_page() && $item->url == home_url('/') ) return true;
        if ( rtrim($item->url, '/') == rtrim($curr_url, '/') ) return true;
        return false;
    }
    ?>

    <!-- Mobile Menu -->
    <div class="mobile-nav-overlay">
        <nav class="mobile-nav-links">
            <?php foreach($menu_items as $item): 
                $active = nischhal_is_active($item, $queried_id, $current_url) ? 'active' : '';
            ?>
                <a href="<?php echo esc_url($item->url); ?>" class="mobile-link <?php echo $active; ?>">
                    <?php echo esc_html($item->title); ?>
                </a>
            <?php endforeach; ?>
        </nav>
    </div>

    <!-- Desktop Nav -->
    <nav class="nav-wrapper">
      <div class="nav-pill">
        <div class="nav-glider"></div>
        <?php foreach($menu_items as $item): 
            $active = nischhal_is_active($item, $queried_id, $current_url) ? 'active' : '';
        ?>
            <a href="<?php echo esc_url($item->url); ?>" class="nav-link <?php echo $active; ?>">
                <?php echo esc_html($item->title); ?>
            </a>
        <?php endforeach; ?>
      </div>
    </nav>
