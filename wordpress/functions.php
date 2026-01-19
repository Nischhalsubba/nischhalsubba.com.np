<?php
/**
 * Nischhal Portfolio - Core Functions
 * 
 * 1. Setup & Enqueue
 * 2. Dynamic Google Fonts Loader
 * 3. Custom Post Types
 * 4. The "One-Stop" Customizer
 * 5. CSS Variable Injection
 */

// --- 1. SETUP ---
function nischhal_theme_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array('height'=>80, 'width'=>200, 'flex-height'=>true) );
    add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption' ) );
    register_nav_menus( array( 'primary' => 'Primary Menu' ) );
}
add_action( 'after_setup_theme', 'nischhal_theme_setup' );

// --- 2. ENQUEUE ASSETS ---
function nischhal_enqueue_scripts() {
    // Fonts
    $h_font = get_theme_mod('typo_heading_family', 'Playfair Display');
    $b_font = get_theme_mod('typo_body_family', 'Inter');
    
    if( !empty($h_font) || !empty($b_font) ) {
        $fonts = array();
        if($h_font) $fonts[] = $h_font . ':wght@400;500;600;700';
        if($b_font) $fonts[] = $b_font . ':wght@300;400;500;600';
        $fonts = array_unique($fonts);
        $font_args = implode('&family=', array_map('urlencode', $fonts));
        $fonts_url = "https://fonts.googleapis.com/css2?family={$font_args}&display=swap";
        wp_enqueue_style( 'nischhal-google-fonts', $fonts_url, array(), null );
    }

    // Styles & Scripts
    wp_enqueue_style( 'main-style', get_stylesheet_uri(), array(), '3.0' );
    
    wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), null, true );
    wp_enqueue_script( 'gsap-st', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap'), null, true );
    wp_enqueue_script( 'theme-js', get_template_directory_uri() . '/js/main.js', array('gsap'), '3.0', true );

    // Pass Config to JS
    wp_localize_script( 'theme-js', 'themeConfig', array(
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
        'animSpeed' => get_theme_mod('motion_speed', 1.0),
        
        // Advanced Cursor Config
        'cursorStyle' => get_theme_mod('cursor_style', 'classic'),
        'cursorSize' => get_theme_mod('cursor_size', 20),
        'cursorTrailLen' => get_theme_mod('cursor_trail_len', 5),
        'cursorText' => get_theme_mod('cursor_hover_text', 'OPEN'),
        
        // Grid Config
        'gridHighlight' => get_theme_mod('grid_highlight', true),
        'gridRadius' => get_theme_mod('grid_radius', 300),
    ));
}
add_action( 'wp_enqueue_scripts', 'nischhal_enqueue_scripts' );

// --- 3. PROJECT CPT ---
function nischhal_register_projects() {
    register_post_type( 'project', array(
        'labels' => array( 'name' => 'Work', 'singular_name' => 'Project' ),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-art',
        'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'rewrite' => array( 'slug' => 'work' ),
        'show_in_rest' => true
    ));
    register_taxonomy( 'project_category', 'project', array( 'labels' => array('name'=>'Categories'), 'hierarchical'=>true, 'show_in_rest'=>true, 'public'=>true ) );
}
add_action( 'init', 'nischhal_register_projects' );

