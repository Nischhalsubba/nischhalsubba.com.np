    <!-- Floating Resume Button (Outside Footer for correct z-index) -->
    <a href="<?php echo get_template_directory_uri(); ?>/assets/resume.pdf" class="floating-resume-btn" download aria-label="Download Resume">
        <span class="btn-text">Download Resume</span>
        <span class="btn-icon"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="12" y2="18"></line><line x1="15" y1="15" x2="12" y2="18"></line></svg></span>
    </a>

    <footer class="site-footer">
        <div class="container">
            <div class="footer-top-grid">
                <div class="footer-cta">
                    <h2>Let's create<br>something<br><span style="font-style: italic;">awesome.</span></h2>
                    <p>Open for opportunities in Enterprise UX, Design Systems, and Web3 Product Design.</p>
                    <a href="mailto:<?php echo get_theme_mod('footer_email', 'hinischalsubba@gmail.com'); ?>" class="footer-email-btn">
                        <?php echo get_theme_mod('footer_email', 'hinischalsubba@gmail.com'); ?>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                    </a>
                </div>
                <div class="footer-nav-grid">
                    <div class="footer-col">
                        <h5>Sitemap</h5>
                        <a href="<?php echo home_url(); ?>">Home</a>
                        <a href="<?php echo home_url('/work'); ?>">Work</a>
                        <a href="<?php echo home_url('/about'); ?>">About</a>
                        <a href="<?php echo home_url('/blog'); ?>">Writing</a>
                        <a href="<?php echo home_url('/contact'); ?>">Contact</a>
                    </div>
                    <div class="footer-col">
                        <h5>Socials</h5>
                        <?php if(get_theme_mod('social_linkedin')): ?>
                            <a href="<?php echo get_theme_mod('social_linkedin'); ?>" target="_blank">LinkedIn</a>
                        <?php endif; ?>
                        <?php if(get_theme_mod('social_behance')): ?>
                            <a href="<?php echo get_theme_mod('social_behance'); ?>" target="_blank">Behance</a>
                        <?php endif; ?>
                        <a href="mailto:<?php echo get_theme_mod('footer_email', 'hinischalsubba@gmail.com'); ?>">Email</a>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom-bar">
                <span>© <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.</span>
            </div>
        </div>
    </footer>
    <?php wp_footer(); ?>
</body>
</html>