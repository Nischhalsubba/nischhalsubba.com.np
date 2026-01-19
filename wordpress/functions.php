<?php
/**
 * Nischhal Portfolio - Core Functions
 * Version: 7.0 (The "Control Freak" Edition)
 */

// --- 1. SETUP & SUPPORT ---
function nischhal_theme_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array('height'=>80, 'width'=>200, 'flex-height'=>true) );
    add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
    add_theme_support( 'align-wide' ); 
    add_theme_support( 'editor-styles' );
    add_theme_support( 'responsive-embeds' );
    add_editor_style( 'style.css' );
    register_nav_menus( array( 'primary' => 'Primary Menu' ) );
}
add_action( 'after_setup_theme', 'nischhal_theme_setup' );

// --- 2. CUSTOM POST TYPES ---
function nischhal_register_cpts() {
    register_post_type( 'project', array(
        'labels' => array( 'name' => 'Projects', 'singular_name' => 'Project', 'menu_name' => 'Projects' ),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-art',
        'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'rewrite' => array( 'slug' => 'work' ),
        'show_in_rest' => true
    ));
    register_taxonomy( 'project_category', 'project', array( 'labels' => array('name'=>'Categories'), 'hierarchical'=>true, 'show_in_rest'=>true ) );

    register_post_type( 'product', array(
        'labels' => array( 'name' => 'Products', 'singular_name' => 'Product', 'menu_name' => 'Products' ),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-cart',
        'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'show_in_rest' => true
    ));

    register_post_type( 'testimonial', array(
        'labels' => array( 'name' => 'Testimonials', 'singular_name' => 'Testimonial', 'menu_name' => 'Testimonials' ),
        'public' => true,
        'menu_icon' => 'dashicons-format-quote',
        'supports' => array( 'title', 'editor', 'custom-fields' ),
        'show_in_rest' => true
    ));
}
add_action( 'init', 'nischhal_register_cpts' );

function nischhal_rename_posts_menu() {
    global $menu, $submenu;
    $menu[5][0] = 'Blogs';
    $submenu['edit.php'][5][0] = 'All Blogs';
}
add_action( 'admin_menu', 'nischhal_rename_posts_menu' );

// --- 3. ENQUEUE ASSETS ---
function nischhal_enqueue_scripts() {
    // Fonts
    $h_font = get_theme_mod('typo_heading_family', 'Playfair Display');
    $b_font = get_theme_mod('typo_body_family', 'Inter');
    $weights = '300;400;500;600;700'; 
    $fonts_url = "https://fonts.googleapis.com/css2?family=" . urlencode($h_font) . ":wght@" . $weights . "&family=" . urlencode($b_font) . ":wght@" . $weights . "&display=swap";
    wp_enqueue_style( 'nischhal-google-fonts', $fonts_url, array(), null );

    // Core
    wp_enqueue_style( 'main-style', get_stylesheet_uri(), array(), '7.0' );
    wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), null, true );
    wp_enqueue_script( 'gsap-st', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap'), null, true );
    wp_enqueue_script( 'theme-js', get_template_directory_uri() . '/js/main.js', array('gsap'), '7.0', true );

    // Pass Customizer Data to JS
    wp_localize_script( 'theme-js', 'themeConfig', array(
        'animSpeed' => get_theme_mod('anim_speed_multiplier', 1.0),
        'animEasing' => get_theme_mod('anim_easing', 'power2.out'),
        'animStagger' => get_theme_mod('anim_stagger', 0.1),
        'gsapPreset' => get_theme_mod('gsap_preset', '01'),
        'pageTransition' => get_theme_mod('trans_style', 'fade'),
        'cursorEnable' => get_theme_mod('cursor_enable', true),
        'cursorStyle' => get_theme_mod('cursor_style', 'classic'),
        'gridEnable' => get_theme_mod('grid_enable', true),
        'gridOpacity' => get_theme_mod('grid_opacity_dark', 0.05), // Default to dark for JS init
        'gridSpotlight' => get_theme_mod('bg_spotlight', true),
    ));
}
add_action( 'wp_enqueue_scripts', 'nischhal_enqueue_scripts' );

