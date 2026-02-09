
<?php
/**
 * Nischhal Portfolio - Core Functions
 * Version: 17.6 (Full Customizer Restoration)
 */

// --- 1. SETUP & SUPPORT ---
function nischhal_theme_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array('height'=>80, 'width'=>200, 'flex-height'=>true) );
    add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
    add_theme_support( 'align-wide' ); 
    add_theme_support( 'editor-styles' );
    add_theme_support( 'responsive-embeds' );
    add_editor_style( 'style.css' );
    
    add_image_size( 'hero-ultra', 1920, 1080, false ); 
    add_image_size( 'project-card', 800, 600, true ); 
    
    register_nav_menus( array( 
        'primary' => 'Primary Menu (Header)',
        'footer'  => 'Footer Menu'
    ) );
}
add_action( 'after_setup_theme', 'nischhal_theme_setup' );

function nischhal_maybe_flush_rewrite_rules() {
    $theme = wp_get_theme();
    $version = $theme ? $theme->get( 'Version' ) : '1.0';
    $stored = get_option( 'nischhal_theme_version' );
    if ( $stored !== $version ) {
        flush_rewrite_rules();
        update_option( 'nischhal_theme_version', $version );
    }
}
add_action( 'after_setup_theme', 'nischhal_maybe_flush_rewrite_rules' );

// Allow SVG Uploads
function nischhal_mime_types($mimes) {
  $mimes['svg'] = 'image/svg+xml';
  return $mimes;
}
add_filter('upload_mimes', 'nischhal_mime_types');

// --- HELPER FUNCTION ---
function get_project_cat_slugs($post_id) {
    $terms = get_the_terms($post_id, 'project_category');
    if ($terms && !is_wp_error($terms)) {
        $slugs = array();
        foreach ($terms as $term) {
            $slugs[] = $term->slug;
        }
        return implode(' ', $slugs);
    }
    return '';
}

function nischhal_build_menu_item($title, $url, $object_id = 0) {
    return (object) array(
        'url' => $url,
        'title' => $title,
        'object_id' => $object_id,
        'object' => 'page',
        'type' => 'custom'
    );
}

function nischhal_get_default_menu_items() {
    $items = array();
    $front_id = (int) get_option('page_on_front');
    $about_page = get_page_by_path('about');
    $contact_page = get_page_by_path('contact');
    $posts_page_id = (int) get_option('page_for_posts');

    $work_url = get_post_type_archive_link('project');
    if ( ! $work_url ) {
        $work_url = home_url('/work');
    }

    $items[] = nischhal_build_menu_item('Home', home_url('/'), $front_id);
    $items[] = nischhal_build_menu_item('Work', $work_url);
    $items[] = nischhal_build_menu_item('About', $about_page ? get_permalink($about_page->ID) : home_url('/about'), $about_page ? $about_page->ID : 0);
    $items[] = nischhal_build_menu_item('Writing', $posts_page_id ? get_permalink($posts_page_id) : home_url('/blog'), $posts_page_id);
    $items[] = nischhal_build_menu_item('Contact', $contact_page ? get_permalink($contact_page->ID) : home_url('/contact'), $contact_page ? $contact_page->ID : 0);

    return $items;
}

// --- 2. ENQUEUE SCRIPTS & STYLES ---
function nischhal_scripts() {
    // 1. Dynamic Google Fonts based on Customizer
    $heading_font = get_theme_mod('typo_heading_family', 'Playfair Display');
    $body_font = get_theme_mod('typo_body_family', 'Inter');
    
    $fonts_url = 'https://fonts.googleapis.com/css2?family=' . urlencode($heading_font) . ':ital,wght@0,400;0,500;0,600;1,400&family=' . urlencode($body_font) . ':wght@300;400;500;600&display=swap';
    wp_enqueue_style( 'nischhal-fonts', $fonts_url, array(), null );

    // 2. Main Stylesheet
    wp_enqueue_style( 'nischhal-style', get_stylesheet_uri(), array(), '17.6' );

    // 3. GSAP Animation Libs
    wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), '3.12.2', true );
    wp_enqueue_script( 'gsap-scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap'), '3.12.2', true );

    // 4. Main Theme JS
    wp_enqueue_script( 'nischhal-script', get_template_directory_uri() . '/js/main.js', array('gsap'), '17.6', true );
    
    // 5. Pass PHP vars to JS
    $theme_config = array(
        'imgDark' => get_theme_mod('hero_img', 'https://i.imgur.com/ixsEpYM.png'),
        'imgLight' => get_theme_mod('hero_img_light', 'https://i.imgur.com/oFHdPUS.png'),
        'animSpeed' => get_theme_mod('anim_speed', 1.0),
        'cursorEnable' => get_theme_mod('cursor_enable', true),
        'perfMode' => get_theme_mod('perf_mode', false)
    );
    wp_localize_script( 'nischhal-script', 'themeConfig', $theme_config );
}
add_action( 'wp_enqueue_scripts', 'nischhal_scripts' );

