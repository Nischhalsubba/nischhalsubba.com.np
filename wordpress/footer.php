
    <!-- Floating Resume Button -->
    <a href="<?php echo get_template_directory_uri(); ?>/assets/resume.pdf" class="floating-resume-btn" download aria-label="Download Resume">
        <span class="btn-text">Download Resume</span>
        <span class="btn-icon"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="12" y2="18"></line><line x1="15" y1="15" x2="12" y2="18"></line></svg></span>
    </a>

    <footer class="site-footer">
        <div class="container">
            <div class="footer-top-grid">
                <div class="footer-cta">
                    <h2><?php echo nl2br(get_theme_mod('footer_main_heading', "Let's create something awesome.")); ?></h2>
                    <p><?php echo nl2br(get_theme_mod('footer_sub_heading', "Open for opportunities in Enterprise UX & Design Systems.")); ?></p>
                    <a href="mailto:<?php echo get_theme_mod('footer_email', 'hinischalsubba@gmail.com'); ?>" class="footer-email-btn">
                        <?php echo get_theme_mod('footer_email', 'hinischalsubba@gmail.com'); ?>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                    </a>
                </div>
                <div class="footer-nav-grid">
                    <div class="footer-col">
                        <h5><?php echo get_theme_mod('footer_col1_title', 'Sitemap'); ?></h5>
                        <!-- Uses 'footer' menu location, falls back to Pages list -->
                        <?php 
                        if ( has_nav_menu( 'footer' ) ) {
                            wp_nav_menu( array( 'theme_location' => 'footer', 'container' => false, 'items_wrap' => '%3$s', 'depth' => 1 ) );
                        } else {
                            wp_list_pages( array( 'title_li' => '', 'depth' => 1 ) );
                        }
                        ?>
                    </div>
                    <div class="footer-col">
                        <h5><?php echo get_theme_mod('footer_col2_title', 'Socials'); ?></h5>
                        <?php if(get_theme_mod('social_linkedin')): ?><a href="<?php echo get_theme_mod('social_linkedin'); ?>" target="_blank" rel="noopener noreferrer">LinkedIn</a><?php endif; ?>
                        <?php if(get_theme_mod('social_behance')): ?><a href="<?php echo get_theme_mod('social_behance'); ?>" target="_blank" rel="noopener noreferrer">Behance</a><?php endif; ?>
                        <?php if(get_theme_mod('social_dribbble')): ?><a href="<?php echo get_theme_mod('social_dribbble'); ?>" target="_blank" rel="noopener noreferrer">Dribbble</a><?php endif; ?>
                        <?php if(get_theme_mod('social_uxcel')): ?><a href="<?php echo get_theme_mod('social_uxcel'); ?>" target="_blank" rel="noopener noreferrer">Uxcel</a><?php endif; ?>
                        <?php if(get_theme_mod('social_x')): ?><a href="<?php echo get_theme_mod('social_x'); ?>" target="_blank" rel="noopener noreferrer">X (Twitter)</a><?php endif; ?>
                    </div>
                    <div class="footer-col">
                        <h5><?php echo get_theme_mod('footer_col3_title', 'Products'); ?></h5>
                        <?php 
                        // Automatically list Products if any exist
                        $products = new WP_Query(array('post_type'=>'product', 'posts_per_page'=>4));
                        if($products->have_posts()): while($products->have_posts()): $products->the_post(); ?>
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        <?php endwhile; wp_reset_postdata(); else: ?>
                            <?php 
                                $products_url = get_post_type_archive_link('product');
                                if(!$products_url) $products_url = home_url('/products');
                            ?>
                            <a href="<?php echo esc_url($products_url); ?>">Products</a>
                            <a href="<?php echo esc_url($products_url); ?>">UI Kit</a>
                            <a href="<?php echo esc_url($products_url); ?>">System 2.0</a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom-bar">
                <span><?php echo get_theme_mod('footer_copyright', '© 2026 Nischhal Raj Subba. All rights reserved.'); ?></span>
            </div>
        </div>
    </footer>
    <?php wp_footer(); ?>
</body>
</html>
