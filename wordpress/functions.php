
<?php
/**
 * Nischhal Portfolio - Core Functions
 * Version: 9.0
 * 
 * This file handles the setup, assets, custom post types, and the Customizer API.
 * Refactored for clarity and maintainability.
 */

/* -------------------------------------------------------------------------- */
/*	1. THEME SETUP
/* -------------------------------------------------------------------------- */

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function nischhal_theme_setup() {
    // Let WordPress manage the document title.
    add_theme_support( 'title-tag' );
    
    // Enable support for Post Thumbnails on posts and pages.
    add_theme_support( 'post-thumbnails' );
    
    // Enable support for custom logo.
    add_theme_support( 'custom-logo', array(
        'height'      => 80,
        'width'       => 200,
        'flex-height' => true,
    ));
    
    // Switch default core markup for search form, comment form, and comments to output valid HTML5.
    add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
    
    // Add support for full and wide align images.
    add_theme_support( 'align-wide' ); 
    
    // Add support for editor styles.
    add_theme_support( 'editor-styles' );
    add_editor_style( 'style.css' );
    
    // Register Navigation Menus
    register_nav_menus( array( 
        'primary' => 'Primary Menu' 
    ) );
}
add_action( 'after_setup_theme', 'nischhal_theme_setup' );


/* -------------------------------------------------------------------------- */
/*	2. CUSTOM POST TYPES (CPT)
/* -------------------------------------------------------------------------- */

/**
 * Registers custom post types for Projects and Testimonials.
 * These will appear in the Admin Dashboard menu.
 */
function nischhal_register_post_types() {
    
    // --- CPT: PROJECTS ---
    register_post_type('project', array(
        'labels' => array(
            'name'          => 'Projects',
            'singular_name' => 'Project',
            'menu_name'     => '💼 Projects',
            'add_new_item'  => 'Add New Project'
        ),
        'public'        => true,
        'has_archive'   => true,
        'menu_icon'     => 'dashicons-portfolio',
        'supports'      => array('title', 'editor', 'thumbnail', 'excerpt', 'revisions'),
        'show_in_rest'  => true, // Enables Block Editor
        'rewrite'       => array('slug' => 'work'),
    ));

    // Taxonomy: Project Categories
    register_taxonomy('project_category', 'project', array(
        'labels' => array(
            'name'          => 'Project Categories',
            'singular_name' => 'Category',
            'menu_name'     => 'Categories'
        ),
        'hierarchical'  => true,
        'show_in_rest'  => true,
        'public'        => true
    ));

    // --- CPT: TESTIMONIALS ---
    register_post_type('testimonial', array(
        'labels' => array(
            'name'          => 'Testimonials',
            'singular_name' => 'Testimonial',
            'menu_name'     => '💬 Testimonials',
            'add_new_item'  => 'Add New Testimonial'
        ),
        'public'             => true,
        'publicly_queryable' => false, // No single detail page
        'show_ui'            => true,
        'menu_icon'          => 'dashicons-format-quote',
        'supports'           => array('title', 'editor'), // Title = Author, Editor = Quote
        'show_in_rest'       => true,
    ));
}
add_action('init', 'nischhal_register_post_types');


/* -------------------------------------------------------------------------- */
/*	3. CUSTOM FIELDS (META BOXES)
/* -------------------------------------------------------------------------- */

/**
 * Registers meta boxes for Project details and Testimonials.
 */
function nischhal_add_meta_boxes() {
    add_meta_box(
        'project_meta', 
        '🚀 Project Scope & Details', 
        'nischhal_render_project_meta', 
        'project', 
        'side', 
        'high'
    );
    
    add_meta_box(
        'testimonial_meta', 
        '👤 Author Details', 
        'nischhal_render_testimonial_meta', 
        'testimonial', 
        'normal', 
        'high'
    );
}
add_action('add_meta_boxes', 'nischhal_add_meta_boxes');

/**
 * Renders the HTML for Project Meta Box.
 * @param object $post The post object.
 */
