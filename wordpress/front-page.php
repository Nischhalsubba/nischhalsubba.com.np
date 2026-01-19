

<?php get_header(); ?>

    <?php 
    // Hero Customizer Vars
    $layout_style = get_theme_mod('hero_layout_style', 'hero-v1');
    $h1_line1 = get_theme_mod('hero_h1_line1', 'Crafting scalable');
    $h1_line2 = get_theme_mod('hero_h1_line2', 'digital products.');
    $hero_desc = get_theme_mod('hero_desc', "I’m Nischhal Raj Subba, a Product Designer focusing on complex enterprise software and living design systems. Bridging design vision with engineering reality.");
    
    $btn1_text = get_theme_mod('hero_btn_1_text', 'View Projects');
    $btn1_link = get_theme_mod('hero_btn_1_link', '/work');
    $btn2_text = get_theme_mod('hero_btn_2_text', 'Read Bio');
    $btn2_link = get_theme_mod('hero_btn_2_link', '/about');
    
    $hero_img = get_theme_mod('hero_img', 'https://i.imgur.com/ixsEpYM.png');
    
    // Ticker Pills
    $ticker_raw = get_theme_mod('hero_ticker_items', 'Design Systems, Enterprise UX, Web3 Specialist, #1 Ranked Designer');
    $ticker_items = array_map('trim', explode(',', $ticker_raw));
    ?>

    <main class="container">
      
      <!-- HERO SECTION (Modular) -->
      <section class="hero-section <?php echo esc_attr($layout_style); ?>">
        
        <!-- Ticker -->
        <div class="ticker-wrap reveal-on-scroll">
            <div class="ticker">
                <?php foreach($ticker_items as $item): ?>
                    <span class="ticker-pill"><?php echo esc_html($item); ?></span>
                <?php endforeach; ?>
                <?php foreach($ticker_items as $item): ?>
                    <span class="ticker-pill"><?php echo esc_html($item); ?></span>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="hero-content-wrapper">
            <h1 class="hero-title reveal-on-scroll">
              <span class="text-reveal-wrap">
                <span class="text-outline"><?php echo esc_html($h1_line1); ?></span>
                <span class="text-fill"><?php echo esc_html($h1_line1); ?></span>
              </span><br />
              <span class="text-reveal-wrap">
                <span class="text-outline"><?php echo esc_html($h1_line2); ?></span>
                <span class="text-fill"><?php echo esc_html($h1_line2); ?></span>
              </span>
            </h1>

            <!-- Hero Paragraph Added Here -->
            <p class="body-large reveal-on-scroll">
                <?php echo nl2br(esc_html($hero_desc)); ?>
            </p>
            
            <div class="hero-actions reveal-on-scroll">
              <?php if($btn1_text): ?>
                <a href="<?php echo esc_url(home_url($btn1_link)); ?>" class="btn btn-primary"><?php echo esc_html($btn1_text); ?></a>
              <?php endif; ?>
              <?php if($btn2_text): ?>
                <a href="<?php echo esc_url(home_url($btn2_link)); ?>" class="btn btn-secondary"><?php echo esc_html($btn2_text); ?></a>
              <?php endif; ?>
            </div>
        </div>

        <?php if($hero_img): ?>
        <div class="hero-portrait-container reveal-on-scroll">
            <img src="<?php echo esc_url($hero_img); ?>" alt="Portrait" class="hero-portrait-img img-blend-gradient" />
        </div>
        <?php endif; ?>

      </section>

      <!-- PROJECTS -->
      <section class="section-container">
        <h2 class="section-title reveal-on-scroll">Selected Work</h2>
        <div class="project-grid">
           <?php 
           $projects = new WP_Query(array('post_type' => 'project', 'posts_per_page' => 4));
           if($projects->have_posts()): while($projects->have_posts()): $projects->the_post();
               $thumb = get_the_post_thumbnail_url(get_the_ID(), 'large');
               $cats = get_project_cat_slugs(get_the_ID());
           ?>
           <a href="<?php the_permalink(); ?>" class="project-card reveal-on-scroll" data-category="<?php echo esc_attr($cats); ?>">
               <div class="card-media-wrap">
                   <?php if($thumb): ?><img src="<?php echo esc_url($thumb); ?>"><?php else: ?><div style="height:100%; background:var(--bg-surface);"></div><?php endif; ?>
               </div>
               <div class="card-content">
                   <h3><?php the_title(); ?></h3>
                   <div class="card-meta-line"><span><?php echo get_the_date('Y'); ?></span></div>
               </div>
           </a>
           <?php endwhile; wp_reset_postdata(); endif; ?>
        </div>
        <div style="text-align:center; margin-top:60px;">
            <a href="<?php echo home_url('/work'); ?>" class="btn btn-secondary">View All Work</a>
        </div>
      </section>

      <!-- TESTIMONIALS (Refined) -->
      <section id="testimonials" class="testimonial-section reveal-on-scroll">
         <h2 class="section-title" style="text-align: center;">
             <span class="text-reveal-wrap">
                <span class="text-outline">Kind Words</span>
                <span class="text-fill">Kind Words</span>
            </span>
         </h2>
         <div class="t-track">
             <!-- WP Query Testimonials -->
             <?php 
             $testimonials = new WP_Query(array('post_type' => 'testimonial', 'posts_per_page' => 5));
             $i=0; 
             if($testimonials->have_posts()): while($testimonials->have_posts()): $testimonials->the_post(); 
                $role = get_post_meta(get_the_ID(), 'testimonial_role', true);
                $link = get_post_meta(get_the_ID(), 'testimonial_link', true);
                $thumb_url = get_the_post_thumbnail_url(get_the_ID(), 'thumbnail');
             ?>
             <div class="t-slide <?php echo $i===0 ? 'active' : ''; ?>">
                 <div class="t-quote">"<?php echo strip_tags(get_the_content()); ?>"</div>
                 <div class="t-author">
                     <?php if($thumb_url): ?>
                        <img src="<?php echo esc_url($thumb_url); ?>" alt="<?php the_title(); ?>" class="t-author-img">
                     <?php endif; ?>
                     <h5><?php the_title(); ?></h5>
                     <span><?php echo esc_html($role); ?></span>
                     <?php if($link): ?>
                        <a href="<?php echo esc_url($link); ?>" target="_blank" class="t-link">View Profile</a>
                     <?php endif; ?>
                 </div>
             </div>
             <?php $i++; endwhile; wp_reset_postdata(); endif; ?>
         </div>
         <div class="t-controls">
             <button id="t-prev" class="t-btn">←</button>
             <button id="t-next" class="t-btn">→</button>
         </div>
      </section>

      <!-- INSIGHTS / BLOG -->
      <section class="section-container">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px;" class="reveal-on-scroll">
              <h2 class="section-title" style="margin-bottom: 0;">Insights</h2>
              <a href="<?php echo home_url('/blog'); ?>" class="btn btn-secondary" style="padding: 12px 24px; font-size: 0.9rem;">View all writing</a>
          </div>
          
          <div class="blog-grid reveal-on-scroll">
              <?php 
              $blogs = new WP_Query(array('post_type'=>'post', 'posts_per_page'=>3));
              if($blogs->have_posts()): while($blogs->have_posts()): $blogs->the_post(); ?>
              <a href="<?php the_permalink(); ?>" class="blog-card-modern">
                  <div class="blog-card-meta">
                      <span><?php echo get_the_date('M d, Y'); ?></span>
                      <span><?php $cat = get_the_category(); echo $cat[0]->cat_name; ?></span>
                  </div>
                  <h3 class="blog-card-title"><?php the_title(); ?></h3>
                  <div class="blog-card-excerpt">
                      <?php echo wp_trim_words(get_the_excerpt(), 15); ?>
                  </div>
                  <div class="blog-card-link">
                      Read Article 
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
              </a>
              <?php endwhile; wp_reset_postdata(); endif; ?>
          </div>
      </section>

    </main>

<?php get_footer(); ?>