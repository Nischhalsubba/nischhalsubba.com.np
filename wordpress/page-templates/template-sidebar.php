<?php
/* Template Name: Page with Sidebar */
get_header(); ?>

<main class="container" style="padding-top: 140px;">
    <?php while ( have_posts() ) : the_post(); ?>
        
        <?php if(!get_post_meta(get_the_ID(), '_nischhal_hide_title', true)): ?>
        <header style="margin-bottom: 60px;">
            <h1 class="hero-title"><?php the_title(); ?></h1>
            <?php if($sub = get_post_meta(get_the_ID(), '_nischhal_subtitle', true)): ?>
                <p class="body-large"><?php echo esc_html($sub); ?></p>
            <?php endif; ?>
        </header>
        <?php endif; ?>

        <div class="page-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 60px;">
            <div class="entry-content">
                <?php the_content(); ?>
            </div>
            
            <aside class="page-sidebar" style="position: sticky; top: 120px; height: fit-content;">
                <!-- Widgets or Custom Menu could go here -->
                <div style="background: var(--bg-surface); padding: 32px; border-radius: 16px; border: 1px solid var(--border-faint);">
                    <h4 style="font-size: 1rem; text-transform: uppercase; margin-bottom: 16px; color: var(--text-tertiary);">Navigation</h4>
                    <?php
                    wp_nav_menu( array( 
                        'theme_location' => 'primary',
                        'menu_class' => 'sidebar-menu',
                        'container' => false
                    ) );
                    ?>
                </div>
            </aside>
        </div>

    <?php endwhile; ?>
</main>

<?php get_footer(); ?>