function nischhal_create_page_if_missing($title, $slug, $template = '') {
    $existing = get_page_by_path($slug);
    if ( $existing ) {
        return $existing->ID;
    }
    $page_id = wp_insert_post(array(
        'post_title' => $title,
        'post_name' => $slug,
        'post_status' => 'publish',
        'post_type' => 'page'
    ));
    if ( $page_id && $template ) {
        update_post_meta($page_id, '_wp_page_template', $template);
    }
    return $page_id;
}

function nischhal_on_theme_activation() {
    nischhal_create_page_if_missing('About', 'about', 'page-about.php');
    nischhal_create_page_if_missing('Contact', 'contact', 'page-contact.php');

    $writing_id = nischhal_create_page_if_missing('Writing', 'writing', '');
    if ( $writing_id && ! get_option('page_for_posts') ) {
        update_option('page_for_posts', $writing_id);
    }

    flush_rewrite_rules();
}
add_action('after_switch_theme', 'nischhal_on_theme_activation');

// --- 3. SEO & SCHEMA ---
function nischhal_seo_schema() {
    global $post;
    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'Person',
        'name' => get_bloginfo('name'),
        'url' => home_url(),
        'image' => get_theme_mod('hero_img', 'https://i.imgur.com/ixsEpYM.png'),
        'jobTitle' => 'Product Designer',
        'sameAs' => [
            get_theme_mod('social_linkedin'),
            get_theme_mod('social_behance'),
            get_theme_mod('social_x')
        ]
    ];
    if ( is_single() && get_post_type() == 'post' ) {
        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            'headline' => get_the_title(),
            'image' => get_the_post_thumbnail_url($post->ID, 'large'),
            'datePublished' => get_the_date('c'),
            'author' => ['@type' => 'Person', 'name' => get_the_author()],
            'description' => get_the_excerpt()
        ];
    }
    echo '<script type="application/ld+json">' . json_encode($schema) . '</script>';
}
add_action('wp_head', 'nischhal_seo_schema');

function nischhal_output_meta_tags() {
    if ( defined('WPSEO_VERSION') || class_exists('RankMath') || class_exists('All_in_One_SEO_Pack') ) {
        return;
    }

    global $post, $wp;
    $default_desc = 'Product designer specializing in design systems, enterprise UX, and Web3 product design.';
    $title = wp_get_document_title();
    $description = $default_desc;

    if ( is_singular() && $post ) {
        if ( has_excerpt( $post->ID ) ) {
            $description = get_the_excerpt( $post );
        } else {
            $description = wp_trim_words( wp_strip_all_tags( $post->post_content ), 28 );
        }
    } elseif ( is_post_type_archive( 'project' ) ) {
        $description = 'Selected product design and Web3 case studies by Nischhal Raj Subba.';
    } elseif ( is_post_type_archive( 'product' ) ) {
        $description = 'Digital products, UI kits, and design system assets by Nischhal Raj Subba.';
    } elseif ( is_home() || is_archive() ) {
        $description = 'Writing on design systems, product strategy, and Web3 UX by Nischhal Raj Subba.';
    } elseif ( is_front_page() ) {
        $description = get_bloginfo( 'description' ) ? get_bloginfo( 'description' ) : $default_desc;
    }

    $url = is_singular() && $post ? get_permalink( $post ) : home_url( add_query_arg( array(), $wp->request ) );
    $image = get_theme_mod( 'hero_img', 'https://i.imgur.com/ixsEpYM.png' );
    if ( is_singular() && $post && has_post_thumbnail( $post->ID ) ) {
        $image = get_the_post_thumbnail_url( $post->ID, 'large' );
    }

    echo '<meta name="description" content="' . esc_attr( $description ) . '" />' . "\n";
    echo '<link rel="canonical" href="' . esc_url( $url ) . '" />' . "\n";
    echo '<meta property="og:type" content="' . ( is_singular() ? 'article' : 'website' ) . '" />' . "\n";
    echo '<meta property="og:title" content="' . esc_attr( $title ) . '" />' . "\n";
    echo '<meta property="og:description" content="' . esc_attr( $description ) . '" />' . "\n";
    echo '<meta property="og:url" content="' . esc_url( $url ) . '" />' . "\n";
    if ( $image ) {
        echo '<meta property="og:image" content="' . esc_url( $image ) . '" />' . "\n";
        echo '<meta name="twitter:image" content="' . esc_url( $image ) . '" />' . "\n";
    }
    echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
    echo '<meta name="twitter:title" content="' . esc_attr( $title ) . '" />' . "\n";
    echo '<meta name="twitter:description" content="' . esc_attr( $description ) . '" />' . "\n";
}
add_action('wp_head', 'nischhal_output_meta_tags', 5);