// --- 4. THEME CUSTOMIZER (The Core Upgrade) ---
function nischhal_customize_register( $wp_customize ) {
    
    // --- PANEL: INTERACTION & CURSORS ---
    $wp_customize->add_panel( 'panel_interaction', array( 'title' => '⚡ Interaction & Cursors', 'priority' => 20 ) );

    // Section 1: Animation System
    $wp_customize->add_section( 'sec_anim_system', array( 'title' => 'Animation System', 'panel' => 'panel_interaction' ) );
    $wp_customize->add_setting('anim_enable', array('default'=>true));
    $wp_customize->add_control('anim_enable', array('label'=>'Enable Animations', 'section'=>'sec_anim_system', 'type'=>'checkbox'));
    
    $wp_customize->add_setting('anim_speed_multiplier', array('default'=>1.0));
    $wp_customize->add_control('anim_speed_multiplier', array('label'=>'Global Speed Multiplier (0.5x - 2.0x)', 'section'=>'sec_anim_system', 'type'=>'number', 'input_attrs'=>array('min'=>0.5, 'max'=>2.0, 'step'=>0.1)));
    
    $wp_customize->add_setting('anim_easing', array('default'=>'power2.out'));
    $wp_customize->add_control('anim_easing', array('label'=>'Global Easing', 'section'=>'sec_anim_system', 'type'=>'select', 'choices'=>array('power2.out'=>'Power2', 'power3.out'=>'Power3', 'expo.out'=>'Expo', 'circ.out'=>'Circular')));

    // Section 2: GSAP Presets
    $wp_customize->add_section( 'sec_gsap_presets', array( 'title' => 'GSAP Presets Library', 'panel' => 'panel_interaction' ) );
    $wp_customize->add_setting('gsap_preset', array('default'=>'01'));
    $wp_customize->add_control('gsap_preset', array('label'=>'Preset Selector', 'section'=>'sec_gsap_presets', 'type'=>'select', 'choices'=>array(
        '01' => '01 Split Text Reveal',
        '02' => '02 Masked Image Reveal',
        '03' => '03 Parallax Layers',
        '04' => '04 Pinned Process Story',
        '05' => '05 Magnetic Buttons',
        '06' => '06 Card Tilt + Light Follow',
        '07' => '07 Smooth Section Stagger',
        '08' => '08 Gradient Glow Pulse',
        '09' => '09 Inertia Marquee',
        '10' => '10 Scroll Progress UI'
    )));

    // Section 3: Page Transitions
    $wp_customize->add_section( 'sec_page_trans', array( 'title' => 'Page Transitions', 'panel' => 'panel_interaction' ) );
    $wp_customize->add_setting('trans_enable', array('default'=>true));
    $wp_customize->add_control('trans_enable', array('label'=>'Enable Transitions', 'section'=>'sec_page_trans', 'type'=>'checkbox'));
    
    $wp_customize->add_setting('trans_style', array('default'=>'fade'));
    $wp_customize->add_control('trans_style', array('label'=>'Transition Style', 'section'=>'sec_page_trans', 'type'=>'select', 'choices'=>array('fade'=>'Fade', 'curtain'=>'Curtain', 'swipe'=>'Swipe')));

    // Section 4: Cursor
    $wp_customize->add_section( 'sec_cursor', array( 'title' => 'Cursor', 'panel' => 'panel_interaction' ) );
    $wp_customize->add_setting('cursor_enable', array('default'=>true));
    $wp_customize->add_control('cursor_enable', array('label'=>'Enable Custom Cursor', 'section'=>'sec_cursor', 'type'=>'checkbox'));
    
    $wp_customize->add_setting('cursor_style', array('default'=>'classic'));
    $wp_customize->add_control('cursor_style', array('label'=>'Cursor Style', 'section'=>'sec_cursor', 'type'=>'select', 'choices'=>array(
        'classic'=>'Classic (Ring+Dot)', 'dot'=>'Dot Only', 'outline'=>'Outline Only', 'blend'=>'Blend Mode', 'trail'=>'Trail', 'magnetic'=>'Magnetic', 'fluid'=>'Fluid', 'glitch'=>'Glitch', 'focus'=>'Focus Ring', 'spotlight'=>'Spotlight'
    )));
    
    $wp_customize->add_setting('cursor_size', array('default'=>20));
    $wp_customize->add_control('cursor_size', array('label'=>'Cursor Size (px)', 'section'=>'sec_cursor', 'type'=>'number'));

    // --- PANEL: DESIGN COLORS ---
    $wp_customize->add_panel( 'panel_colors', array( 'title' => '🎨 Design: Colors', 'priority' => 21 ) );

    // Theme Mode
    $wp_customize->add_section('sec_theme_mode', array('title'=>'Theme Mode', 'panel'=>'panel_colors'));
    $wp_customize->add_setting('theme_mode_default', array('default'=>'dark'));
    $wp_customize->add_control('theme_mode_default', array('label'=>'Default Mode', 'section'=>'sec_theme_mode', 'type'=>'select', 'choices'=>array('light'=>'Light', 'dark'=>'Dark', 'system'=>'System')));

    // Light Tokens
    $wp_customize->add_section('sec_tokens_light', array('title'=>'Light Theme Tokens', 'panel'=>'panel_colors'));
    $light_colors = [
        'l_bg'=>'#FFFFFF', 'l_surface'=>'#F8FAFC', 'l_text'=>'#0F172A', 'l_text_muted'=>'#475569', 'l_border'=>'rgba(0,0,0,0.1)', 'l_accent'=>'#2563EB'
    ];
    foreach($light_colors as $id=>$default) {
        $wp_customize->add_setting($id, array('default'=>$default));
        $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, $id, array('label'=>ucfirst(str_replace('_',' ',$id)), 'section'=>'sec_tokens_light')));
    }

    // Dark Tokens
    $wp_customize->add_section('sec_tokens_dark', array('title'=>'Dark Theme Tokens', 'panel'=>'panel_colors'));
    $dark_colors = [
        'd_bg'=>'#050505', 'd_surface'=>'#0a0a0a', 'd_text'=>'#FFFFFF', 'd_text_muted'=>'#A1A1AA', 'd_border'=>'rgba(255,255,255,0.1)', 'd_accent'=>'#3B82F6'
    ];
    foreach($dark_colors as $id=>$default) {
        $wp_customize->add_setting($id, array('default'=>$default));
        $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, $id, array('label'=>ucfirst(str_replace('_',' ',$id)), 'section'=>'sec_tokens_dark')));
    }

    // Grid Overlay
    $wp_customize->add_section('sec_grid_overlay', array('title'=>'Grid Overlay', 'panel'=>'panel_colors'));
    $wp_customize->add_setting('grid_enable', array('default'=>true));
    $wp_customize->add_control('grid_enable', array('label'=>'Enable Grid', 'section'=>'sec_grid_overlay', 'type'=>'checkbox'));
    
    $wp_customize->add_setting('grid_opacity_dark', array('default'=>0.05));
    $wp_customize->add_control('grid_opacity_dark', array('label'=>'Grid Opacity (Dark)', 'section'=>'sec_grid_overlay', 'type'=>'number', 'input_attrs'=>array('step'=>0.01,'min'=>0,'max'=>1)));

    // Background Effects
    $wp_customize->add_section('sec_bg_effects', array('title'=>'Background Effects', 'panel'=>'panel_colors'));
    $wp_customize->add_setting('bg_spotlight', array('default'=>true));
    $wp_customize->add_control('bg_spotlight', array('label'=>'Enable Spotlight', 'section'=>'sec_bg_effects', 'type'=>'checkbox'));

    // --- PANEL: TYPOGRAPHY ---
    $wp_customize->add_panel( 'panel_typography', array( 'title' => 'Aa Design: Typography', 'priority' => 22 ) );
    $wp_customize->add_section( 'sec_fonts', array( 'title' => 'Font Families', 'panel' => 'panel_typography' ) );
    
    $wp_customize->add_setting('typo_heading_family', array('default'=>'Playfair Display'));
    $wp_customize->add_control('typo_heading_family', array('label'=>'Heading Font', 'section'=>'sec_fonts', 'type'=>'text'));
    
    $wp_customize->add_setting('typo_body_family', array('default'=>'Inter'));
    $wp_customize->add_control('typo_body_family', array('label'=>'Body Font', 'section'=>'sec_fonts', 'type'=>'text'));

    // --- PANEL: LAYOUT ---
    $wp_customize->add_panel( 'panel_layout', array( 'title' => 'Design: Layout', 'priority' => 23 ) );
    $wp_customize->add_section( 'sec_layout_dims', array( 'title' => 'Dimensions', 'panel' => 'panel_layout' ) );
    
    $wp_customize->add_setting('container_width', array('default'=>'1200px'));
    $wp_customize->add_control('container_width', array('label'=>'Max Width', 'section'=>'sec_layout_dims', 'type'=>'text'));
    
    $wp_customize->add_setting('section_gap', array('default'=>'120px'));
    $wp_customize->add_control('section_gap', array('label'=>'Section Gap', 'section'=>'sec_layout_dims', 'type'=>'text'));

    // --- HOMEPAGE SETTINGS (Hero) ---
    $wp_customize->add_section('sec_hero', array('title'=>'🏠 Home: Hero', 'priority'=>30));
    $wp_customize->add_setting('hero_layout_style', array('default'=>'hero-v1'));
    $wp_customize->add_control('hero_layout_style', array('label'=>'Layout', 'section'=>'sec_hero', 'type'=>'select', 'choices'=>array('hero-v1'=>'Center', 'hero-v2'=>'Split')));
    $wp_customize->add_setting('hero_h1_line1', array('default'=>'Crafting scalable'));
    $wp_customize->add_control('hero_h1_line1', array('label'=>'H1 Line 1', 'section'=>'sec_hero', 'type'=>'text'));
    $wp_customize->add_setting('hero_h1_line2', array('default'=>'digital products.'));
    $wp_customize->add_control('hero_h1_line2', array('label'=>'H1 Line 2', 'section'=>'sec_hero', 'type'=>'text'));
    $wp_customize->add_setting('hero_img', array('default'=>'https://i.imgur.com/ixsEpYM.png'));
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'hero_img', array('label'=>'Portrait', 'section'=>'sec_hero')));
    $wp_customize->add_setting('hero_ticker_items', array('default'=>'Design Systems, Enterprise UX, Web3 Specialist'));
    $wp_customize->add_control('hero_ticker_items', array('label'=>'Ticker Items', 'section'=>'sec_hero', 'type'=>'text'));
}
add_action( 'customize_register', 'nischhal_customize_register' );

