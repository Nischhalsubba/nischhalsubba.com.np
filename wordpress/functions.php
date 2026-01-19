<?php
/**
 * Nischhal Portfolio - Core Functions
 * Version: 6.0 (The "Power User" Edition)
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

// --- 2. CUSTOM POST TYPES (Dashboard Sidebar Items) ---
function nischhal_register_cpts() {
    
    // A. PROJECTS (Work)
    register_post_type( 'project', array(
        'labels' => array( 'name' => 'Projects', 'singular_name' => 'Project', 'menu_name' => 'Projects' ),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-art',
        'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'rewrite' => array( 'slug' => 'work' ),
        'show_in_rest' => true // Enables Block Editor
    ));
    register_taxonomy( 'project_category', 'project', array( 'labels' => array('name'=>'Categories'), 'hierarchical'=>true, 'show_in_rest'=>true ) );

    // B. PRODUCTS
    register_post_type( 'product', array(
        'labels' => array( 'name' => 'Products', 'singular_name' => 'Product', 'menu_name' => 'Products' ),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-cart',
        'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ), // Custom field 'price' etc.
        'show_in_rest' => true
    ));

    // C. TESTIMONIALS
    register_post_type( 'testimonial', array(
        'labels' => array( 'name' => 'Testimonials', 'singular_name' => 'Testimonial', 'menu_name' => 'Testimonials' ),
        'public' => true,
        'menu_icon' => 'dashicons-format-quote',
        'supports' => array( 'title', 'editor', 'custom-fields' ), // Title = Author Name, Content = Quote, Custom Field = Role
        'show_in_rest' => true
    ));
}
add_action( 'init', 'nischhal_register_cpts' );

// Rename "Posts" to "Blogs"
function nischhal_rename_posts_menu() {
    global $menu;
    global $submenu;
    $menu[5][0] = 'Blogs';
    $submenu['edit.php'][5][0] = 'All Blogs';
    $submenu['edit.php'][10][0] = 'Add Blog';
}
add_action( 'admin_menu', 'nischhal_rename_posts_menu' );

// --- 3. ENQUEUE ASSETS ---
function nischhal_enqueue_scripts() {
    // Fonts
    $h_font = get_theme_mod('typo_heading_family', 'Playfair Display');
    $b_font = get_theme_mod('typo_body_family', 'Inter');
    $weights = get_theme_mod('typo_weights', '300;400;500;600;700'); 
    
    $fonts_url = "https://fonts.googleapis.com/css2?family=" . urlencode($h_font) . ":wght@" . $weights . "&family=" . urlencode($b_font) . ":wght@" . $weights . "&display=swap";
    wp_enqueue_style( 'nischhal-google-fonts', $fonts_url, array(), null );

    // Styles & JS
    wp_enqueue_style( 'main-style', get_stylesheet_uri(), array(), '6.0' );
    wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), null, true );
    wp_enqueue_script( 'gsap-st', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap'), null, true );
    wp_enqueue_script( 'theme-js', get_template_directory_uri() . '/js/main.js', array('gsap'), '6.0', true );

    // Config for JS
    wp_localize_script( 'theme-js', 'themeConfig', array(
        'animSpeed' => get_theme_mod('motion_speed', 1.0),
        'enableCursor' => get_theme_mod('cursor_enable', true),
        'cursorStyle' => get_theme_mod('cursor_style', 'classic'),
        'cursorText' => get_theme_mod('cursor_text', 'OPEN'),
        'enableGrid' => get_theme_mod('grid_enable', true),
        'gridOpacity' => get_theme_mod('grid_opacity', 0.05),
        'gridSpotlight' => get_theme_mod('grid_spotlight', true),
    ));
}
add_action( 'wp_enqueue_scripts', 'nischhal_enqueue_scripts' );

// --- 4. CUSTOMIZER ---
function nischhal_customize_register( $wp_customize ) {
    
    // PANEL: INTERACTION
    $wp_customize->add_panel( 'panel_interaction', array( 'title' => '⚡ Interaction & Cursors', 'priority' => 20 ) );
    
    // Section: Custom Cursor
    $wp_customize->add_section( 'sec_cursor', array( 'title' => 'Custom Cursor Settings', 'panel' => 'panel_interaction' ) );
    
    $wp_customize->add_setting( 'cursor_enable', array( 'default' => true ) );
    $wp_customize->add_control( 'cursor_enable', array( 'label' => 'Enable Custom Cursor', 'section' => 'sec_cursor', 'type' => 'checkbox' ) );
    
    $cursor_styles = array(
        'classic'   => '1. Classic (Ring & Dot)',
        'dot'       => '2. Minimal Dot',
        'outline'   => '3. Minimal Outline',
        'blend'     => '4. Blend Mode (Invert Colors)',
        'trail'     => '5. Comet Trail',
        'magnetic'  => '6. Magnetic (Sticks to Buttons)',
        'fluid'     => '7. Fluid (Organic Shape)',
        'glitch'    => '8. Cyber Glitch',
        'focus'     => '9. Focus Ring (Pulsing)',
        'spotlight' => '10. Spotlight (Large Flashlight)'
    );
    
    $wp_customize->add_setting( 'cursor_style', array( 'default' => 'classic' ) );
    $wp_customize->add_control( 'cursor_style', array( 
        'label' => 'Select Premium Cursor Style', 
        'section' => 'sec_cursor', 
        'type' => 'select',
        'choices' => $cursor_styles
    ));
    
    $wp_customize->add_setting( 'cursor_text', array( 'default' => 'VIEW' ) );
    $wp_customize->add_control( 'cursor_text', array( 'label' => 'Hover Text (for Images)', 'section' => 'sec_cursor', 'type' => 'text' ) );

    // Section: Background Grid
    $wp_customize->add_section( 'sec_grid', array( 'title' => 'Background Grid', 'panel' => 'panel_interaction' ) );
    $wp_customize->add_setting( 'grid_enable', array( 'default' => true ) );
    $wp_customize->add_control( 'grid_enable', array( 'label' => 'Show Grid', 'section' => 'sec_grid', 'type' => 'checkbox' ) );
    $wp_customize->add_setting( 'grid_spotlight', array( 'default' => true ) );
    $wp_customize->add_control( 'grid_spotlight', array( 'label' => 'Mouse Spotlight Effect', 'section' => 'sec_grid', 'type' => 'checkbox' ) );
    $wp_customize->add_setting( 'grid_opacity', array( 'default' => 0.05 ) );
    $wp_customize->add_control( 'grid_opacity', array( 'label' => 'Grid Opacity', 'section' => 'sec_grid', 'type' => 'number', 'input_attrs'=>array('step'=>0.01,'min'=>0,'max'=>1) ) );

    // Other settings (Colors, Fonts, Hero) retained...
    // (Previous color/font settings code here for brevity, assuming existing structure remains)
    $wp_customize->add_panel( 'panel_colors', array( 'title' => '🎨 Design: Colors', 'priority' => 23 ) );
    $wp_customize->add_section( 'sec_colors_dark', array( 'title' => 'Dark Theme', 'panel' => 'panel_colors' ) );
    $wp_customize->add_section( 'sec_colors_light', array( 'title' => 'Light Theme', 'panel' => 'panel_colors' ) );
    
    // Add minimal color controls for functionality
    $wp_customize->add_setting('dark_bg', array('default'=>'#050505'));
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'dark_bg', array('label'=>'Dark Background', 'section'=>'sec_colors_dark')));
    $wp_customize->add_setting('light_bg', array('default'=>'#FFFFFF'));
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'light_bg', array('label'=>'Light Background', 'section'=>'sec_colors_light')));
}
add_action( 'customize_register', 'nischhal_customize_register' );

// --- 5. CSS VARS ---
function nischhal_customizer_css() {
    ?>
    <style>
        :root {
            --font-serif: "<?php echo get_theme_mod('typo_heading_family', 'Playfair Display'); ?>", serif;
            --font-sans: "<?php echo get_theme_mod('typo_body_family', 'Inter'); ?>", sans-serif;
            --bg-root: <?php echo get_theme_mod('dark_bg', '#050505'); ?>;
        }
        [data-theme="light"] {
            --bg-root: <?php echo get_theme_mod('light_bg', '#FFFFFF'); ?>;
        }
    </style>
    <?php
}
add_action( 'wp_head', 'nischhal_customizer_css' );

// --- 6. CUSTOM BLOCK PATTERNS (The "UI Kit") ---
function nischhal_register_patterns() {
    register_block_pattern_category( 'nischhal-blocks', array( 'label' => '⚡ Nischhal Custom Blocks' ) );

    // 1. Hero: Center Big
    register_block_pattern('nischhal/hero-center', array(
        'title' => 'Hero: Center Big Typography',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"150px","bottom":"150px"}}},"layout":{"type":"constrained"}} --><div class="wp-block-group alignfull" style="padding-top:150px;padding-bottom:150px"><!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(3.5rem, 8vw, 6rem)","lineHeight":"1"}}} --><h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(3.5rem, 8vw, 6rem);line-height:1">Digital<br>Experience.</h1><!-- /wp:heading --><!-- wp:paragraph {"align":"center","className":"body-large"} --><p class="has-text-align-center body-large">Crafting meaningful connections through design.</p><!-- /wp:paragraph --><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} --><div class="wp-block-buttons"><!-- wp:button {"className":"btn-primary"} --><div class="wp-block-button btn-primary"><a class="wp-block-button__link wp-element-button">View Work</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:group -->'
    ));

    // 2. Hero: Split Image
    register_block_pattern('nischhal/hero-split', array(
        'title' => 'Hero: Split with Image',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":"60px"}}} --><div class="wp-block-columns alignwide"><!-- wp:column {"verticalAlignment":"center"} --><div class="wp-block-column is-vertically-aligned-center"><!-- wp:heading {"level":1,"style":{"typography":{"fontSize":"4rem"}}} --><h1 class="wp-block-heading" style="font-size:4rem">Hello,<br>I build systems.</h1><!-- /wp:heading --><!-- wp:paragraph --> <p>Specializing in enterprise UX and design systems.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column {"verticalAlignment":"center"} --><div class="wp-block-column is-vertically-aligned-center"><!-- wp:image {"sizeSlug":"large","linkDestination":"none","className":"img-blend-gradient"} --><figure class="wp-block-image size-large img-blend-gradient"><img src="https://placehold.co/600x600/1a1a1a/FFF" alt=""/></figure><!-- /wp:image --></div><!-- /wp:column --></div><!-- /wp:columns -->'
    ));

    // 3. Stats Strip
    register_block_pattern('nischhal/stats-strip', array(
        'title' => 'Stats: Simple Strip',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"align":"full","style":{"border":{"top":{"color":"var(--border-faint)","width":"1px"},"bottom":{"color":"var(--border-faint)","width":"1px"}},"spacing":{"padding":{"top":"60px","bottom":"60px"}}}} --><div class="wp-block-group alignfull" style="border-top-color:var(--border-faint);border-top-width:1px;border-bottom-color:var(--border-faint);border-bottom-width:1px;padding-top:60px;padding-bottom:60px"><!-- wp:columns {"align":"wide"} --><div class="wp-block-columns alignwide"><!-- wp:column {"style":{"typography":{"textAlign":"center"}}} --><div class="wp-block-column has-text-align-center"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"3rem"}}} --><h3 class="wp-block-heading" style="font-size:3rem">5+</h3><!-- /wp:heading --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">Years Exp</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column {"style":{"typography":{"textAlign":"center"}}} --><div class="wp-block-column has-text-align-center"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"3rem"}}} --><h3 class="wp-block-heading" style="font-size:3rem">50+</h3><!-- /wp:heading --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">Projects</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column {"style":{"typography":{"textAlign":"center"}}} --><div class="wp-block-column has-text-align-center"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"3rem"}}} --><h3 class="wp-block-heading" style="font-size:3rem">100%</h3><!-- /wp:heading --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">Delivery Rate</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->'
    ));

    // 4. Feature: Grid 3 Col
    register_block_pattern('nischhal/feature-grid', array(
        'title' => 'Features: 3 Column Grid',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"align":"wide","className":"section-container"} --><div class="wp-block-group alignwide section-container"><!-- wp:columns {"style":{"spacing":{"blockGap":"40px"}}} --><div class="wp-block-columns"><!-- wp:column --> <div class="wp-block-column"><!-- wp:heading {"level":4} --><h4 class="wp-block-heading">Strategy</h4><!-- /wp:heading --><!-- wp:paragraph --><p>Deep dive into product requirements and user needs.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":4} --><h4 class="wp-block-heading">Design</h4><!-- /wp:heading --><!-- wp:paragraph --><p>Pixel perfect UI execution with Figma.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":4} --><h4 class="wp-block-heading">Development</h4><!-- /wp:heading --><!-- wp:paragraph --><p>Handing over clean, scalable code.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->'
    ));

    // 5. Text: Pull Quote
    register_block_pattern('nischhal/text-quote', array(
        'title' => 'Text: Large Quote',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:quote {"className":"is-style-large"} --><blockquote class="wp-block-quote is-style-large"><p>"Design is not just what it looks like and feels like. Design is how it works."</p><cite>Steve Jobs</cite></blockquote><!-- /wp:quote -->'
    ));

    // 6. Content: Image + Text Side by Side
    register_block_pattern('nischhal/content-side', array(
        'title' => 'Content: Image Left, Text Right',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":"60px"}}} --><div class="wp-block-columns alignwide"><!-- wp:column --> <div class="wp-block-column"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="https://placehold.co/600x400/222/fff" alt=""/></figure><!-- /wp:image --></div><!-- /wp:column --><!-- wp:column {"verticalAlignment":"center"} --><div class="wp-block-column is-vertically-aligned-center"><!-- wp:heading --> <h2 class="wp-block-heading">About the process</h2><!-- /wp:heading --><!-- wp:paragraph --><p>We start with understanding the core problem. Then we iterate through wireframes before moving to high fidelity.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns -->'
    ));

    // 7. CTA: Footer Style
    register_block_pattern('nischhal/cta-footer', array(
        'title' => 'CTA: Simple Footer',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"style":{"spacing":{"padding":{"top":"100px","bottom":"100px"}}},"layout":{"type":"constrained"}} --><div class="wp-block-group" style="padding-top:100px;padding-bottom:100px"><!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"4rem"}}} --><h2 class="wp-block-heading has-text-align-center" style="font-size:4rem">Let\'s work together.</h2><!-- /wp:heading --><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} --><div class="wp-block-buttons"><!-- wp:button {"className":"btn-primary"} --><div class="wp-block-button btn-primary"><a class="wp-block-button__link wp-element-button">Get in touch</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:group -->'
    ));

    // 8. FAQ Accordion
    register_block_pattern('nischhal/faq', array(
        'title' => 'FAQ: Accordion List',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"className":"section-container"} --><div class="wp-block-group section-container"><!-- wp:heading {"textAlign":"center"} --><h2 class="wp-block-heading has-text-align-center">FAQ</h2><!-- /wp:heading --><!-- wp:details {"showContent":true} --><details class="wp-block-details" open><summary>What is your hourly rate?</summary><p>I usually work on a project basis to ensure value delivery.</p></details><!-- /wp:details --><!-- wp:details --> <details class="wp-block-details"><summary>Do you do coding?</summary><p>Yes, I can implement designs in HTML/CSS/React.</p></details><!-- /wp:details --></div><!-- /wp:group -->'
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