function nischhal_render_project_meta($post) {
    wp_nonce_field('nischhal_save_project_meta', 'nischhal_project_nonce');
    
    // Retrieve existing values
    $year = get_post_meta($post->ID, 'project_year', true);
    $role = get_post_meta($post->ID, 'project_role', true);
    $industry = get_post_meta($post->ID, 'project_industry', true);
    $team = get_post_meta($post->ID, 'project_team', true);
    $timeline = get_post_meta($post->ID, 'project_timeline', true);
    $outcome = get_post_meta($post->ID, 'project_outcome', true);
    $live_url = get_post_meta($post->ID, 'project_live_url', true);
    
    // Inline style for admin cleanliness
    ?>
    <style>
        .n-meta-row { margin-bottom: 15px; }
        .n-meta-row label { display: block; font-weight: 600; margin-bottom: 5px; color: #444; }
        .n-meta-row input { width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px; }
    </style>
    <div class="n-meta-row"><label>Year</label><input type="text" name="project_year" value="<?php echo esc_attr($year); ?>"></div>
    <div class="n-meta-row"><label>Industry</label><input type="text" name="project_industry" value="<?php echo esc_attr($industry); ?>"></div>
    <div class="n-meta-row"><label>Role</label><input type="text" name="project_role" value="<?php echo esc_attr($role); ?>"></div>
    <div class="n-meta-row"><label>Team</label><input type="text" name="project_team" value="<?php echo esc_attr($team); ?>"></div>
    <div class="n-meta-row"><label>Timeline</label><input type="text" name="project_timeline" value="<?php echo esc_attr($timeline); ?>"></div>
    <div class="n-meta-row"><label>Outcome</label><input type="text" name="project_outcome" value="<?php echo esc_attr($outcome); ?>"></div>
    <div class="n-meta-row"><label>Live URL</label><input type="url" name="project_live_url" value="<?php echo esc_attr($live_url); ?>"></div>
    <?php
}

/**
 * Renders the HTML for Testimonial Meta Box.
 */
function nischhal_render_testimonial_meta($post) {
    wp_nonce_field('nischhal_save_testimonial_meta', 'nischhal_testimonial_nonce');
    $role = get_post_meta($post->ID, 'testimonial_role', true);
    ?>
    <div style="margin-top: 10px;">
        <label style="font-weight:600; display:block; margin-bottom:5px;">Role / Company</label>
        <input type="text" name="testimonial_role" value="<?php echo esc_attr($role); ?>" style="width:100%; padding:8px;">
    </div>
    <?php
}

/**
 * Saves the meta box data when a post is saved.
 */
function nischhal_save_meta_data($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    
    // Save Projects
    if (isset($_POST['nischhal_project_nonce']) && wp_verify_nonce($_POST['nischhal_project_nonce'], 'nischhal_save_project_meta')) {
        $fields = ['project_year', 'project_role', 'project_industry', 'project_team', 'project_timeline', 'project_outcome', 'project_live_url'];
        foreach ($fields as $field) {
            if (isset($_POST[$field])) update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
        }
    }
    
    // Save Testimonials
    if (isset($_POST['nischhal_testimonial_nonce']) && wp_verify_nonce($_POST['nischhal_testimonial_nonce'], 'nischhal_save_testimonial_meta')) {
        if (isset($_POST['testimonial_role'])) update_post_meta($post_id, 'testimonial_role', sanitize_text_field($_POST['testimonial_role']));
    }
}
add_action('save_post', 'nischhal_save_meta_data');


/* -------------------------------------------------------------------------- */
/*	4. ASSETS (CSS & JS)
/* -------------------------------------------------------------------------- */

function nischhal_enqueue_scripts() {
    // 1. Google Fonts
    $h_font = get_theme_mod('typo_heading_family', 'Playfair Display');
    $b_font = get_theme_mod('typo_body_family', 'Inter');
    $weights = '300;400;500;600;700'; 
    $fonts_url = "https://fonts.googleapis.com/css2?family=" . urlencode($h_font) . ":wght@" . $weights . "&family=" . urlencode($b_font) . ":wght@" . $weights . "&display=swap";
    wp_enqueue_style( 'nischhal-google-fonts', $fonts_url, array(), null );

    // 2. Main Stylesheet
    wp_enqueue_style( 'main-style', get_stylesheet_uri(), array(), '9.0' );

    // 3. GSAP (CDN)
    wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), null, true );
    wp_enqueue_script( 'gsap-st', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap'), null, true );

    // 4. Main JavaScript
    wp_enqueue_script( 'theme-js', get_template_directory_uri() . '/js/main.js', array('gsap'), '9.0', true );

    // 5. Pass PHP Variables to JS
    wp_localize_script( 'theme-js', 'themeConfig', array(
        'animSpeed' => get_theme_mod('anim_speed_multiplier', 1.0),
        'cursorEnable' => get_theme_mod('cursor_enable', true),
        'gridEnable' => get_theme_mod('grid_enable', true),
        'gridOpacity' => get_theme_mod('grid_opacity_dark', 0.05),
    ));
}
add_action( 'wp_enqueue_scripts', 'nischhal_enqueue_scripts' );


/* -------------------------------------------------------------------------- */
/*	5. THEME CUSTOMIZER API
/* -------------------------------------------------------------------------- */

