
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

    <?php 
    // Fetch menu items for dynamic rendering
    $menu_items = [];
    $locations = get_nav_menu_locations();
    if ( isset( $locations['primary'] ) ) {
        $menu_obj = wp_get_nav_menu_object( $locations['primary'] );
        if($menu_obj) {
            $menu_items = wp_get_nav_menu_items( $menu_obj->term_id );
        }
    }
    
    // Fallback if no menu assigned
    if ( empty( $menu_items ) ) {
        // Fallback array for demo purposes if menu isn't set up in WP yet
        $fallback_items = [
            (object)['url' => home_url(), 'title' => 'Home', 'object_id' => get_option('page_on_front'), 'object' => 'page', 'type' => 'post_type_archive'],
            (object)['url' => home_url('/work'), 'title' => 'Work', 'object_id' => 0, 'object' => 'custom', 'type' => 'custom'],
            (object)['url' => home_url('/about'), 'title' => 'About', 'object_id' => 0, 'object' => 'custom', 'type' => 'custom'],
            (object)['url' => home_url('/blog'), 'title' => 'Writing', 'object_id' => 0, 'object' => 'custom', 'type' => 'custom'],
            (object)['url' => home_url('/contact'), 'title' => 'Contact', 'object_id' => 0, 'object' => 'custom', 'type' => 'custom'],
        ];
        $menu_items = $fallback_items;
    }
    ?>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-nav-overlay">
        <nav class="mobile-nav-links">
            <?php foreach($menu_items as $item): 
                $active_class = '';
                // Simple active check logic
                if ( (is_front_page() && $item->url == home_url('/')) || 
                     (trim($item->url, '/') == trim("http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]", '/')) ) {
                    $active_class = 'active';
                }
            ?>
                <a href="<?php echo esc_url($item->url); ?>" class="<?php echo esc_attr($active_class); ?>">
                    <?php echo esc_html($item->title); ?>
                </a>
            <?php endforeach; ?>
        </nav>
    </div>

    <!-- Desktop Nav Pill -->
    <nav class="nav-wrapper">
      <div class="nav-pill">
        <div class="nav-glider"></div>
        <?php foreach($menu_items as $item): 
            $active_class = '';
            // Logic to check active state more robustly
            $current_url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
            if ( $item->url == home_url('/') && is_front_page() ) {
                $active_class = 'active';
            } elseif ( $item->url != home_url('/') && strpos($current_url, $item->url) !== false ) {
                $active_class = 'active';
            }
        ?>
            <a href="<?php echo esc_url($item->url); ?>" class="nav-link <?php echo esc_attr($active_class); ?>">
                <?php echo esc_html($item->title); ?>
            </a>
        <?php endforeach; ?>
      </div>
    </nav>
