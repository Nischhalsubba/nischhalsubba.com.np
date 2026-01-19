
= Nischhal Portfolio Theme =

== CRITICAL: FIXING "403 FORBIDDEN" ERROR ==

If you see "403 Forbidden" when opening your local site:
1. You likely deleted the WordPress Core files (wp-admin, wp-includes, etc.) or pasted the theme files in the wrong place.
2. DELETE the site in LocalWP and create a brand new one.
3. Once the new site is running (and the default WordPress theme works), follow the steps below exactly.

== Installation Instructions ==

1. Locate your LocalWP site folder:
   - Right-click the site in LocalWP sidebar -> "Go to Site Folder".
   - Open the folder: `app` -> `public` -> `wp-content` -> `themes`.

2. Install the Theme:
   - Copy the folder named `wordpress` from this project.
   - Paste it into the `themes` folder you opened in Step 1.
   - Rename the pasted folder from `wordpress` to `nischhal-portfolio`.
   - The final path should look like: `.../app/public/wp-content/themes/nischhal-portfolio/`

3. Install Assets (IMAGES):
   - Go to your project root and find the `assets` folder.
   - Copy the `assets` folder.
   - Paste it INSIDE the theme folder you just created.
   - Path: `.../wp-content/themes/nischhal-portfolio/assets/`
   - Ensure `assets/images/portrait.png` etc. exist.

4. Activate:
   - Log in to WordPress Admin (`/wp-admin`).
   - Go to Appearance > Themes.
   - Activate "Nischhal Portfolio".

== Setup Steps ==

1. Create Pages:
   - Create pages with these exact titles: "Home", "Work", "About", "Writing", "Contact".

2. Set Homepage:
   - Go to Settings > Reading.
   - Select "A static page".
   - Homepage: "Home".
   - Posts page: "Writing".

3. Apply Templates:
   - Go to Pages -> Edit "Work" -> Page Attributes -> Template: "Work Page".
   - Go to Pages -> Edit "About" -> Page Attributes -> Template: "About Page".
   - Go to Pages -> Edit "Contact" -> Page Attributes -> Template: "Contact Page".
   - Go to Pages -> Edit "Products" -> Page Attributes -> Template: "Products Page".

4. Add Projects:
   - Use the "Projects" menu on the left to add your portfolio items.
   - Use Custom Fields for details:
     - Name: `project_year` | Value: `2025`
     - Name: `project_industry` | Value: `Fintech`
     - Name: `project_role` | Value: `Lead Designer`
     - Name: `project_live_url` | Value: `https://...`