// --- 4. CUSTOM POST TYPES ---
function nischhal_register_post_types() {
    register_post_type('project', array(
        'labels' => array('name' => 'Projects', 'singular_name' => 'Project', 'menu_name' => '💼 Projects'),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-portfolio',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'show_in_rest' => true, 
        'rewrite' => array('slug' => 'work'),
    ));
    register_taxonomy('project_category', 'project', array(
        'labels' => array('name' => 'Project Categories', 'singular_name' => 'Category'),
        'hierarchical' => true,
        'show_in_rest' => true,
        'public' => true
    ));
    register_post_type('product', array(
        'labels' => array('name' => 'Products', 'singular_name' => 'Product', 'menu_name' => '📦 Products'),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-cart',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_rest' => true, 
        'rewrite' => array('slug' => 'products'),
    ));
    register_post_type('testimonial', array(
        'labels' => array('name' => 'Testimonials', 'singular_name' => 'Testimonial', 'menu_name' => '💬 Testimonials'),
        'public' => true,
        'publicly_queryable' => false, 
        'show_ui' => true,
        'menu_icon' => 'dashicons-format-quote',
        'supports' => array('title', 'editor', 'thumbnail'),
        'show_in_rest' => true,
    ));
}
add_action('init', 'nischhal_register_post_types');

function nischhal_rename_posts_menu() {
    global $menu, $submenu;
    $menu[5][0] = 'Writing'; 
    $submenu['edit.php'][5][0] = 'All Writing';
}
add_action('admin_menu', 'nischhal_rename_posts_menu');

// --- 5. CUSTOM FIELDS ---
function nischhal_add_meta_boxes() {
    add_meta_box('project_meta', '🚀 Project Details', 'nischhal_render_project_meta', 'project', 'side', 'high');
    add_meta_box('product_meta', '📦 Product Details', 'nischhal_render_product_meta', 'product', 'side', 'high');
    add_meta_box('writing_meta', '📝 Writing Details', 'nischhal_render_writing_meta', 'post', 'side', 'high');
    add_meta_box('testimonial_meta', '👤 Author Details', 'nischhal_render_testimonial_meta', 'testimonial', 'normal', 'high');
}
add_action('add_meta_boxes', 'nischhal_add_meta_boxes');

function nischhal_render_project_meta($post) {
    wp_nonce_field('nischhal_save_meta', 'nischhal_meta_nonce');
    $fields = ['project_year'=>'Year', 'project_industry'=>'Industry', 'project_role'=>'Role', 'project_team'=>'Team', 'project_timeline'=>'Timeline', 'project_outcome'=>'Outcome', 'project_live_url'=>'Live URL'];
    foreach($fields as $key => $label) {
        $val = get_post_meta($post->ID, $key, true);
        echo '<div style="margin-bottom:10px;"><label style="display:block;font-weight:600;">'.$label.'</label><input type="text" name="'.$key.'" value="'.esc_attr($val).'" style="width:100%;"></div>';
    }
}
function nischhal_render_product_meta($post) {
    wp_nonce_field('nischhal_save_meta', 'nischhal_meta_nonce');
    $price = get_post_meta($post->ID, 'product_price', true);
    $format = get_post_meta($post->ID, 'product_format', true);
    $version = get_post_meta($post->ID, 'product_version', true);
    $link = get_post_meta($post->ID, 'product_link', true);
    echo '<div style="margin-bottom:10px;"><label>Price</label><input type="text" name="product_price" value="'.esc_attr($price).'" style="width:100%;"></div>';
    echo '<div style="margin-bottom:10px;"><label>Format</label><input type="text" name="product_format" value="'.esc_attr($format).'" style="width:100%;"></div>';
    echo '<div style="margin-bottom:10px;"><label>Link</label><input type="url" name="product_link" value="'.esc_attr($link).'" style="width:100%;"></div>';
}
function nischhal_render_writing_meta($post) {
    wp_nonce_field('nischhal_save_meta', 'nischhal_meta_nonce');
    $read_time = get_post_meta($post->ID, 'writing_read_time', true);
    echo '<div style="margin-bottom:10px;"><label>Read Time</label><input type="text" name="writing_read_time" value="'.esc_attr($read_time).'" style="width:100%;"></div>';
}
function nischhal_render_testimonial_meta($post) {
    wp_nonce_field('nischhal_save_meta', 'nischhal_meta_nonce');
    $role = get_post_meta($post->ID, 'testimonial_role', true);
    echo '<div style="margin-bottom:10px;"><label>Role</label><input type="text" name="testimonial_role" value="'.esc_attr($role).'" style="width:100%;"></div>';
}