function nischhal_customize_register( $wp_customize ) {
    
    // PANEL: INTERACTION & CURSORS
    $wp_customize->add_panel( 'panel_interaction', array( 'title' => '⚡ Interaction & Cursors', 'priority' => 20 ) );

    // Section: Animation
    $wp_customize->add_section( 'sec_anim_system', array( 'title' => 'Animation System', 'panel' => 'panel_interaction' ) );
    $wp_customize->add_setting('anim_speed_multiplier', array('default'=>1.0));
    $wp_customize->add_control('anim_speed_multiplier', array('label'=>'Speed Multiplier', 'section'=>'sec_anim_system', 'type'=>'number'));

    // Section: Cursor
    $wp_customize->add_section( 'sec_cursor', array( 'title' => 'Cursor', 'panel' => 'panel_interaction' ) );
    $wp_customize->add_setting('cursor_enable', array('default'=>true));
    $wp_customize->add_control('cursor_enable', array('label'=>'Enable Custom Cursor', 'section'=>'sec_cursor', 'type'=>'checkbox'));
    
    $wp_customize->add_setting('cursor_size', array('default'=>20));
    $wp_customize->add_control('cursor_size', array('label'=>'Cursor Size (px)', 'section'=>'sec_cursor', 'type'=>'number'));

    // PANEL: COLORS
    $wp_customize->add_panel( 'panel_colors', array( 'title' => '🎨 Design: Colors', 'priority' => 21 ) );

    // Section: Dark Tokens (Default)
    $wp_customize->add_section('sec_tokens_dark', array('title'=>'Dark Theme Tokens', 'panel'=>'panel_colors'));
    $colors = [
        'd_bg' => ['#050505', 'Background'],
        'd_surface' => ['#0a0a0a', 'Surface'],
        'd_text' => ['#FFFFFF', 'Text Primary'],
        'd_text_muted' => ['#A1A1AA', 'Text Secondary'],
        'd_accent' => ['#3B82F6', 'Accent Blue']
    ];
    foreach($colors as $id => $val) {
        $wp_customize->add_setting($id, array('default'=>$val[0]));
        $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, $id, array('label'=>$val[1], 'section'=>'sec_tokens_dark')));
    }

    // SECTION: HOMEPAGE HERO
    $wp_customize->add_section('sec_hero', array('title'=>'🏠 Home: Hero', 'priority'=>30));
    $wp_customize->add_setting('hero_layout_style', array('default'=>'hero-v1'));
    $wp_customize->add_control('hero_layout_style', array('label'=>'Layout Style', 'section'=>'sec_hero', 'type'=>'select', 'choices'=>array('hero-v1'=>'Center', 'hero-v2'=>'Split')));
    
    $wp_customize->add_setting('hero_h1_line1', array('default'=>'Crafting scalable'));
    $wp_customize->add_control('hero_h1_line1', array('label'=>'Headline Line 1', 'section'=>'sec_hero', 'type'=>'text'));
    
    $wp_customize->add_setting('hero_h1_line2', array('default'=>'digital products.'));
    $wp_customize->add_control('hero_h1_line2', array('label'=>'Headline Line 2', 'section'=>'sec_hero', 'type'=>'text'));
    
    $wp_customize->add_setting('hero_img', array('default'=>'https://i.imgur.com/ixsEpYM.png'));
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'hero_img', array('label'=>'Portrait Image', 'section'=>'sec_hero')));
    
    $wp_customize->add_setting('hero_ticker_items', array('default'=>'Design Systems, Enterprise UX, Web3 Specialist'));
    $wp_customize->add_control('hero_ticker_items', array('label'=>'Ticker Items (Comma separated)', 'section'=>'sec_hero', 'type'=>'text'));
    
    // SECTION: FOOTER
    $wp_customize->add_section('sec_footer', array('title'=>'Footer Settings', 'priority'=>31));
    $wp_customize->add_setting('footer_email', array('default'=>'hinischalsubba@gmail.com'));
    $wp_customize->add_control('footer_email', array('label'=>'Contact Email', 'section'=>'sec_footer', 'type'=>'text'));
    $wp_customize->add_setting('social_linkedin', array('default'=>''));
    $wp_customize->add_control('social_linkedin', array('label'=>'LinkedIn URL', 'section'=>'sec_footer', 'type'=>'url'));
    $wp_customize->add_setting('social_behance', array('default'=>''));
    $wp_customize->add_control('social_behance', array('label'=>'Behance URL', 'section'=>'sec_footer', 'type'=>'url'));
}
add_action( 'customize_register', 'nischhal_customize_register' );


/* -------------------------------------------------------------------------- */
/*	6. CSS VARIABLES INJECTION
/* -------------------------------------------------------------------------- */

/**
 * Injects the Customizer settings as CSS Variables into the <head>.
 */
function nischhal_customizer_css() {
    ?>
    <style>
        :root {
            /* Animations */
            --anim-speed: <?php echo get_theme_mod('anim_speed_multiplier', 1.0); ?>;
            --cursor-size: <?php echo get_theme_mod('cursor_size', 20); ?>px;

            /* Dark Theme (Default) Overrides */
            --bg-root: <?php echo get_theme_mod('d_bg', '#050505'); ?>;
            --bg-surface: <?php echo get_theme_mod('d_surface', '#0a0a0a'); ?>;
            --text-primary: <?php echo get_theme_mod('d_text', '#FFFFFF'); ?>;
            --text-secondary: <?php echo get_theme_mod('d_text_muted', '#A1A1AA'); ?>;
            --accent-blue: <?php echo get_theme_mod('d_accent', '#3B82F6'); ?>;
        }
    </style>
    <?php
}
add_action( 'wp_head', 'nischhal_customizer_css' );

// Helper function to get category slugs
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