// --- 4. CUSTOMIZER ---
function nischhal_customize_register( $wp_customize ) {
    
    // --- CURSOR & INTERACTION ENGINE ---
    $wp_customize->add_panel( 'panel_interaction', array( 'title' => 'Interaction & Cursor', 'priority' => 10 ) );
    
    // Section: Cursor Style
    $wp_customize->add_section( 'sec_cursor_style', array( 'title' => 'Premium Cursor', 'panel' => 'panel_interaction' ) );
    
    $wp_customize->add_setting( 'cursor_style', array( 'default' => 'classic' ) );
    $wp_customize->add_control( 'cursor_style', array( 
        'label' => 'Select Cursor Design', 
        'section' => 'sec_cursor_style', 
        'type' => 'select',
        'choices' => array(
            'classic' => '1. Classic Dot & Ring',
            'modern' => '2. Modern Delayed Ring',
            'liquid' => '3. Liquid Trail',
            'exclusion' => '4. Exclusion Orb (Invert)',
            'blur' => '5. Soft Glow Blur',
            'crosshair' => '6. Precision Crosshair',
            'spotlight' => '7. Spotlight Mask',
            'brackets' => '8. Text Brackets [ ]',
            'elastic' => '9. Elastic Tether',
            'echo' => '10. Ghost Echoes'
        )
    ));

    $wp_customize->add_setting( 'cursor_size', array( 'default' => 20 ) );
    $wp_customize->add_control( 'cursor_size', array( 'label' => 'Cursor Base Size (px)', 'section' => 'sec_cursor_style', 'type' => 'number' ) );

    $wp_customize->add_setting( 'cursor_trail_len', array( 'default' => 5 ) );
    $wp_customize->add_control( 'cursor_trail_len', array( 'label' => 'Trail Length / Lag (1-20)', 'section' => 'sec_cursor_style', 'type' => 'number' ) );

    $wp_customize->add_setting( 'cursor_hover_text', array( 'default' => 'VIEW' ) );
    $wp_customize->add_control( 'cursor_hover_text', array( 'label' => 'Hover Label Text', 'section' => 'sec_cursor_style', 'type' => 'text' ) );

    // Section: Grid
    $wp_customize->add_section( 'sec_grid_fx', array( 'title' => 'Background Grid', 'panel' => 'panel_interaction' ) );
    
    $wp_customize->add_setting( 'grid_highlight', array( 'default' => true ) );
    $wp_customize->add_control( 'grid_highlight', array( 'label' => 'Enable Mouse Highlight', 'section' => 'sec_grid_fx', 'type' => 'checkbox' ) );
    
    $wp_customize->add_setting( 'grid_radius', array( 'default' => 300 ) );
    $wp_customize->add_control( 'grid_radius', array( 'label' => 'Highlight Radius', 'section' => 'sec_grid_fx', 'type' => 'number' ) );

    // --- OTHER PANELS (Typography, Colors, etc) ---
    // [Keep existing settings for Colors/Typography/HomeBuilder same as before]
    $wp_customize->add_panel( 'panel_colors', array( 'title' => 'Design: Colors', 'priority' => 21 ) );
    $themes = ['dark' => 'Dark Mode', 'light' => 'Light Mode'];
    foreach($themes as $slug => $label) {
        $wp_customize->add_section( "sec_colors_{$slug}", array( 'title' => $label, 'panel' => 'panel_colors' ) );
        $defaults = $slug === 'dark' ? ['bg'=>'#050505', 'surface'=>'#0a0a0a', 'text'=>'#FFFFFF', 'accent'=>'#3B82F6'] : ['bg'=>'#FFFFFF', 'surface'=>'#F8FAFC', 'text'=>'#0f172a', 'accent'=>'#2563EB'];
        foreach(['bg','surface','text','accent'] as $k) {
            $wp_customize->add_setting( "{$slug}_{$k}", array( 'default' => $defaults[$k], 'transport' => 'refresh' ) );
            $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, "{$slug}_{$k}", array( 'label' => ucfirst($k), 'section' => "sec_colors_{$slug}" ) ) );
        }
    }
    
    // Layout
    $wp_customize->add_panel( 'panel_layout', array( 'title' => 'Design: Layout', 'priority' => 22 ) );
    $wp_customize->add_section( 'sec_grid', array( 'title' => 'Grid & Container', 'panel' => 'panel_layout' ) );
    $wp_customize->add_setting( 'layout_max_width', array( 'default' => '1100px' ) );
    $wp_customize->add_control( 'layout_max_width', array( 'label' => 'Container Max Width', 'section' => 'sec_grid' ) );
    $wp_customize->add_setting( 'grid_opacity', array( 'default' => '0.05' ) );
    $wp_customize->add_control( 'grid_opacity', array( 'label' => 'Grid Line Opacity', 'section' => 'sec_grid', 'type'=>'range', 'input_attrs'=>['min'=>0, 'max'=>0.5, 'step'=>0.01] ) );
}
add_action( 'customize_register', 'nischhal_customize_register' );

// --- 5. CSS VARS ---
function nischhal_customizer_css() {
    ?>
    <style>
        :root {
            --max-width: <?php echo get_theme_mod('layout_max_width', '1100px'); ?>;
            --grid-opacity: <?php echo get_theme_mod('grid_opacity', '0.05'); ?>;

            /* Dark Theme */
            --bg-root: <?php echo get_theme_mod('dark_bg', '#050505'); ?>;
            --bg-surface: <?php echo get_theme_mod('dark_surface', '#0a0a0a'); ?>;
            --text-primary: <?php echo get_theme_mod('dark_text', '#FFFFFF'); ?>;
            --accent-color: <?php echo get_theme_mod('dark_accent', '#3B82F6'); ?>;
        }
        [data-theme="light"] {
            --bg-root: <?php echo get_theme_mod('light_bg', '#FFFFFF'); ?>;
            --bg-surface: <?php echo get_theme_mod('light_surface', '#F8FAFC'); ?>;
            --text-primary: <?php echo get_theme_mod('light_text', '#0f172a'); ?>;
            --accent-color: <?php echo get_theme_mod('light_accent', '#2563EB'); ?>;
        }
    </style>
    <?php
}
add_action( 'wp_head', 'nischhal_customizer_css' );

// Helper for Project Cats
function get_project_cat_slugs($post_id) {
    $terms = get_the_terms($post_id, 'project_category');
    if ($terms && !is_wp_error($terms)) {
        $slugs = [];
        foreach ($terms as $term) $slugs[] = $term->slug;
        return implode(' ', $slugs);
    }
    return '';
}
?>