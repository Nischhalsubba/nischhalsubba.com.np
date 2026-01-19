<?php
/**
 * Nischhal Portfolio - Core Functions
 * Version: 7.2 (Restored Customizer + Block Patterns)
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

// --- 2. ENQUEUE ---
function nischhal_enqueue_scripts() {
    // Fonts
    $h_font = get_theme_mod('typo_heading_family', 'Playfair Display');
    $b_font = get_theme_mod('typo_body_family', 'Inter');
    $weights = '300;400;500;600;700'; 
    $fonts_url = "https://fonts.googleapis.com/css2?family=" . urlencode($h_font) . ":wght@" . $weights . "&family=" . urlencode($b_font) . ":wght@" . $weights . "&display=swap";
    wp_enqueue_style( 'nischhal-google-fonts', $fonts_url, array(), null );

    // Core
    wp_enqueue_style( 'main-style', get_stylesheet_uri(), array(), '7.2' );
    wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), null, true );
    wp_enqueue_script( 'gsap-st', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap'), null, true );
    wp_enqueue_script( 'theme-js', get_template_directory_uri() . '/js/main.js', array('gsap'), '7.2', true );

    // Pass Config to JS (Restored full config)
    wp_localize_script( 'theme-js', 'themeConfig', array(
        'animSpeed' => get_theme_mod('anim_speed_multiplier', 1.0),
        'animEasing' => get_theme_mod('anim_easing', 'power2.out'),
        'cursorEnable' => get_theme_mod('cursor_enable', true),
        'cursorStyle' => get_theme_mod('cursor_style', 'classic'),
        'gridEnable' => get_theme_mod('grid_enable', true),
        'gridOpacity' => get_theme_mod('grid_opacity_dark', 0.05),
        'gridSpotlight' => get_theme_mod('bg_spotlight', true),
        'transStyle' => get_theme_mod('trans_style', 'fade'),
    ));
}
add_action( 'wp_enqueue_scripts', 'nischhal_enqueue_scripts' );

// --- 3. CUSTOM BLOCK CATEGORY ---
function nischhal_block_categories( $categories, $post ) {
    return array_merge(
        array(
            array(
                'slug' => 'nischhal-blocks',
                'title' => __( '⚡ Nischhal Raj Subba', 'nischhal' ),
            ),
        ),
        $categories
    );
}
add_filter( 'block_categories_all', 'nischhal_block_categories', 10, 2 );

// --- 4. REGISTER BLOCK STYLES ---
function nischhal_register_block_styles() {
    register_block_style( 'core/heading', array(
        'name'  => 'outline-reveal',
        'label' => __( 'Outline Reveal', 'nischhal' ),
    ));
    register_block_style( 'core/group', array(
        'name'  => 'glass-card',
        'label' => __( 'Glass Card', 'nischhal' ),
    ));
}
add_action( 'init', 'nischhal_register_block_styles' );

// --- 5. EXTENSIVE BLOCK PATTERNS (The "UI Kit") ---
function nischhal_register_patterns() {
    
    // HERO: Center with Ticker
    register_block_pattern('nischhal/hero-center', array(
        'title' => 'NRS: Hero (Center + Ticker)',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"align":"full","className":"hero-block","style":{"spacing":{"padding":{"top":"150px","bottom":"100px"}}}} --><div class="wp-block-group alignfull hero-block" style="padding-top:150px;padding-bottom:100px"><!-- wp:paragraph {"align":"center","style":{"typography":{"textTransform":"uppercase","letterSpacing":"2px","fontSize":"0.8rem"}}} --><p class="has-text-align-center" style="font-size:0.8rem;letter-spacing:2px;text-transform:uppercase">Design Systems • Enterprise UX • Web3</p><!-- /wp:paragraph --><!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(3.5rem, 8vw, 6rem)"}}} --><h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(3.5rem, 8vw, 6rem)">Crafting Scalable<br>Digital Products.</h1><!-- /wp:heading --><!-- wp:paragraph {"align":"center","className":"body-large","style":{"spacing":{"margin":{"left":"auto","right":"auto"}}}} --><p class="has-text-align-center body-large" style="margin-left:auto;margin-right:auto">I bridge the gap between complex requirements and elegant, scalable interfaces.</p><!-- /wp:paragraph --><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} --><div class="wp-block-buttons"><!-- wp:button {"className":"btn-primary"} --><div class="wp-block-button btn-primary"><a class="wp-block-button__link wp-element-button">View Work</a></div><!-- /wp:button --><!-- wp:button {"className":"btn-secondary"} --><div class="wp-block-button btn-secondary"><a class="wp-block-button__link wp-element-button">About Me</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:group -->'
    ));

    // HERO: Split with Image
    register_block_pattern('nischhal/hero-split', array(
        'title' => 'NRS: Hero (Split Layout)',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":"80px","margin":{"top":"100px"}}}} --><div class="wp-block-columns alignwide" style="margin-top:100px"><!-- wp:column {"verticalAlignment":"center"} --><div class="wp-block-column is-vertically-aligned-center"><!-- wp:heading {"level":1,"style":{"typography":{"fontSize":"4.5rem"}}} --><h1 class="wp-block-heading" style="font-size:4.5rem">Hello, I build<br>living systems.</h1><!-- /wp:heading --><!-- wp:paragraph {"className":"body-large"} --><p class="body-large">Specialized in Figma-to-Code workflows for enterprise teams.</p><!-- /wp:paragraph --><!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"className":"btn-primary"} --><div class="wp-block-button btn-primary"><a class="wp-block-button__link wp-element-button">Case Studies</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:column --><!-- wp:column {"verticalAlignment":"center"} --><div class="wp-block-column is-vertically-aligned-center"><!-- wp:image {"sizeSlug":"large","linkDestination":"none","className":"img-blend-gradient"} --><figure class="wp-block-image size-large img-blend-gradient"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt=""/></figure><!-- /wp:image --></div><!-- /wp:column --></div><!-- /wp:columns -->'
    ));

    // PROJECTS: Dynamic Grid
    register_block_pattern('nischhal/projects-grid', array(
        'title' => 'NRS: Projects Grid (Dynamic)',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"align":"wide","className":"section-container"} --><div class="wp-block-group alignwide section-container"><!-- wp:heading {"style":{"typography":{"fontSize":"3rem"}}} --><h2 class="wp-block-heading" style="font-size:3rem">Selected Work</h2><!-- /wp:heading --><!-- wp:query {"query":{"perPage":4,"pages":0,"offset":0,"postType":"project","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false}} --><div class="wp-block-query"><!-- wp:post-template {"layout":{"type":"grid","columnCount":2}} --><!-- wp:post-featured-image {"isLink":true,"style":{"border":{"radius":"16px"}}} /--><!-- wp:group {"style":{"spacing":{"margin":{"top":"24px"}}}} --><div class="wp-block-group" style="margin-top:24px"><!-- wp:post-title {"isLink":true,"style":{"typography":{"fontSize":"2rem"}}} /--><!-- wp:post-excerpt /--></div><!-- /wp:group --><!-- /wp:post-template --></div><!-- /wp:query --></div><!-- /wp:group -->'
    ));

    // TESTIMONIALS: Slider
    register_block_pattern('nischhal/testimonials', array(
        'title' => 'NRS: Testimonials Slider',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"align":"wide","className":"testimonial-section"} --><div class="wp-block-group alignwide testimonial-section"><!-- wp:heading {"textAlign":"center"} --><h2 class="wp-block-heading has-text-align-center">Kind Words</h2><!-- /wp:heading --><!-- wp:html --><div class="t-track"><div class="t-slide active"><p class="t-quote">"Nischhal transformed our messy MVP into a scalable enterprise product. His systems thinking is unmatched."</p><div class="t-author"><h5>Sarah Jenkins</h5><span>CTO, FinTech Co.</span></div></div><div class="t-slide"><p class="t-quote">"The best design partner we have ever worked with. Delivered pixel-perfect specs that were easy to code."</p><div class="t-author"><h5>David Lee</h5><span>Founder, Web3 DAO</span></div></div></div><div class="t-controls"><button id="t-prev" class="t-btn">←</button><button id="t-next" class="t-btn">→</button></div><!-- /wp:html --></div><!-- /wp:group -->'
    ));

    // STATS: Metrics Strip
    register_block_pattern('nischhal/metrics-strip', array(
        'title' => 'NRS: Metrics Strip',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"align":"full","style":{"border":{"top":{"color":"var(--border-faint)","width":"1px"},"bottom":{"color":"var(--border-faint)","width":"1px"}},"spacing":{"padding":{"top":"60px","bottom":"60px"}}}} --><div class="wp-block-group alignfull" style="border-top-color:var(--border-faint);border-top-width:1px;border-bottom-color:var(--border-faint);border-bottom-width:1px;padding-top:60px;padding-bottom:60px"><!-- wp:columns {"align":"wide"} --><div class="wp-block-columns alignwide"><!-- wp:column {"className":"metric-item"} --><div class="wp-block-column metric-item"><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">#1</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Ranked Designer</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column {"className":"metric-item"} --><div class="wp-block-column metric-item"><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">50+</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Projects Delivered</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column {"className":"metric-item"} --><div class="wp-block-column metric-item"><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">6yr</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Specialized Experience</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->'
    ));

    // CTA: Centered
    register_block_pattern('nischhal/cta-center', array(
        'title' => 'NRS: CTA (Ready to build?)',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"className":"section-container","layout":{"type":"constrained","contentSize":"800px"}} --><div class="wp-block-group section-container"><!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"4rem"}}} --><h2 class="wp-block-heading has-text-align-center" style="font-size:4rem">Ready to build?</h2><!-- /wp:heading --><!-- wp:paragraph {"align":"center","className":"body-large"} --><p class="has-text-align-center body-large">I am currently available for select freelance projects. Let\'s discuss your vision.</p><!-- /wp:paragraph --><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} --><div class="wp-block-buttons"><!-- wp:button {"className":"btn-primary"} --><div class="wp-block-button btn-primary"><a class="wp-block-button__link wp-element-button">Start Project</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:group -->'
    ));
    
    // SERVICES: 3 Column
    register_block_pattern('nischhal/services-3col', array(
        'title' => 'NRS: Services (3 Columns)',
        'categories' => array('nischhal-blocks'),
        'content' => '<!-- wp:group {"align":"wide","className":"section-container"} --><div class="wp-block-group alignwide section-container"><!-- wp:heading {"style":{"spacing":{"margin":{"bottom":"60px"}}}} --><h2 class="wp-block-heading" style="margin-bottom:60px">Expertise</h2><!-- /wp:heading --><!-- wp:columns {"style":{"spacing":{"blockGap":"40px"}}} --><div class="wp-block-columns"><!-- wp:column {"className":"is-style-glass-card"} --><div class="wp-block-column is-style-glass-card"><!-- wp:heading {"level":4} --><h4 class="wp-block-heading">Strategy</h4><!-- /wp:heading --><!-- wp:paragraph --><p>Discovery, Research, Roadmap, MVP Definition.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column {"className":"is-style-glass-card"} --><div class="wp-block-column is-style-glass-card"><!-- wp:heading {"level":4} --><h4 class="wp-block-heading">Design</h4><!-- /wp:heading --><!-- wp:paragraph --><p>UI/UX, Prototyping, Design Systems, Motion.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column {"className":"is-style-glass-card"} --><div class="wp-block-column is-style-glass-card"><!-- wp:heading {"level":4} --><h4 class="wp-block-heading">Development</h4><!-- /wp:heading --><!-- wp:paragraph --><p>Front-end Implementation, React, WordPress.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->'
    ));
}
add_action( 'init', 'nischhal_register_patterns' );

// --- 6. THEME CUSTOMIZER (RESTORED v7.0) ---
function nischhal_customize_register( $wp_customize ) {
    
    // --- PANEL: INTERACTION & CURSORS ---
    $wp_customize->add_panel( 'panel_interaction', array( 'title' => '⚡ Interaction & Cursors', 'priority' => 20 ) );

    // Section 1: Animation System
    $wp_customize->add_section( 'sec_anim_system', array( 'title' => 'Animation System', 'panel' => 'panel_interaction' ) );
    $wp_customize->add_setting('anim_speed_multiplier', array('default'=>1.0));
    $wp_customize->add_control('anim_speed_multiplier', array('label'=>'Global Speed Multiplier', 'section'=>'sec_anim_system', 'type'=>'number', 'input_attrs'=>array('min'=>0.5, 'max'=>2.0, 'step'=>0.1)));
    $wp_customize->add_setting('anim_easing', array('default'=>'power2.out'));
    $wp_customize->add_control('anim_easing', array('label'=>'Global Easing', 'section'=>'sec_anim_system', 'type'=>'select', 'choices'=>array('power2.out'=>'Power2', 'power3.out'=>'Power3', 'expo.out'=>'Expo', 'circ.out'=>'Circular')));

    // Section 2: Page Transitions
    $wp_customize->add_section( 'sec_page_trans', array( 'title' => 'Page Transitions', 'panel' => 'panel_interaction' ) );
    $wp_customize->add_setting('trans_style', array('default'=>'fade'));
    $wp_customize->add_control('trans_style', array('label'=>'Transition Style', 'section'=>'sec_page_trans', 'type'=>'select', 'choices'=>array('fade'=>'Fade', 'curtain'=>'Curtain', 'swipe'=>'Swipe')));

    // Section 3: Cursor
    $wp_customize->add_section( 'sec_cursor', array( 'title' => 'Cursor', 'panel' => 'panel_interaction' ) );
    $wp_customize->add_setting('cursor_enable', array('default'=>true));
    $wp_customize->add_control('cursor_enable', array('label'=>'Enable Custom Cursor', 'section'=>'sec_cursor', 'type'=>'checkbox'));
    
    $wp_customize->add_setting('cursor_style', array('default'=>'classic'));
    $wp_customize->add_control('cursor_style', array('label'=>'Cursor Style', 'section'=>'sec_cursor', 'type'=>'select', 'choices'=>array(
        'classic'=>'Classic (Ring+Dot)', 'dot'=>'Dot Only', 'outline'=>'Outline Only', 'blend'=>'Blend Mode', 'trail'=>'Trail', 'magnetic'=>'Magnetic', 'fluid'=>'Fluid', 'glitch'=>'Glitch', 'focus'=>'Focus Ring', 'spotlight'=>'Spotlight'
    )));
    
    $wp_customize->add_setting('cursor_size', array('default'=>20));
    $wp_customize->add_control('cursor_size', array('label'=>'Cursor Size (px)', 'section'=>'sec_cursor', 'type'=>'number'));

    // --- PANEL: DESIGN COLORS (RESTORED) ---
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
    
    $wp_customize->add_setting('bg_spotlight', array('default'=>true));
    $wp_customize->add_control('bg_spotlight', array('label'=>'Enable Spotlight', 'section'=>'sec_grid_overlay', 'type'=>'checkbox'));

    // --- PANEL: TYPOGRAPHY (RESTORED) ---
    $wp_customize->add_panel( 'panel_typography', array( 'title' => 'Aa Design: Typography', 'priority' => 22 ) );
    $wp_customize->add_section( 'sec_fonts', array( 'title' => 'Font Families', 'panel' => 'panel_typography' ) );
    
    $wp_customize->add_setting('typo_heading_family', array('default'=>'Playfair Display'));
    $wp_customize->add_control('typo_heading_family', array('label'=>'Heading Font', 'section'=>'sec_fonts', 'type'=>'text'));
    
    $wp_customize->add_setting('typo_body_family', array('default'=>'Inter'));
    $wp_customize->add_control('typo_body_family', array('label'=>'Body Font', 'section'=>'sec_fonts', 'type'=>'text'));

    // --- PANEL: LAYOUT (RESTORED) ---
    $wp_customize->add_panel( 'panel_layout', array( 'title' => 'Design: Layout', 'priority' => 23 ) );
    $wp_customize->add_section( 'sec_layout_dims', array( 'title' => 'Dimensions', 'panel' => 'panel_layout' ) );
    
    $wp_customize->add_setting('container_width', array('default'=>'1200px'));
    $wp_customize->add_control('container_width', array('label'=>'Max Width', 'section'=>'sec_layout_dims', 'type'=>'text'));
    
    $wp_customize->add_setting('section_gap', array('default'=>'120px'));
    $wp_customize->add_control('section_gap', array('label'=>'Section Gap', 'section'=>'sec_layout_dims', 'type'=>'text'));

    // --- HOMEPAGE SETTINGS (RESTORED) ---
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
    
    // --- FOOTER SETTINGS (RESTORED) ---
    $wp_customize->add_section('sec_footer', array('title'=>'Footer', 'priority'=>31));
    $wp_customize->add_setting('footer_email', array('default'=>'hinischalsubba@gmail.com'));
    $wp_customize->add_control('footer_email', array('label'=>'Email Address', 'section'=>'sec_footer', 'type'=>'text'));
    $wp_customize->add_setting('social_linkedin', array('default'=>''));
    $wp_customize->add_control('social_linkedin', array('label'=>'LinkedIn URL', 'section'=>'sec_footer', 'type'=>'url'));
    $wp_customize->add_setting('social_behance', array('default'=>''));
    $wp_customize->add_control('social_behance', array('label'=>'Behance URL', 'section'=>'sec_footer', 'type'=>'url'));
}
add_action( 'customize_register', 'nischhal_customize_register' );

// --- 7. CSS VARIABLES INJECTION (RESTORED) ---
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