function nischhal_save_meta_data($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!isset($_POST['nischhal_meta_nonce']) || !wp_verify_nonce($_POST['nischhal_meta_nonce'], 'nischhal_save_meta')) return;
    $fields = ['project_year', 'project_role', 'project_industry', 'project_team', 'project_timeline', 'project_outcome', 'project_live_url', 'product_price', 'product_format', 'product_version', 'product_link', 'writing_read_time', 'testimonial_role'];
    foreach ($fields as $field) {
        if (isset($_POST[$field])) update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
    }
}
add_action('save_post', 'nischhal_save_meta_data');

// --- 6. EXPANDED CUSTOMIZER ---
function nischhal_customize_register( $wp_customize ) {
    
    // --- Panel: Nischhal Design System ---
    $wp_customize->add_panel('nrs_design_system', array(
        'title' => '⚡ Nischhal Design System',
        'priority' => 10,
        'description' => 'Global design tokens for the entire portfolio.'
    ));

    // SECTION: Interaction & Cursors
    $wp_customize->add_section('nrs_interaction', array('title'=>'Interaction & Cursors', 'panel'=>'nrs_design_system'));
    
    $wp_customize->add_setting('cursor_enable', array('default'=>true, 'transport'=>'refresh'));
    $wp_customize->add_control('cursor_enable', array('section'=>'nrs_interaction', 'label'=>'Enable Custom Cursor', 'type'=>'checkbox'));
    
    $wp_customize->add_setting('cursor_size', array('default'=>20, 'transport'=>'refresh'));
    $wp_customize->add_control('cursor_size', array('section'=>'nrs_interaction', 'label'=>'Cursor Size (px)', 'type'=>'number', 'input_attrs'=>array('min'=>10, 'max'=>50)));

    $wp_customize->add_setting('anim_speed', array('default'=>1.0, 'transport'=>'refresh'));
    $wp_customize->add_control('anim_speed', array('section'=>'nrs_interaction', 'label'=>'Animation Speed Multiplier', 'type'=>'range', 'input_attrs'=>array('min'=>0.5, 'max'=>2.0, 'step'=>0.1)));

    $wp_customize->add_setting('perf_mode', array('default'=>false, 'transport'=>'refresh'));
    $wp_customize->add_control('perf_mode', array('section'=>'nrs_interaction', 'label'=>'Performance Mode (Reduce Motion)', 'type'=>'checkbox', 'description'=>'Reduces heavy animations for better performance on low-end devices.'));

    // SECTION: Design: Colors (Dark)
    $wp_customize->add_section('nrs_colors_dark', array('title'=>'Design: Colors (Dark)', 'panel'=>'nrs_design_system'));
    $colors_dark = [
        'd_bg' => ['#050505', 'Background Root'],
        'd_surface' => ['#0a0a0a', 'Surface Color'],
        'd_text' => ['#FFFFFF', 'Primary Text'],
        'd_text_muted' => ['#D4D4D8', 'Secondary Text'],
        'd_border' => ['rgba(255,255,255,0.08)', 'Border Color'],
        'd_accent' => ['#3B82F6', 'Accent Color']
    ];
    foreach($colors_dark as $id => $data) {
        $wp_customize->add_setting($id, array('default'=>$data[0], 'transport'=>'refresh'));
        $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, $id, array('label'=>$data[1], 'section'=>'nrs_colors_dark')));
    }

    // SECTION: Design: Colors (Light)
    $wp_customize->add_section('nrs_colors_light', array('title'=>'Design: Colors (Light)', 'panel'=>'nrs_design_system'));
    $colors_light = [
        'l_bg' => ['#FFFFFF', 'Background Root'],
        'l_surface' => ['#F8FAFC', 'Surface Color'],
        'l_text' => ['#0F172A', 'Primary Text'],
        'l_text_muted' => ['#475569', 'Secondary Text'],
        'l_border' => ['rgba(0,0,0,0.08)', 'Border Color'],
        'l_accent' => ['#2563EB', 'Accent Color']
    ];
    foreach($colors_light as $id => $data) {
        $wp_customize->add_setting($id, array('default'=>$data[0], 'transport'=>'refresh'));
        $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, $id, array('label'=>$data[1], 'section'=>'nrs_colors_light')));
    }

    // SECTION: Design: Typography
    $wp_customize->add_section('nrs_typography', array('title'=>'Design: Typography', 'panel'=>'nrs_design_system'));
    $wp_customize->add_setting('typo_heading_family', array('default'=>'Playfair Display', 'transport'=>'refresh'));
    $wp_customize->add_control('typo_heading_family', array('section'=>'nrs_typography', 'label'=>'Heading Font Family', 'type'=>'text'));
    $wp_customize->add_setting('typo_body_family', array('default'=>'Inter', 'transport'=>'refresh'));
    $wp_customize->add_control('typo_body_family', array('section'=>'nrs_typography', 'label'=>'Body Font Family', 'type'=>'text'));

    // SECTION: Design: Layout
    $wp_customize->add_section('nrs_layout', array('title'=>'Design: Layout', 'panel'=>'nrs_design_system'));
    $wp_customize->add_setting('container_width', array('default'=>'1200px', 'transport'=>'refresh'));
    $wp_customize->add_control('container_width', array('section'=>'nrs_layout', 'label'=>'Max Container Width', 'type'=>'text'));
    $wp_customize->add_setting('section_gap', array('default'=>'160px', 'transport'=>'refresh'));
    $wp_customize->add_control('section_gap', array('section'=>'nrs_layout', 'label'=>'Section Vertical Gap', 'type'=>'text'));
    $wp_customize->add_setting('grid_opacity', array('default'=>0.05, 'transport'=>'refresh'));
    $wp_customize->add_control('grid_opacity', array('section'=>'nrs_layout', 'label'=>'Background Grid Opacity', 'type'=>'number', 'input_attrs'=>array('min'=>0, 'max'=>1, 'step'=>0.01)));

    // --- HOME HERO SECTION ---
    $wp_customize->add_section('sec_hero', array('title'=>'🏠 Home: Hero', 'priority'=>30));
    
    $wp_customize->add_setting('hero_layout_style', array('default'=>'hero-v1', 'transport'=>'refresh'));
    $wp_customize->add_control('hero_layout_style', array('section'=>'sec_hero', 'label'=>'Layout Style', 'type'=>'select', 'choices'=>array('hero-v1'=>'Center Aligned', 'hero-v2'=>'Left Aligned')));

    $wp_customize->add_setting('hero_h1_line1', array('default'=>'Crafting scalable'));
    $wp_customize->add_control('hero_h1_line1', array('section'=>'sec_hero', 'label'=>'Headline Line 1', 'type'=>'text'));
    
    $wp_customize->add_setting('hero_h1_line2', array('default'=>'digital products.'));
    $wp_customize->add_control('hero_h1_line2', array('section'=>'sec_hero', 'label'=>'Headline Line 2', 'type'=>'text'));
    
    $wp_customize->add_setting('hero_desc', array('default'=>"I’m Nischhal Raj Subba..."));
    $wp_customize->add_control('hero_desc', array('section'=>'sec_hero', 'label'=>'Hero Description', 'type'=>'textarea'));
    
    // Hero Buttons
    $wp_customize->add_setting('hero_btn_1_text', array('default'=>'View Projects'));
    $wp_customize->add_control('hero_btn_1_text', array('section'=>'sec_hero', 'label'=>'Primary Button Text', 'type'=>'text'));
    $wp_customize->add_setting('hero_btn_1_page');
    $wp_customize->add_control('hero_btn_1_page', array('section'=>'sec_hero', 'label'=>'Primary Button Link', 'type'=>'dropdown-pages'));

    $wp_customize->add_setting('hero_btn_2_text', array('default'=>'Read Bio'));
    $wp_customize->add_control('hero_btn_2_text', array('section'=>'sec_hero', 'label'=>'Secondary Button Text', 'type'=>'text'));
    $wp_customize->add_setting('hero_btn_2_page');
    $wp_customize->add_control('hero_btn_2_page', array('section'=>'sec_hero', 'label'=>'Secondary Button Link', 'type'=>'dropdown-pages'));

    $wp_customize->add_setting('hero_img', array('default'=>'https://i.imgur.com/ixsEpYM.png'));
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'hero_img', array('label'=>'Portrait Image (Dark Mode)', 'section'=>'sec_hero')));

    $wp_customize->add_setting('hero_img_light', array('default'=>'https://i.imgur.com/oFHdPUS.png'));
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'hero_img_light', array('label'=>'Portrait Image (Light Mode)', 'section'=>'sec_hero')));

    $wp_customize->add_setting('hero_ticker_items', array('default'=>'Design Systems, Enterprise UX, Web3 Specialist'));
    $wp_customize->add_control('hero_ticker_items', array('section'=>'sec_hero', 'label'=>'Ticker Items (Comma Separated)', 'type'=>'textarea'));

    // --- HOME STATS ---
    $wp_customize->add_section('sec_home_stats', array('title'=>'🏠 Home: Stats/Achievements', 'priority'=>31));
    for($i=1; $i<=3; $i++) {
        $wp_customize->add_setting("stat_{$i}_num", array('default'=>'#1'));
        $wp_customize->add_control("stat_{$i}_num", array('section'=>'sec_home_stats', 'label'=>"Stat $i Number", 'type'=>'text'));
        $wp_customize->add_setting("stat_{$i}_label", array('default'=>'Ranked Designer'));
        $wp_customize->add_control("stat_{$i}_label", array('section'=>'sec_home_stats', 'label'=>"Stat $i Label", 'type'=>'textarea'));
        $wp_customize->add_setting("stat_{$i}_url", array('default'=>''));
        $wp_customize->add_control("stat_{$i}_url", array('section'=>'sec_home_stats', 'label'=>"Stat $i Link", 'type'=>'url'));
    }

    // --- GLOBAL LABELS ---
    $wp_customize->add_section('sec_labels', array('title'=>'📝 Global: Text Labels', 'priority'=>35));
    $labels = [
        'title_selected_work' => 'Selected Work',
        'btn_view_all_work' => 'View All Projects',
        'title_testimonials' => 'Kind Words',
        'title_insights' => 'Insights',
        'btn_view_all_blog' => 'View all writing'
    ];
    foreach($labels as $id => $def) {
        $wp_customize->add_setting($id, array('default'=>$def));
        $wp_customize->add_control($id, array('section'=>'sec_labels', 'label'=>$def, 'type'=>'text'));
    }

    // --- FOOTER SECTION ---
    $wp_customize->add_section('sec_footer', array('title'=>'Footer', 'priority'=>40));
    
    $wp_customize->add_setting('footer_main_heading', array('default'=>"Let's create something awesome."));
    $wp_customize->add_control('footer_main_heading', array('section'=>'sec_footer', 'label'=>'Main Heading', 'type'=>'textarea'));
    
    $wp_customize->add_setting('footer_sub_heading', array('default'=>"Open for opportunities in Enterprise UX & Design Systems."));
    $wp_customize->add_control('footer_sub_heading', array('section'=>'sec_footer', 'label'=>'Sub Heading', 'type'=>'textarea'));

    $wp_customize->add_setting('footer_email', array('default'=>'hinischalsubba@gmail.com'));
    $wp_customize->add_control('footer_email', array('section'=>'sec_footer', 'label'=>'Contact Email', 'type'=>'text'));
    
    $wp_customize->add_setting('footer_col1_title', array('default'=>'Sitemap'));
    $wp_customize->add_control('footer_col1_title', array('section'=>'sec_footer', 'label'=>'Column 1 Title', 'type'=>'text'));
    
    $wp_customize->add_setting('footer_col2_title', array('default'=>'Socials'));
    $wp_customize->add_control('footer_col2_title', array('section'=>'sec_footer', 'label'=>'Column 2 Title', 'type'=>'text'));
    
    $wp_customize->add_setting('footer_col3_title', array('default'=>'Products'));
    $wp_customize->add_control('footer_col3_title', array('section'=>'sec_footer', 'label'=>'Column 3 Title', 'type'=>'text'));

    $wp_customize->add_setting('footer_copyright', array('default'=>'© 2026 Nischhal Raj Subba. All rights reserved.'));
    $wp_customize->add_control('footer_copyright', array('section'=>'sec_footer', 'label'=>'Copyright Text', 'type'=>'text'));

    // Socials
    $socials = ['linkedin'=>'LinkedIn', 'behance'=>'Behance', 'dribbble'=>'Dribbble', 'uxcel'=>'Uxcel', 'x'=>'X (Twitter)'];
    foreach($socials as $key => $label) {
        $wp_customize->add_setting("social_$key", array('default'=>''));
        $wp_customize->add_control("social_$key", array('section'=>'sec_footer', 'label'=>"$label URL", 'type'=>'url'));
    }

    // --- HOME CTA ---
    $wp_customize->add_section('sec_home_cta', array('title'=>'🏠 Home: Bottom CTA', 'priority'=>32));
    $wp_customize->add_setting('cta_ready_title', array('default'=>'Ready to build?'));
    $wp_customize->add_control('cta_ready_title', array('section'=>'sec_home_cta', 'label'=>'Title', 'type'=>'text'));
    $wp_customize->add_setting('cta_ready_desc', array('default'=>'I am currently available...'));
    $wp_customize->add_control('cta_ready_desc', array('section'=>'sec_home_cta', 'label'=>'Description', 'type'=>'textarea'));
    $wp_customize->add_setting('cta_ready_btn', array('default'=>'Start a Project'));
    $wp_customize->add_control('cta_ready_btn', array('section'=>'sec_home_cta', 'label'=>'Button Text', 'type'=>'text'));
    $wp_customize->add_setting('cta_ready_page');
    $wp_customize->add_control('cta_ready_page', array('section'=>'sec_home_cta', 'label'=>'Button Link', 'type'=>'dropdown-pages'));
}
add_action( 'customize_register', 'nischhal_customize_register' );

