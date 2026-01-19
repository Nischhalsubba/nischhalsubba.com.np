<?php get_header(); ?>
<main class="container">
    <section class="section-container" style="min-height: 50vh; display:flex; flex-direction:column; justify-content:center;">
        <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
            <h1 class="hero-title"><?php the_title(); ?></h1>
            <div class="body-large" style="color: var(--text-secondary);">
                <?php the_content(); ?>
            </div>
        <?php endwhile; else : ?>
            <h1>Nothing found</h1>
        <?php endif; ?>
    </section>
</main>
<?php get_footer(); ?>