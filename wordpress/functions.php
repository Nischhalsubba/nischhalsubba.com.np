<?php
/**
 * Nischhal Portfolio - Core Functions
 * Version: 5.0 (The "Zero-Code" Edition)
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
    add_editor_style( 'style.css' ); // Make editor look like frontend
    register_nav_menus( array( 'primary' => 'Primary Menu' ) );
}
add_action( 'after_setup_theme', 'nischhal_theme_setup' );

// --- 2. ENQUEUE ASSETS & CONFIG ---
function nischhal_enqueue_scripts() {
    // 1. Google Fonts
    $h_font = get_theme_mod('typo_heading_family', 'Playfair Display');
    $b_font = get_theme_mod('typo_body_family', 'Inter');
    $a_font = get_theme_mod('typo_accent_family', 'Halant'); 
    $weights = get_theme_mod('typo_weights', '300;400;500;600;700'); 
    
    $fonts = array();
    if($h_font) $fonts[] = $h_font . ':wght@' . $weights;
    if($b_font) $fonts[] = $b_font . ':wght@' . $weights;
    if($a_font) $fonts[] = $a_font . ':wght@' . $weights;
    
    if( !empty($fonts) ) {
        $fonts = array_unique($fonts);
        $font_args = implode('&family=', array_map('urlencode', $fonts));
        $fonts_url = "https://fonts.googleapis.com/css2?family={$font_args}&display=swap";
        wp_enqueue_style( 'nischhal-google-fonts', $fonts_url, array(), null );
    }

    // 2. Main Styles
    wp_enqueue_style( 'main-style', get_stylesheet_uri(), array(), '5.0' );
    
    // 3. GSAP (Animation Engine)
    wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), null, true );
    wp_enqueue_script( 'gsap-st', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap'), null, true );
    
    // 4. Theme Logic
    wp_enqueue_script( 'theme-js', get_template_directory_uri() . '/js/main.js', array('gsap'), '5.0', true );

    // 5. Pass Customizer Data to JS
    wp_localize_script( 'theme-js', 'themeConfig', array(
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
        'animSpeed' => get_theme_mod('motion_speed', 1.0),
        // Cursor Config
        'enableCursor' => get_theme_mod('cursor_enable', true),
        'cursorStyle' => get_theme_mod('cursor_style', 'classic'), // classic, dot, outline
        'cursorSize' => get_theme_mod('cursor_size', 20),
        'cursorText' => get_theme_mod('cursor_text', 'VIEW'),
        // Grid Config
        'enableGrid' => get_theme_mod('grid_enable', true),
        'gridOpacity' => get_theme_mod('grid_opacity', 0.05),
        'gridSize' => get_theme_mod('grid_size', 60),
        'gridSpotlight' => get_theme_mod('grid_spotlight', true),
    ));
}
add_action( 'wp_enqueue_scripts', 'nischhal_enqueue_scripts' );

// --- 3. THEME CUSTOMIZER (The Control Center) ---
function nischhal_customize_register( $wp_customize ) {
    
    // --- PANEL: LAYOUT ---
    $wp_customize->add_panel( 'panel_layout', array( 'title' => '⚡ Design: Interaction & Layout', 'priority' => 20 ) );
    
    // Section: Cursor
    $wp_customize->add_section( 'sec_cursor', array( 'title' => 'Custom Cursor', 'panel' => 'panel_layout' ) );
    $wp_customize->add_setting( 'cursor_enable', array( 'default' => true ) );
    $wp_customize->add_control( 'cursor_enable', array( 'label' => 'Enable Custom Cursor', 'section' => 'sec_cursor', 'type' => 'checkbox' ) );
    
    $wp_customize->add_setting( 'cursor_style', array( 'default' => 'classic' ) );
    $wp_customize->add_control( 'cursor_style', array( 
        'label' => 'Cursor Style', 
        'section' => 'sec_cursor', 
        'type' => 'select',
        'choices' => array('classic' => 'Ring & Dot', 'dot' => 'Simple Dot', 'outline' => 'Simple Outline')
    ));
    
    $wp_customize->add_setting( 'cursor_text', array( 'default' => 'VIEW' ) );
    $wp_customize->add_control( 'cursor_text', array( 'label' => 'Hover Text (on images)', 'section' => 'sec_cursor', 'type' => 'text' ) );

    // Section: Grid Background
    $wp_customize->add_section( 'sec_grid', array( 'title' => 'Background Grid', 'panel' => 'panel_layout' ) );
    $wp_customize->add_setting( 'grid_enable', array( 'default' => true ) );
    $wp_customize->add_control( 'grid_enable', array( 'label' => 'Show Background Grid', 'section' => 'sec_grid', 'type' => 'checkbox' ) );
    
    $wp_customize->add_setting( 'grid_spotlight', array( 'default' => true ) );
    $wp_customize->add_control( 'grid_spotlight', array( 'label' => 'Enable Mouse Spotlight', 'section' => 'sec_grid', 'type' => 'checkbox' ) );
    
    $wp_customize->add_setting( 'grid_opacity', array( 'default' => 0.05 ) );
    $wp_customize->add_control( 'grid_opacity', array( 'label' => 'Grid Opacity (0.01 - 0.2)', 'section' => 'sec_grid', 'type' => 'number', 'input_attrs' => array('min'=>0.01, 'max'=>0.2, 'step'=>0.01) ) );

    $wp_customize->add_setting( 'container_max_width', array( 'default' => '1200px' ) );
    $wp_customize->add_control( 'container_max_width', array( 'label' => 'Max Container Width', 'section' => 'sec_grid', 'type' => 'text' ) );

    // --- PANEL: TYPOGRAPHY ---
    $wp_customize->add_panel( 'panel_typography', array( 'title' => 'Aa Design: Typography', 'priority' => 22 ) );
    $wp_customize->add_section( 'sec_typo_fam', array( 'title' => 'Font Families', 'panel' => 'panel_typography' ) );
    
    $wp_customize->add_setting('typo_heading_family', array('default'=>'Playfair Display'));
    $wp_customize->add_control('typo_heading_family', array('label'=>'Heading Font (Google Name)', 'section'=>'sec_typo_fam', 'type'=>'text', 'description'=>'e.g., Roboto, Open Sans, Cormorant Garamond'));

    $wp_customize->add_setting('typo_body_family', array('default'=>'Inter'));
    $wp_customize->add_control('typo_body_family', array('label'=>'Body Font (Google Name)', 'section'=>'sec_typo_fam', 'type'=>'text'));

    // --- PANEL: COLORS ---
    $wp_customize->add_panel( 'panel_colors', array( 'title' => '🎨 Design: Colors', 'priority' => 23 ) );
    $wp_customize->add_section( 'sec_colors_dark', array( 'title' => 'Dark Theme (Default)', 'panel' => 'panel_colors' ) );
    $wp_customize->add_section( 'sec_colors_light', array( 'title' => 'Light Theme', 'panel' => 'panel_colors' ) );

    // Colors Helper
    $themes = ['dark' => 'Dark', 'light' => 'Light'];
    foreach($themes as $slug => $name) {
        $section = "sec_colors_$slug";
        $wp_customize->add_setting("{$slug}_bg", array('default'=> ($slug=='dark'?'#050505':'#FFFFFF')));
        $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, "{$slug}_bg", array('label'=>'Background', 'section'=>$section)));
        
        $wp_customize->add_setting("{$slug}_text_primary", array('default'=> ($slug=='dark'?'#FFFFFF':'#0F172A')));
        $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, "{$slug}_text_primary", array('label'=>'Primary Text', 'section'=>$section)));
        
        $wp_customize->add_setting("{$slug}_accent", array('default'=> ($slug=='dark'?'#3B82F6':'#2563EB')));
        $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, "{$slug}_accent", array('label'=>'Accent Color', 'section'=>$section)));
    }

    // --- PANEL: HOME HERO ---
    $wp_customize->add_section('sec_hero', array('title'=>'🏠 Home: Hero Section', 'priority'=>30));
    
    $wp_customize->add_setting('hero_layout_style', array('default'=>'hero-v1'));
    $wp_customize->add_control('hero_layout_style', array(
        'label'=>'Layout Variation',
        'section'=>'sec_hero',
        'type'=>'select',
        'choices'=>array(
            'hero-v1'=>'1. Center Focused (Standard)', 
            'hero-v2'=>'2. Split: Text Left / Image Right', 
            'hero-v3'=>'3. Split: Image Left / Text Right', 
            'hero-v4'=>'4. Minimal (No Image)', 
            'hero-v5'=>'5. Immersive Overlay',
            'hero-v10'=>'6. Magazine Cover (Big Title)'
        )
    ));
    
    $wp_customize->add_setting('hero_h1_line1', array('default'=>'Crafting scalable'));
    $wp_customize->add_control('hero_h1_line1', array('label'=>'Headline Line 1', 'section'=>'sec_hero', 'type'=>'text'));
    $wp_customize->add_setting('hero_h1_line2', array('default'=>'digital products.'));
    $wp_customize->add_control('hero_h1_line2', array('label'=>'Headline Line 2', 'section'=>'sec_hero', 'type'=>'text'));
    
    $wp_customize->add_setting('hero_ticker_items', array('default'=>'Design Systems, Enterprise UX, Web3 Specialist'));
    $wp_customize->add_control('hero_ticker_items', array('label'=>'Ticker Pills (comma separated)', 'section'=>'sec_hero', 'type'=>'text'));

    $wp_customize->add_setting('hero_img', array('default'=>'https://i.imgur.com/ixsEpYM.png'));
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'hero_img', array('label'=>'Portrait Image', 'section'=>'sec_hero')));

    // --- PANEL: HOME TESTIMONIALS ---
    $wp_customize->add_section('sec_testimonials', array('title'=>'💬 Home: Testimonials', 'priority'=>32));
    
    for($i=1; $i<=3; $i++) {
        $wp_customize->add_setting("testi_{$i}_quote", array('default'=>''));
        $wp_customize->add_control("testi_{$i}_quote", array('label'=>"Testimonial $i Quote", 'section'=>'sec_testimonials', 'type'=>'textarea'));
        
        $wp_customize->add_setting("testi_{$i}_author", array('default'=>''));
        $wp_customize->add_control("testi_{$i}_author", array('label'=>"Testimonial $i Author", 'section'=>'sec_testimonials', 'type'=>'text'));
        
        $wp_customize->add_setting("testi_{$i}_role", array('default'=>''));
        $wp_customize->add_control("testi_{$i}_role", array('label'=>"Testimonial $i Role/Company", 'section'=>'sec_testimonials', 'type'=>'text'));
    }
}
add_action( 'customize_register', 'nischhal_customize_register' );

// --- 4. CSS VARIABLES (Injection) ---
function nischhal_customizer_css() {
    ?>
    <style>
        :root {
            --max-width: <?php echo get_theme_mod('container_max_width', '1200px'); ?>;
            
            --font-serif: "<?php echo get_theme_mod('typo_heading_family', 'Playfair Display'); ?>", serif;
            --font-sans: "<?php echo get_theme_mod('typo_body_family', 'Inter'); ?>", sans-serif;
            
            /* DARK THEME */
            --bg-root: <?php echo get_theme_mod('dark_bg', '#050505'); ?>;
            --text-primary: <?php echo get_theme_mod('dark_text_primary', '#FFFFFF'); ?>;
            --accent-color: <?php echo get_theme_mod('dark_accent', '#3B82F6'); ?>;
        }
        [data-theme="light"] {
            --bg-root: <?php echo get_theme_mod('light_bg', '#FFFFFF'); ?>;
            --text-primary: <?php echo get_theme_mod('light_text_primary', '#0F172A'); ?>;
            --accent-color: <?php echo get_theme_mod('light_accent', '#2563EB'); ?>;
        }
    </style>
    <?php
}
add_action( 'wp_head', 'nischhal_customizer_css' );