// --- 7. CUSTOMIZER CSS INJECTION ---
function nischhal_customizer_css() {
    ?>
    <style>
        :root {
            --max-width: <?php echo get_theme_mod('container_width', '1200px'); ?>;
            --section-gap: <?php echo get_theme_mod('section_gap', '160px'); ?>;
            --font-serif: "<?php echo get_theme_mod('typo_heading_family', 'Playfair Display'); ?>", serif;
            --font-sans: "<?php echo get_theme_mod('typo_body_family', 'Inter'); ?>", sans-serif;
            --anim-speed: <?php echo get_theme_mod('anim_speed', 1.0); ?>;
            --cursor-size: <?php echo get_theme_mod('cursor_size', 20); ?>px;
            
            /* Dark Theme (Default) */
            --bg-root: <?php echo get_theme_mod('d_bg', '#050505'); ?>;
            --bg-surface: <?php echo get_theme_mod('d_surface', '#0a0a0a'); ?>;
            --text-primary: <?php echo get_theme_mod('d_text', '#FFFFFF'); ?>;
            --text-secondary: <?php echo get_theme_mod('d_text_muted', '#D4D4D8'); ?>;
            --border-faint: <?php echo get_theme_mod('d_border', 'rgba(255,255,255,0.08)'); ?>;
            --accent-blue: <?php echo get_theme_mod('d_accent', '#3B82F6'); ?>;
            
            --cursor-color: #FFFFFF;
            --grid-color-dark: rgba(255, 255, 255, 0.05);
            --grid-color-light: rgba(0, 0, 0, 0.05);
        }
        [data-theme="light"] {
            --bg-root: <?php echo get_theme_mod('l_bg', '#FFFFFF'); ?>;
            --bg-surface: <?php echo get_theme_mod('l_surface', '#F8FAFC'); ?>;
            --text-primary: <?php echo get_theme_mod('l_text', '#0F172A'); ?>;
            --text-secondary: <?php echo get_theme_mod('l_text_muted', '#475569'); ?>;
            --border-faint: <?php echo get_theme_mod('l_border', 'rgba(0,0,0,0.08)'); ?>;
            --accent-blue: <?php echo get_theme_mod('l_accent', '#2563EB'); ?>;
            --cursor-color: #000000;
        }
        #grid-canvas { opacity: <?php echo get_theme_mod('grid_opacity', 0.05); ?> !important; }
        
        <?php if(get_theme_mod('perf_mode', false)): ?>
        *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        .custom-cursor-dot, .custom-cursor-outline { display: none !important; }
        <?php endif; ?>
    </style>
    <?php
}
add_action( 'wp_head', 'nischhal_customizer_css' );

