<?php
/* Template Name: Full Width (No Container) */
get_header(); ?>

<main style="width: 100%;">
    <?php while ( have_posts() ) : the_post(); ?>
        <?php if(!get_post_meta(get_the_ID(), '_nischhal_hide_title', true)): ?>
        <header class="container" style="padding-top: 140px; padding-bottom: 40px; text-align: center;">
            <h1 class="hero-title reveal-on-scroll"><?php the_title(); ?></h1>
            <?php if($sub = get_post_meta(get_the_ID(), '_nischhal_subtitle', true)): ?>
                <p class="body-large reveal-on-scroll"><?php echo esc_html($sub); ?></p>
            <?php endif; ?>
        </header>
        <?php endif; ?>

        <div class="entry-content">
            <?php the_content(); ?>
        </div>
    <?php endwhile; ?>
</main>

<?php get_footer(); ?>