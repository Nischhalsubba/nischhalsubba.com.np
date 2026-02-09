<?php
/* Template Name: Work Page */
get_header(); ?>

    <main class="container">
      <section class="hero-section" style="min-height: 40vh;">
        <h1 class="hero-title reveal-on-scroll">
            <span class="text-reveal-wrap">
                <span class="text-outline">Selected Work</span>
                <span class="text-fill">Selected Work</span>
            </span>
        </h1>
        <p class="body-large reveal-on-scroll">A curated showcase of design systems, complex products, and interaction design.</p>
      </section>

      <div class="search-wrapper reveal-on-scroll">
          <input type="search" id="search-work" class="search-input" placeholder="Search by title, industry, or year..." aria-label="Search projects">
          <button id="clear-work" class="search-clear" aria-label="Clear">x</button>
      </div>

      <div class="filter-row reveal-on-scroll">
          <button class="filter-btn active" data-filter="all">All Projects</button>
          <?php 
            $cats = get_terms( array(
                'taxonomy' => 'project_category',
                'hide_empty' => true,
            ) );
            if ( ! empty( $cats ) && ! is_wp_error( $cats ) ) {
                foreach ( $cats as $cat ) {
                    echo '<button class="filter-btn" data-filter="' . esc_attr( $cat->slug ) . '">' . esc_html( $cat->name ) . '</button>';
                }
            }
          ?>
      </div>

      <section class="section-container" style="padding-top: 0;">
        <div class="project-grid">
           <?php 
           $args = array(
               'post_type' => 'project',
               'posts_per_page' => -1,
           );
           $projects = new WP_Query($args);
           
           if($projects->have_posts()):
               while($projects->have_posts()): $projects->the_post();
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
                    <div style="width:100%; height:100%; background: var(--bg-card); display:flex; align-items:center; justify-content:center; color: var(--text-tertiary);">No Image</div>
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
           <?php endwhile; wp_reset_postdata(); else: ?>
               <p style="color: var(--text-secondary);">No projects found.</p>
           <?php endif; ?>
        </div>
      </section>
    </main>

<?php get_footer(); ?>