// --- 8. BLOCK PATTERNS (The Building Experience) ---
function nischhal_register_patterns() {
    register_block_pattern_category('nrs-portfolio', array('label'=>__('Nischhal Portfolio', 'nischhal')));

    // Pattern: Hero Default
    register_block_pattern('nrs/hero-default', array(
        'title' => 'Hero: Default Portfolio',
        'categories' => array('nrs-portfolio'),
        'content' => '<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group hero-section"><h1 class="hero-title">Crafting scalable<br>digital products.</h1><p class="body-large">I am a Product Designer specializing in Design Systems and Enterprise UX.</p><div class="hero-actions"><!-- wp:button {"className":"btn btn-primary"} --><div class="wp-block-button btn btn-primary"><a class="wp-block-button__link">View Projects</a></div><!-- /wp:button --></div></div>
<!-- /wp:group -->'
    ));

    // Pattern: Stats Strip
    register_block_pattern('nrs/stats-strip', array(
        'title' => 'Stats: Achievements Strip',
        'categories' => array('nrs-portfolio'),
        'content' => '<!-- wp:group {"className":"achievements-strip","layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-group achievements-strip"><div class="achieve-item"><div class="achieve-number">#1</div><div class="achieve-label">Ranked Designer</div></div><div class="achieve-item"><div class="achieve-number">6+</div><div class="achieve-label">Years Experience</div></div></div>
<!-- /wp:group -->'
    ));

    // Pattern: Case Study Header
    register_block_pattern('nrs/case-study-header', array(
        'title' => 'Case Study: Header with Meta',
        'categories' => array('nrs-portfolio'),
        'content' => '<!-- wp:group {"className":"hero-section","style":{"spacing":{"padding":{"bottom":"40px"}}}} -->
<div class="wp-block-group hero-section" style="padding-bottom:40px"><div class="case-meta-chips"><!-- wp:paragraph {"className":"badge-pill"} --><p class="badge-pill">Fintech</p><!-- /wp:paragraph --></div><h1 class="hero-title">Project Name</h1><p class="body-large">A brief description of the project outcome.</p></div>
<!-- /wp:group -->'
    ));
    
    // Pattern: Content with Sidebar
    register_block_pattern('nrs/blog-layout', array(
        'title' => 'Layout: Content with Sidebar',
        'categories' => array('nrs-portfolio'),
        'content' => '<!-- wp:group {"className":"container"} --><div class="wp-block-group container"><div class="blog-layout" style="display: grid; grid-template-columns: 1fr 300px; gap: 80px;"><!-- wp:group --><div class="wp-block-group body-large"><!-- wp:paragraph --><p>Main content goes here...</p><!-- /wp:paragraph --></div><!-- /wp:group --><!-- wp:group {"tagName":"aside","className":"blog-sidebar"} --><aside class="wp-block-group blog-sidebar"><!-- wp:heading {"level":5} --><h5>Share</h5><!-- /wp:heading --></aside><!-- /wp:group --></div></div><!-- /wp:group -->'
    ));
}
add_action('init', 'nischhal_register_patterns');