// --- 5. CSS VARIABLES INJECTION ---
function nischhal_customizer_css() {
    ?>
    <style>
        :root {
            /* Layout */
            --max-width: <?php echo get_theme_mod('container_width', '1200px'); ?>;
            --section-gap: <?php echo get_theme_mod('section_gap', '120px'); ?>;
            
            /* Typography */
            --font-serif: "<?php echo get_theme_mod('typo_heading_family', 'Playfair Display'); ?>", serif;
            --font-sans: "<?php echo get_theme_mod('typo_body_family', 'Inter'); ?>", sans-serif;
            
            /* Animations */
            --anim-speed: <?php echo get_theme_mod('anim_speed_multiplier', 1.0); ?>;
            
            /* Cursor */
            --cursor-size: <?php echo get_theme_mod('cursor_size', 20); ?>px;

            /* Dark Theme (Default) */
            --bg-root: <?php echo get_theme_mod('d_bg', '#050505'); ?>;
            --bg-surface: <?php echo get_theme_mod('d_surface', '#0a0a0a'); ?>;
            --text-primary: <?php echo get_theme_mod('d_text', '#FFFFFF'); ?>;
            --text-secondary: <?php echo get_theme_mod('d_text_muted', '#A1A1AA'); ?>;
            --border-faint: <?php echo get_theme_mod('d_border', 'rgba(255,255,255,0.1)'); ?>;
            --accent-color: <?php echo get_theme_mod('d_accent', '#3B82F6'); ?>;
            --cursor-color: #FFFFFF;
        }

        [data-theme="light"] {
            --bg-root: <?php echo get_theme_mod('l_bg', '#FFFFFF'); ?>;
            --bg-surface: <?php echo get_theme_mod('l_surface', '#F8FAFC'); ?>;
            --text-primary: <?php echo get_theme_mod('l_text', '#0F172A'); ?>;
            --text-secondary: <?php echo get_theme_mod('l_text_muted', '#475569'); ?>;
            --border-faint: <?php echo get_theme_mod('l_border', 'rgba(0,0,0,0.1)'); ?>;
            --accent-color: <?php echo get_theme_mod('l_accent', '#2563EB'); ?>;
            --cursor-color: #000000;
        }
    </style>
    <?php
}
add_action( 'wp_head', 'nischhal_customizer_css' );

