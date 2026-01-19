<?php get_header(); ?>

    <main class="container">
      
      <!-- HERO SECTION -->
      <section class="hero-section center-aligned-hero">
        <div class="ticker-wrap reveal-on-scroll">
            <div class="ticker">
                <span class="ticker-pill">Design Systems</span>
                <span class="ticker-pill">Enterprise UX</span>
                <span class="ticker-pill">Web3 Specialist</span>
                <span class="ticker-pill">#1 Ranked Designer</span>
                <span class="ticker-pill">UX Strategy</span>
            </div>
        </div>

        <h1 class="hero-title reveal-on-scroll">
          <span class="text-reveal-wrap">
            <span class="text-outline">Crafting scalable</span>
            <span class="text-fill">Crafting scalable</span>
          </span><br />
          <span class="text-reveal-wrap">
            <span class="text-outline">digital products.</span>
            <span class="text-fill">digital products.</span>
          </span>
        </h1>

        <p class="body-large reveal-on-scroll" style="margin-left: auto; margin-right: auto;">
            I’m Nischhal Raj Subba, a Product Designer focusing on complex enterprise software and living design systems. Bridging design vision with engineering reality.
        </p>
        
        <div class="hero-actions reveal-on-scroll" style="display: flex; gap: 16px; justify-content: center;">
          <a href="<?php echo home_url('/work'); ?>" class="btn btn-primary">View Projects</a>
          <a href="<?php echo home_url('/about'); ?>" class="btn btn-secondary">Read Bio</a>
        </div>

        <div class="hero-portrait-container reveal-on-scroll" style="margin-top: 80px; max-width: 600px; margin-left: auto; margin-right: auto;">
            <img src="https://i.imgur.com/ixsEpYM.png" alt="Nischhal Portrait" class="hero-portrait-img img-blend-gradient" loading="eager" style="width: 100%; border-radius: 20px; opacity: 0.9;" />
        </div>
      </section>

      <!-- ACHIEVEMENTS SECTION -->
      <section class="section-container reveal-on-scroll">
          <div class="achievements-strip">
              <a href="https://uxcel.com/uxcel-rankings" target="_blank" class="achieve-item">
                  <div class="achieve-number">#1</div>
                  <div class="achieve-label">Global Designer<br>Uxcel 2024</div>
              </a>
              <a href="https://app.uxcel.com/ux/nischhal" target="_blank" class="achieve-item">
                  <div class="achieve-number">Top 1%</div>
                  <div class="achieve-label">Verified Product<br>Design Skills</div>
              </a>
              <a href="https://uxcel.com/uxcel-rankings" target="_blank" class="achieve-item">
                  <div class="achieve-number">6+</div>
                  <div class="achieve-label">Years FOCUS<br>Fintech & Web3</div>
              </a>
          </div>
      </section>

      <!-- SELECTED WORK SECTION -->
      <section class="section-container">
        <h2 class="section-title reveal-on-scroll">
            <span class="text-reveal-wrap">
                <span class="text-outline">Selected Work</span>
                <span class="text-fill">Selected Work</span>
            </span>
        </h2>

        <!-- Filter Pills (Links to Archive or JS Filter) - Keeping simple links here or static for home -->
        <div class="filter-row reveal-on-scroll">
            <a href="<?php echo home_url('/work'); ?>" class="filter-btn active">All Projects</a>
            <!-- Simple links to work page for filtering context if needed, or static pills -->
            <span class="filter-btn">Fintech</span>
            <span class="filter-btn">Web3</span>
            <span class="filter-btn">System</span>
        </div>

        <div class="project-grid">
           <?php 
           $args = array(
               'post_type' => 'project',
               'posts_per_page' => 3, // Selected work
           );
           $projects = new WP_Query($args);
           if($projects->have_posts()):
               while($projects->have_posts()): $projects->the_post();
                   $year = get_post_meta(get_the_ID(), 'project_year', true);
                   $industry = get_post_meta(get_the_ID(), 'project_industry', true);
                   $thumb_url = get_the_post_thumbnail_url(get_the_ID(), 'large');
           ?>
           <a href="<?php the_permalink(); ?>" class="project-card reveal-on-scroll">
               <div class="card-media-wrap">
                   <?php if($thumb_url): ?>
                    <img src="<?php echo esc_url($thumb_url); ?>" alt="<?php the_title(); ?>">
                   <?php else: ?>
                    <div style="width:100%; height:100%; background: #1a1a1a;"></div>
                   <?php endif; ?>
               </div>
               <div class="card-content"><h3><?php the_title(); ?></h3><div class="card-meta-line"><span><?php echo $industry ? esc_html($industry) : 'Design'; ?></span><span><?php echo $year ? esc_html($year) : get_the_date('Y'); ?></span></div></div>
           </a>
           <?php endwhile; wp_reset_postdata(); else: ?>
               <p style="color: var(--text-secondary);">No projects found.</p>
           <?php endif; ?>
        </div>
        <div style="margin-top: 60px; text-align: center;">
            <a href="<?php echo home_url('/work'); ?>" class="btn btn-secondary reveal-on-scroll">View All Projects</a>
        </div>
      </section>

      <!-- KIND WORDS (TESTIMONIALS) -->
      <section id="testimonials" class="testimonial-section reveal-on-scroll">
         <h2 class="section-title" style="text-align: center;">
             <span class="text-reveal-wrap">
                <span class="text-outline">Kind Words</span>
                <span class="text-fill">Kind Words</span>
            </span>
         </h2>
         <div class="t-track">
             <div class="t-slide active">
                 <p class="t-quote">"Nischhal's ability to translate complex fintech requirements into a seamless UI is exceptional. His work on our protocol was transformative."</p>
                 <div class="t-author"><h5>Founder</h5><span>Mokshya Protocol</span></div>
             </div>
             <div class="t-slide">
                 <p class="t-quote">"One of the few designers who truly understands design systems. The modularity he provided saved our engineering team months of rework."</p>
                 <div class="t-author"><h5>Lead Engineer</h5><span>Idealaya</span></div>
             </div>
         </div>
         <div class="t-controls">
             <button id="t-prev" class="t-btn">←</button>
             <button id="t-next" class="t-btn">→</button>
         </div>
      </section>

      <!-- INSIGHTS SECTION -->
      <section class="section-container">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px;" class="reveal-on-scroll">
              <h2 class="section-title" style="margin-bottom: 0;">
                  <span class="text-reveal-wrap">
                    <span class="text-outline">Insights</span>
                    <span class="text-fill">Insights</span>
                </span>
              </h2>
              <a href="<?php echo home_url('/blog'); ?>" class="btn btn-secondary" style="padding: 12px 24px; font-size: 0.9rem;">View all writing</a>
          </div>
          <div class="writing-list reveal-on-scroll">
              <?php 
              $blog_query = new WP_Query(array('posts_per_page' => 2));
              if($blog_query->have_posts()):
                  while($blog_query->have_posts()): $blog_query->the_post();
              ?>
              <a href="<?php the_permalink(); ?>" class="writing-item">
                  <span class="w-date"><?php echo get_the_date('M d, Y'); ?></span>
                  <div class="w-info">
                      <span class="w-title"><?php the_title(); ?></span>
                      <span class="w-summary"><?php echo get_the_excerpt(); ?></span>
                  </div>
                  <span class="w-arrow">→</span>
              </a>
              <?php endwhile; wp_reset_postdata(); endif; ?>
          </div>
      </section>

      <!-- READY TO BUILD SECTION -->
      <section class="section-container reveal-on-scroll" style="padding: 140px 0; text-align: center; border-top: 1px solid var(--border-faint);">
          <h2 class="hero-title" style="font-size: clamp(3rem, 6vw, 5rem); margin-bottom: 32px;">
              <span class="text-reveal-wrap">
                <span class="text-outline">Ready to build?</span>
                <span class="text-fill">Ready to build?</span>
            </span>
          </h2>
          <p class="body-large" style="margin: 0 auto 48px auto; max-width: 600px;">
              I’m currently available for select freelance projects and strategic consulting. Let's turn your complex ideas into elegant solutions.
          </p>
          <a href="<?php echo home_url('/contact'); ?>" class="btn btn-primary" style="font-size: 1.1rem; padding: 24px 56px;">Start a Project</a>
      </section>

    </main>

<?php get_footer(); ?>