// --- 9. DEMO CONTENT GENERATOR (Admin Hook) ---
function nischhal_generate_demo_content() {
    if (isset($_GET['nrs_generate_demo']) && current_user_can('manage_options')) {
        // Create a Sample Project
        $post_id = wp_insert_post(array(
            'post_title' => 'Mokshya Protocol',
            'post_content' => '<!-- wp:paragraph --><p>Case study summary: product design for an open-source Web3 protocol with trust-first onboarding and governance clarity.</p><!-- /wp:paragraph -->',
            'post_status' => 'publish',
            'post_type' => 'project'
        ));
        update_post_meta($post_id, 'project_role', 'Lead Product Designer');
        update_post_meta($post_id, 'project_year', '2024');
        
        // Create a Sample Blog Post
        wp_insert_post(array(
            'post_title' => 'Design Systems That Survive Scale',
            'post_content' => '<!-- wp:paragraph --><p>Governance, tokens, and release cadence are what keep systems alive at enterprise scale.</p><!-- /wp:paragraph -->',
            'post_status' => 'publish',
            'post_type' => 'post'
        ));

        // Create a Sample Testimonial
        $test_id = wp_insert_post(array(
            'post_title' => 'John Doe',
            'post_content' => 'Nischhal is an incredible designer who understands code.',
            'post_status' => 'publish',
            'post_type' => 'testimonial'
        ));
        update_post_meta($test_id, 'testimonial_role', 'CTO, TechCorp');

        wp_redirect(admin_url('edit.php?post_type=project'));
        exit;
    }
}
add_action('admin_init', 'nischhal_generate_demo_content');

// Admin Notice for Demo Content
function nischhal_demo_notice() {
    global $pagenow;
    if ($pagenow == 'themes.php') {
        echo '<div class="notice notice-info is-dismissible"><p><strong>Nischhal Portfolio:</strong> Need sample data? <a href="'.admin_url('?nrs_generate_demo=true').'" class="button button-primary">Generate Demo Content</a></p></div>';
    }
}
add_action('admin_notices', 'nischhal_demo_notice');