// --- 5. REGISTER BLOCK PATTERNS (The "Zero-Code" Library) ---
// This is where we define the custom blocks.
function nischhal_register_patterns() {
    register_block_pattern_category( 'nischhal-blocks', array( 'label' => '⚡ Nischhal Theme Blocks' ) );

    // 1. HERO: SPLIT IMAGE RIGHT
    register_block_pattern('nischhal/hero-split', array(
        'title' => 'Hero: Split Content',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"100px","bottom":"100px"}}},"layout":{"type":"constrained","contentSize":"1200px"}} --><div class="wp-block-group alignfull" style="padding-top:100px;padding-bottom:100px"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":"60px"}}} --><div class="wp-block-columns alignwide"><!-- wp:column {"verticalAlignment":"center"} --><div class="wp-block-column is-vertically-aligned-center"><!-- wp:heading {"level":1,"style":{"typography":{"fontSize":"clamp(3rem, 5vw, 4.5rem)"}}} --><h1 class="wp-block-heading" style="font-size:clamp(3rem, 5vw, 4.5rem)">Design that<br>scales.</h1><!-- /wp:heading --><!-- wp:paragraph {"className":"body-large"} --><p class="body-large">We build robust design systems that scale with your product.</p><!-- /wp:paragraph --><!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"className":"btn-primary"} --><div class="wp-block-button btn-primary"><a class="wp-block-button__link wp-element-button">Start Project</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:column --><!-- wp:column {"verticalAlignment":"center"} --><div class="wp-block-column is-vertically-aligned-center"><!-- wp:image {"sizeSlug":"large","linkDestination":"none","className":"img-blend-gradient"} --><figure class="wp-block-image size-large img-blend-gradient"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" alt=""/></figure><!-- /wp:image --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->'
    ));

    // 2. HERO: MINIMAL TEXT CENTER
    register_block_pattern('nischhal/hero-minimal', array(
        'title' => 'Hero: Minimal Text',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"150px","bottom":"150px"}}},"layout":{"type":"constrained","contentSize":"800px"}} --><div class="wp-block-group alignfull" style="padding-top:150px;padding-bottom:150px"><!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(3.5rem, 6vw, 6rem)","lineHeight":"1.1"}}} --><h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(3.5rem, 6vw, 6rem);line-height:1.1">Less Noise.<br>More Signal.</h1><!-- /wp:heading --><!-- wp:paragraph {"align":"center","className":"body-large"} --><p class="has-text-align-center body-large">Focusing on the essential elements of product design to deliver clarity.</p><!-- /wp:paragraph --><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} --><div class="wp-block-buttons"><!-- wp:button {"className":"btn-secondary"} --><div class="wp-block-button btn-secondary"><a class="wp-block-button__link wp-element-button">Explore Work</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:group -->'
    ));

    // 3. STATS GRID
    register_block_pattern('nischhal/stats-grid', array(
        'title' => 'Section: Stats Grid',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"align":"wide","className":"section-container"} --><div class="wp-block-group alignwide section-container"><!-- wp:columns --><div class="wp-block-columns"><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":4,"style":{"typography":{"fontSize":"3rem"}}} --><h4 class="wp-block-heading" style="font-size:3rem">85%</h4><!-- /wp:heading --><!-- wp:paragraph {"textColor":"secondary"} --><p class="has-secondary-color has-text-color">Increase in user retention.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":4,"style":{"typography":{"fontSize":"3rem"}}} --><h4 class="wp-block-heading" style="font-size:3rem">3x</h4><!-- /wp:heading --><!-- wp:paragraph {"textColor":"secondary"} --><p class="has-secondary-color has-text-color">Faster development cycles.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":4,"style":{"typography":{"fontSize":"3rem"}}} --><h4 class="wp-block-heading" style="font-size:3rem">10k+</h4><!-- /wp:heading --><!-- wp:paragraph {"textColor":"secondary"} --><p class="has-secondary-color has-text-color">Active daily users.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->'
    ));

    // 4. SERVICES LIST (Accordion style visual)
    register_block_pattern('nischhal/services-list', array(
        'title' => 'Section: Services List',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"className":"section-container"} --><div class="wp-block-group section-container"><!-- wp:heading {"style":{"spacing":{"margin":{"bottom":"40px"}}}} --><h2 class="wp-block-heading" style="margin-bottom:40px">Services</h2><!-- /wp:heading --><!-- wp:group {"style":{"border":{"top":{"color":"var(--border-faint)","width":"1px"},"bottom":{"color":"var(--border-faint)","width":"1px"}},"spacing":{"padding":{"top":"30px","bottom":"30px"}}}} --><div class="wp-block-group" style="border-top-color:var(--border-faint);border-top-width:1px;border-bottom-color:var(--border-faint);border-bottom-width:1px;padding-top:30px;padding-bottom:30px"><!-- wp:columns --><div class="wp-block-columns"><!-- wp:column {"width":"30%"} --><div class="wp-block-column" style="flex-basis:30%"><!-- wp:heading {"level":4,"fontSize":"medium"} --><h4 class="wp-block-heading has-medium-font-size">01</h4><!-- /wp:heading --></div><!-- /wp:column --><!-- wp:column {"width":"70%"} --><div class="wp-block-column" style="flex-basis:70%"><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">Product Strategy</h3><!-- /wp:heading --><!-- wp:paragraph {"textColor":"secondary"} --><p class="has-secondary-color has-text-color">Defining the roadmap and MVP scope.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group --><!-- wp:group {"style":{"border":{"bottom":{"color":"var(--border-faint)","width":"1px"}},"spacing":{"padding":{"top":"30px","bottom":"30px"}}}} --><div class="wp-block-group" style="border-bottom-color:var(--border-faint);border-bottom-width:1px;padding-top:30px;padding-bottom:30px"><!-- wp:columns --><div class="wp-block-columns"><!-- wp:column {"width":"30%"} --><div class="wp-block-column" style="flex-basis:30%"><!-- wp:heading {"level":4,"fontSize":"medium"} --><h4 class="wp-block-heading has-medium-font-size">02</h4><!-- /wp:heading --></div><!-- /wp:column --><!-- wp:column {"width":"70%"} --><div class="wp-block-column" style="flex-basis:70%"><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">UI/UX Design</h3><!-- /wp:heading --><!-- wp:paragraph {"textColor":"secondary"} --><p class="has-secondary-color has-text-color">High fidelity mockups and prototyping.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group --></div><!-- /wp:group -->'
    ));

    // 5. TESTIMONIAL GRID
    register_block_pattern('nischhal/testimonial-grid', array(
        'title' => 'Section: Testimonial Grid',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"align":"wide","className":"section-container"} --><div class="wp-block-group alignwide section-container"><!-- wp:heading {"textAlign":"center","style":{"spacing":{"margin":{"bottom":"60px"}}}} --><h2 class="wp-block-heading has-text-align-center" style="margin-bottom:60px">Client Feedback</h2><!-- /wp:heading --><!-- wp:columns {"style":{"spacing":{"blockGap":"30px"}}} --><div class="wp-block-columns"><!-- wp:column {"style":{"border":{"width":"1px","color":"var(--border-faint)","radius":"16px"},"spacing":{"padding":{"top":"30px","right":"30px","bottom":"30px","left":"30px"}},"color":{"background":"var(--bg-surface)"}}} --><div class="wp-block-column has-background" style="background-color:var(--bg-surface);border-radius:16px;border-width:1px;border-color:var(--border-faint);padding-top:30px;padding-right:30px;padding-bottom:30px;padding-left:30px"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"italic"}}} --><p style="font-style:italic">"Exceptional attention to detail."</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"small","textColor":"secondary"} --><p class="has-secondary-color has-text-color has-small-font-size"><strong>Sarah J.</strong> - CEO, TechFlow</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column {"style":{"border":{"width":"1px","color":"var(--border-faint)","radius":"16px"},"spacing":{"padding":{"top":"30px","right":"30px","bottom":"30px","left":"30px"}},"color":{"background":"var(--bg-surface)"}}} --><div class="wp-block-column has-background" style="background-color:var(--bg-surface);border-radius:16px;border-width:1px;border-color:var(--border-faint);padding-top:30px;padding-right:30px;padding-bottom:30px;padding-left:30px"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"italic"}}} --><p style="font-style:italic">"Transformed our entire user workflow."</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"small","textColor":"secondary"} --><p class="has-secondary-color has-text-color has-small-font-size"><strong>Mike R.</strong> - CTO, DevCorp</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->'
    ));

    // 6. GALLERY: TWO IMAGES
    register_block_pattern('nischhal/gallery-two', array(
        'title' => 'Gallery: Two Columns',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":"40px"}}} --><div class="wp-block-columns alignwide"><!-- wp:column --><div class="wp-block-column"><!-- wp:image {"sizeSlug":"large","linkDestination":"none","className":"img-blend-gradient"} --><figure class="wp-block-image size-large img-blend-gradient"><img src="https://placehold.co/600x400/1a1a1a/FFF" alt=""/></figure><!-- /wp:image --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:image {"sizeSlug":"large","linkDestination":"none","className":"img-blend-gradient"} --><figure class="wp-block-image size-large img-blend-gradient"><img src="https://placehold.co/600x400/1a1a1a/FFF" alt=""/></figure><!-- /wp:image --></div><!-- /wp:column --></div><!-- /wp:columns -->'
    ));

    // 7. CALL TO ACTION (CENTER)
    register_block_pattern('nischhal/cta-center', array(
        'title' => 'CTA: Simple Center',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"className":"section-container","layout":{"type":"constrained","contentSize":"800px"}} --><div class="wp-block-group section-container"><!-- wp:heading {"textAlign":"center"} --><h2 class="wp-block-heading has-text-align-center">Ready to start?</h2><!-- /wp:heading --><!-- wp:paragraph {"align":"center","textColor":"secondary"} --><p class="has-text-align-center has-secondary-color has-text-color">Let\'s discuss your project requirements.</p><!-- /wp:paragraph --><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} --><div class="wp-block-buttons"><!-- wp:button {"className":"btn-primary"} --><div class="wp-block-button btn-primary"><a class="wp-block-button__link wp-element-button">Contact Me</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:group -->'
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