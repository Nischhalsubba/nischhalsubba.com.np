<?php get_header(); ?>

    <main class="container">
      <section class="hero-section" style="min-height: 40vh;">
        <h1 class="hero-title reveal-on-scroll">
            <span class="text-reveal-wrap">
                <span class="text-outline">Work Archive</span>
                <span class="text-fill">Work Archive</span>
            </span>
        </h1>
        <p class="body-large reveal-on-scroll">A complete history of selected projects and design experiments.</p>
      </section>

      <!-- FILTER PILLS -->
      <div class="filter-row reveal-on-scroll">
          <a href="<?php echo home_url('/work'); ?>" class="filter-btn active">All Projects</a>
          <?php 
            $cats = get_terms( array(
                'taxonomy' => 'project_category',
                'hide_empty' => true,
            ) );
            if ( ! empty( $cats ) && ! is_wp_error( $cats ) ) {
                foreach ( $cats as $cat ) {
                    echo '<a href="' . get_term_link($cat) . '" class="filter-btn">' . esc_html( $cat->name ) . '</a>';
                }
            }
          ?>
      </div>

      <section class="section-container" style="padding-top: 0;">
        <div class="project-grid">
           <?php 
           if(have_posts()):
               while(have_posts()): the_post();
                   $cats_slug = get_project_cat_slugs(get_the_ID());
                   $year = get_post_meta(get_the_ID(), 'project_year', true);
                   $industry = get_post_meta(get_the_ID(), 'project_industry', true);
                   $thumb_url = get_the_post_thumbnail_url(get_the_ID(), 'large');
           ?>
           <a href="<?php the_permalink(); ?>" class="project-card reveal-on-scroll" data-category="<?php echo esc_attr($cats_slug); ?>">
               <div class="card-media-wrap">
                   <?php if($thumb_url): ?>
                    <img src="<?php echo esc_url($thumb_url); ?>" alt="<?php the_title(); ?>">
                   <?php else: ?>
                    <div style="width:100%; height:100%; background: #1a1a1a; display:flex; align-items:center; justify-content:center; color:#333;">No Image</div>
                   <?php endif; ?>
               </div>
               <div class="card-content">
                   <h3><?php the_title(); ?></h3>
                   <div class="card-meta-line">
                       <span><?php echo $industry ? esc_html($industry) : 'Design'; ?></span>
                       <span><?php echo $year ? esc_html($year) : get_the_date('Y'); ?></span>
                   </div>
               </div>
           </a>
           <?php endwhile; else: ?>
               <p style="color: var(--text-secondary);">No projects found.</p>
           <?php endif; ?>
        </div>
      </section>
    </main>

<?php get_footer(); ?>