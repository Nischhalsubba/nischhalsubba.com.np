
<?php
/* Template Name: About Page */
get_header(); ?>

    <main class="container">
      <section class="hero-section">
        <h1 class="hero-title reveal-on-scroll">
            <span class="text-reveal-wrap">
                <span class="text-outline">About Me</span>
                <span class="text-fill">About Me</span>
            </span>
        </h1>
        <p class="body-large reveal-on-scroll">
            I am Nischhal Raj Subba, a Product Designer with 6+ years of experience crafting digital ecosystems. Ranked #1 globally by Uxcel, I specialize in bridging the gap between complex requirements and elegant, scalable user interfaces.
        </p>
      </section>

      <section class="section-container" style="padding-top: 0;">
          <div class="about-grid reveal-on-scroll">
              <!-- Content Column -->
              <div class="about-bio">
                  
                  <div style="margin-bottom: 60px;">
                      <h3 class="section-title" style="font-size: 2rem; margin-bottom: 30px;">The Person Behind the Pixels</h3>
                      <p class="body-large">
                          Design, for me, is the intersection of logic and empathy. My journey has taken me from crafting intuitive mobile apps to architecting massive enterprise platforms and decentralized applications (Web3). I believe that a robust <strong>Design System</strong> is the foundation of creativity, not a constraint.
                      </p>
                      <p class="body-large">
                          My philosophy is rooted in <strong>Atomic Design</strong> and <strong>System Thinking</strong>. I don't just design screens; I build living systems that empower engineering teams to move faster and ensure products scale gracefully. I thrive in environments where data density is high, and the problem space is ambiguous.
                      </p>
                      <p class="body-large">
                          Whether it's simplifying a complex fintech dashboard or designing a trustless interaction for a blockchain wallet, my goal remains the same: <strong>Make it intuitive, make it beautiful, make it work.</strong>
                      </p>
                  </div>

                  <h3 class="section-title" style="font-size: 1.8rem; margin-bottom: 40px; margin-top: 80px;">Experience</h3>
                  <div class="timeline-list">
                      <div class="timeline-item">
                          <span class="timeline-date">Aug 2025 – Dec 2025</span>
                          <h4 class="timeline-role">Product Designer</h4>
                          <div class="timeline-company">Idealaya • Remote</div>
                          <p class="body-large" style="font-size: 1rem; margin-top: 12px; margin-bottom: 0;">Led UI/UX for enterprise web software, built scalable design systems, and delivered implementation-ready UI specs.</p>
                      </div>
                      <div class="timeline-item">
                          <span class="timeline-date">Mar 2024 – Jul 2025</span>
                          <h4 class="timeline-role">Product Designer</h4>
                          <div class="timeline-company">Mokshya Protocol • Remote</div>
                          <p class="body-large" style="font-size: 1rem; margin-top: 12px; margin-bottom: 0;">Designed Web3 UI for decentralized products, built interactive prototypes for key workflows, and iterated based on user feedback.</p>
                      </div>
                      <div class="timeline-item">
                          <span class="timeline-date">Feb 2023 – Nov 2023</span>
                          <h4 class="timeline-role">Lead User Experience Designer</h4>
                          <div class="timeline-company">Tegzy • Remote (Australia)</div>
                          <p class="body-large" style="font-size: 1rem; margin-top: 12px; margin-bottom: 0;">Built and scaled a design system to improve dev/design handoff quality and standardize reusable components.</p>
                      </div>
                      <div class="timeline-item">
                          <span class="timeline-date">Oct 2021 – Feb 2023</span>
                          <h4 class="timeline-role">Senior UI/UX Designer</h4>
                          <div class="timeline-company">ESR Tech • Remote</div>
                          <p class="body-large" style="font-size: 1rem; margin-top: 12px; margin-bottom: 0;">Designed dashboard UX for internal tools and contributed to products like Jeweltrek.</p>
                      </div>
                      <div class="timeline-item">
                          <span class="timeline-date">Apr 2021 – Sep 2021</span>
                          <h4 class="timeline-role">Senior UI/UX Designer</h4>
                          <div class="timeline-company">ThemeGrill • Remote</div>
                      </div>
                      <div class="timeline-item">
                          <span class="timeline-date">Jul 2019 – Jan 2021</span>
                          <h4 class="timeline-role">UI/UX Designer</h4>
                          <div class="timeline-company">Gurzu • Onsite</div>
                      </div>
                  </div>

                  <h3 class="section-title" style="font-size: 1.8rem; margin: 80px 0 40px;">Education</h3>
                  <div class="timeline-list">
                      <div class="timeline-item">
                          <span class="timeline-date">2014 – 2018</span>
                          <h4 class="timeline-role">BA (Hons) Business Management</h4>
                          <div class="timeline-company">University of Wolverhampton</div>
                      </div>
                  </div>

                  <h3 class="section-title" style="font-size: 1.8rem; margin: 80px 0 40px;">Awards</h3>
                  <div class="timeline-list">
                      <div class="timeline-item">
                          <span class="timeline-date">Dec 2024</span>
                          <h4 class="timeline-role">Ranked #1 Designer</h4>
                          <div class="timeline-company">Uxcel Global Rankings 2024</div>
                      </div>
                      <div class="timeline-item">
                          <span class="timeline-date">Dec 2024</span>
                          <h4 class="timeline-role">#1 Product Designer</h4>
                          <div class="timeline-company">Uxcel Global Rankings 2024</div>
                      </div>
                      <div class="timeline-item">
                          <span class="timeline-date">Dec 2023</span>
                          <h4 class="timeline-role">Top 10 Product Designer</h4>
                          <div class="timeline-company">Uxcel Global Rankings 2023</div>
                      </div>
                  </div>

              </div>
              
              <!-- Sidebar Column -->
              <div class="about-sidebar">
                  <div style="position: sticky; top: 120px;">
                    <!-- Dynamic Image -->
                    <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/portrait.svg' ); ?>" class="profile-img" style="width: 100%; border-radius: 20px; margin-bottom: 24px; opacity: 0.9;" alt="Nischhal Portrait">
                    
                    <h5 style="margin-bottom: 16px; font-size: 0.9rem; text-transform: uppercase; color: var(--text-tertiary); letter-spacing: 0.1em;">Skills</h5>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        <span class="badge-pill">Product Design</span>
                        <span class="badge-pill">Design Systems</span>
                        <span class="badge-pill">Enterprise UX</span>
                        <span class="badge-pill">Prototyping</span>
                        <span class="badge-pill">Web3</span>
                        <span class="badge-pill">Figma</span>
                    </div>
                  </div>
              </div>
          </div>
      </section>
    </main>

<?php get_footer(); ?>
