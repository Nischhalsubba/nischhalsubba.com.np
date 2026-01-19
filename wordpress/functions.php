<?php
function nischhal_theme_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ) );
    register_nav_menus( array(
        'primary' => __( 'Primary Menu', 'nischhal' ),
    ) );
}
add_action( 'after_setup_theme', 'nischhal_theme_setup' );

function nischhal_enqueue_scripts() {
    // Enqueue Styles
    wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap', array(), null );
    wp_enqueue_style( 'main-style', get_stylesheet_uri(), array(), '15.0' );

    // Enqueue Scripts
    wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), null, true );
    wp_enqueue_script( 'gsap-scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap'), null, true );
    wp_enqueue_script( 'theme-script', get_template_directory_uri() . '/js/main.js', array('gsap', 'gsap-scrolltrigger'), '15.0', true );
    
    // Pass theme directory to JS for dynamic image paths if needed
    wp_localize_script( 'theme-script', 'themeData', array(
        'templateUrl' => get_template_directory_uri()
    ));
}
add_action( 'wp_enqueue_scripts', 'nischhal_enqueue_scripts' );

// Register Custom Post Type: Project
function nischhal_register_project_cpt() {
    $labels = array(
        'name'                  => 'Projects',
        'singular_name'         => 'Project',
        'menu_name'             => 'Projects',
        'add_new'               => 'Add New',
        'add_new_item'          => 'Add New Project',
        'edit_item'             => 'Edit Project',
        'new_item'              => 'New Project',
        'view_item'             => 'View Project',
        'all_items'             => 'All Projects',
        'search_items'          => 'Search Projects',
        'not_found'             => 'No projects found.',
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'has_archive'        => true,
        'menu_icon'          => 'dashicons-portfolio',
        'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'rewrite'            => array( 'slug' => 'project' ),
        'show_in_rest'       => true,
    );

    register_post_type( 'project', $args );
}
add_action( 'init', 'nischhal_register_project_cpt' );

// Register Taxonomy: Project Category
function nischhal_register_project_taxonomy() {
    register_taxonomy( 'project_category', 'project', array(
        'labels' => array(
            'name' => 'Project Categories',
            'singular_name' => 'Project Category',
        ),
        'hierarchical' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'rewrite' => array( 'slug' => 'project-category' ),
    ));
}
add_action( 'init', 'nischhal_register_project_taxonomy' );

// Helper to get project categories as string for data attribute
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
?>