<?php get_header(); ?>

    <main class="container">
      <section class="hero-section" style="min-height: 40vh;">
        <h1 class="hero-title reveal-on-scroll">
            <span class="text-reveal-wrap">
                <span class="text-outline">Writing</span>
                <span class="text-fill">Writing</span>
            </span>
        </h1>
        <p class="body-large reveal-on-scroll">Thoughts on Design Systems, Product Strategy, and the future of digital interfaces.</p>
      </section>

      <div class="search-wrapper reveal-on-scroll">
            <input type="text" id="search-blog" class="search-input" placeholder="Search articles...">
      </div>

      <section class="section-container" style="padding-top: 0;">
          <div class="writing-list reveal-on-scroll">
              <?php 
              // Set main query to 6 posts
              query_posts('posts_per_page=6');
              if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
                  <a href="<?php the_permalink(); ?>" class="writing-item" data-category="<?php echo strtolower(strip_tags(get_the_category_list(' '))); ?>">
                      <span class="w-date"><?php echo get_the_date('M d, Y'); ?></span>
                      <div class="w-info">
                          <span class="w-title"><?php the_title(); ?></span>
                          <span class="w-summary"><?php echo get_the_excerpt(); ?></span>
                      </div>
                      <span class="w-arrow">→</span>
                  </a>
              <?php endwhile; else : ?>
                  <p><?php esc_html_e( 'No posts found.', 'nischhal' ); ?></p>
              <?php endif; ?>
          </div>
          
          <div class="pagination" style="margin-top: 60px;">
              <?php echo paginate_links(); ?>
          </div>
      </section>
    </main>

<?php get_footer(); ?>