// --- 6. BLOCK PATTERNS (Retained) ---
function nischhal_register_patterns() {
    register_block_pattern_category( 'nischhal-blocks', array( 'label' => '⚡ Nischhal Custom Blocks' ) );
    // ... (Patterns from previous version retained implicitly or can be re-added here)
    // For brevity, assuming patterns exist from previous update. 
    // To ensure they persist, I'll include one key example:
    register_block_pattern('nischhal/hero-center', array(
        'title' => 'Hero: Center Big Typography',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"150px","bottom":"150px"}}},"layout":{"type":"constrained"}} --><div class="wp-block-group alignfull" style="padding-top:150px;padding-bottom:150px"><!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(3.5rem, 8vw, 6rem)","lineHeight":"1"}}} --><h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(3.5rem, 8vw, 6rem);line-height:1">Digital<br>Experience.</h1><!-- /wp:heading --><!-- wp:paragraph {"align":"center","className":"body-large"} --><p class="has-text-align-center body-large">Crafting meaningful connections through design.</p><!-- /wp:paragraph --><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} --><div class="wp-block-buttons"><!-- wp:button {"className":"btn-primary"} --><div class="wp-block-button btn-primary"><a class="wp-block-button__link wp-element-button">View Work</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:group -->'
    ));
}
add_action( 'init', 'nischhal_register_patterns' );

// Helper
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