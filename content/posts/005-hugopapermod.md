---
title: 'Hugo & PaperMod Theme'
date: 2025-05-08
slug: hugo-papermod-theme
draft: false
tags: ["papermod", "hugo", "web development"]
categories: ["Web Development"]
---

# Hugo + PaperMod Theme: A Complete Crash Course

## Introduction

[Hugo](https://gohugo.io/) is a blazing fast static site generator written in Go. Combined with the elegant [PaperMod theme](https://github.com/adityatelange/hugo-PaperMod), it's a powerful solution for creating modern websites, blogs, and documentation. This crash course will guide you through setting up, configuring, and customizing your Hugo site with PaperMod.

## Installation

### Install Hugo

First, you need to install Hugo on your system:

#### On macOS (using Homebrew):
```bash
brew install hugo
```

#### On Windows (using Chocolatey):
```bash
choco install hugo -confirm
```

#### On Linux (Debian/Ubuntu):
```bash
sudo apt-get install hugo
```

Verify your installation:
```bash
hugo version
```

## Creating a New Site

Create a new Hugo site:

```bash
hugo new site mysitename
cd mysitename
```

This creates a new Hugo site in a folder named `mysitename`.

## Installing the PaperMod Theme

You can install the PaperMod theme in two ways:

### Method 1: Using Git Submodules (Recommended)

```bash
git init
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

### Method 2: Manual Download

1. Download the theme from [GitHub](https://github.com/adityatelange/hugo-PaperMod)
2. Extract it to the `themes/PaperMod` directory

## Basic Configuration

Create or modify the `config.yml` file in your site's root directory:

```yaml
baseURL: "https://yourwebsite.com/"
title: "Your Site Title"
paginate: 5
theme: PaperMod

enableRobotsTXT: true
buildDrafts: false
buildFuture: false
buildExpired: false

minifyOutput: true

params:
  env: production
  title: Your Site Title
  description: "Your site description"
  keywords: [Blog, Portfolio, PaperMod]
  author: Your Name
  DateFormat: "January 2, 2006"
  defaultTheme: auto # dark, light, auto
  disableThemeToggle: false

  ShowReadingTime: true
  ShowShareButtons: true
  ShowPostNavLinks: true
  ShowBreadCrumbs: true
  ShowCodeCopyButtons: true
  ShowWordCount: true
  ShowRssButtonInSectionTermList: true
  UseHugoToc: true
  disableSpecial1stPost: false
  disableScrollToTop: false
  comments: false
  hidemeta: false
  hideSummary: false
  showtoc: true
  tocopen: false

  assets:
    # disableFingerprinting: true
    favicon: "/favicon.ico"
    favicon16x16: "/favicon-16x16.png"
    favicon32x32: "/favicon-32x32.png"
    apple_touch_icon: "/apple-touch-icon.png"

  profileMode:
    enabled: false
    title: Your Name
    subtitle: "Your short bio here"
    imageUrl: "/images/profile.jpg"
    imageWidth: 120
    imageHeight: 120
    buttons:
      - name: Archives
        url: archives
      - name: Tags
        url: tags

  socialIcons:
    - name: twitter
      url: "https://twitter.com/"
    - name: github
      url: "https://github.com/"
    - name: linkedin
      url: "https://linkedin.com/in/"

  cover:
    hidden: false
    hiddenInList: false
    hiddenInSingle: false

menu:
  main:
    - identifier: categories
      name: Categories
      url: /categories/
      weight: 10
    - identifier: tags
      name: Tags
      url: /tags/
      weight: 20
    - identifier: archives
      name: Archives
      url: /archives/
      weight: 30
    - identifier: search
      name: Search
      url: /search/
      weight: 40
```

## Content Management

### Creating Posts

Create a new post:

```bash
hugo new posts/my-first-post.md
```

This creates a new file at `content/posts/my-first-post.md` with default front matter:

```markdown
---
title: "My First Post"
date: 2023-04-29T10:30:00+00:00
draft: true
tags: ["first"]
categories: ["example"]
---

Your content here...
```

Remember to set `draft: false` when you're ready to publish.

### Front Matter Options

PaperMod supports many front matter options:

```yaml
---
title: "My Post Title"
date: 2023-04-29
draft: false
description: "Description of the post"
tags: ["hugo", "papermod", "tutorial"]
categories: ["web development"]
weight: 1
cover:
    image: "/path/to/image.jpg"
    alt: "Alternative text"
    caption: "Image caption"
    relative: false
showToc: true
TocOpen: false
hidemeta: false
comments: false
---
```

### Content Structure

```
content/
├── posts/
│   ├── post-1.md
│   └── post-2.md
├── about.md
└── projects/
    ├── project-1.md
    └── project-2.md
```

## Customizing PaperMod

### Creating Homepage Layouts

PaperMod offers three homepage layouts:

1. **Default (List)**: Shows a list of posts
2. **Profile Mode**: Focused on personal info
3. **Cover Mode**: Shows a full-page cover image

To enable Profile Mode, update your `config.yml`:

```yaml
params:
  profileMode:
    enabled: true
    title: "Your Name"
    subtitle: "Your bio or tagline"
    imageUrl: "/images/profile.jpg"
    buttons:
      - name: Blog
        url: posts
      - name: Projects
        url: projects
```

### Adding Search Functionality

1. Create a search page:

```bash
hugo new search.md
```

2. Add this content to `search.md`:

```markdown
---
title: "Search"
layout: "search"
summary: "search"
placeholder: "Search posts..."
---
```

3. Add search to your menu in `config.yml`:

```yaml
menu:
  main:
    - identifier: search
      name: Search
      url: /search/
      weight: 10
```

### Custom CSS

Create a file at `assets/css/extended/custom.css` for your custom styles:

```css
/* Your custom styles here */
body {
  /* Custom body styles */
}

.post-title {
  /* Custom post title styles */
}
```

### Custom Shortcodes

Create custom shortcodes in `layouts/shortcodes/`:

For example, create `layouts/shortcodes/notice.html`:

```html
<div class="notice {{ .Get 0 }}">
  {{ .Inner | markdownify }}
</div>
```

Use it in your content:

```markdown
{< notice info >}
This is an info notice.
{< /notice >}
```

## Deployment

### Local Preview

Run a local server:

```bash
hugo server -D
```

This starts a server at `http://localhost:1313/`. The `-D` flag includes draft posts.

### Building for Production

Build your site:

```bash
hugo --minify
```

This generates your site in the `public/` directory, ready for deployment.

### Deployment Options

#### GitHub Pages

1. Create a `.github/workflows/hugo.yml` file:

```yaml
name: Deploy Hugo site

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          fetch-depth: 0

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'

      - name: Build
        run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

2. Set your repository settings to deploy from the `gh-pages` branch.

#### Netlify

1. Push your Hugo site to a GitHub repository
2. Sign up for [Netlify](https://www.netlify.com/)
3. Import your repository
4. Set build command to `hugo --minify` and publish directory to `public`

## Hugo Command Line Flags & Environment Variables

Hugo offers numerous command line flags and environment variables that can significantly impact your development workflow and site performance.

### Important Command Line Flags

When using `hugo server` for local development:

```bash
# Basic development server
hugo server

# Include draft content
hugo server -D

# Fast render mode (disable for accurate rendering)
hugo server --disableFastRender

# Force rebuilds on file changes
hugo server --disableLiveReload

# Bind to all network interfaces (access from other devices)
hugo server --bind="0.0.0.0"

# Specify port
hugo server --port=8080

# Watch for changes in theme folder too
hugo server --ignoreCache --themesDir=../..

# Full rebuild on changes (slower but more accurate)
hugo server --disableFastRender --renderToDisk
```

When building your site for production:

```bash
# Standard build
hugo

# Minify output
hugo --minify

# Include expired content
hugo --buildExpired

# Include future-dated content
hugo --buildFuture

# Include draft content (generally not for production)
hugo --buildDrafts

# Specify base URL
hugo --baseURL="https://example.com/"

# Verbose output for debugging
hugo -v
```

### Environment Variables

```bash
# Set environment
HUGO_ENV=production hugo

# Change number of parallel workers
HUGO_NUMWORKERMULTIPLIER=2 hugo

# Cache settings
HUGO_CACHEDIR=/path/to/cache hugo

# Resource cache
HUGO_RESOURCEDIR=/path/to/resources hugo

# Disable symlinks in file detection
HUGO_DISABLEPATHTOFILEBYDISABLEDSYMPATHY=true hugo

# Disable .git directory ignore
HUGO_IGNOREGIT=true hugo
```

### Performance Optimization Flags

```bash
# Enable HTTP/2 server push
hugo server --http2

# Disable lazy loading of images
hugo --disableLazyLoading

# Control image processing concurrency
HUGO_IMAGES_PROCESSOR_COUNT=4 hugo
```

### Configuration-Based Settings

You can also set many of these options in your `config.yml`:

```yaml
# Build options
buildDrafts: false
buildFuture: false
buildExpired: false
disableFastRender: false
enableGitInfo: true

# Performance settings
minify: true
disableHugoGeneratorInject: true
```

## Troubleshooting

### Common Issues and Solutions

1. **Theme Not Showing**: Check if the theme is properly installed and referenced in your `config.yml`

   ```bash
   # Check theme directory
   ls -la themes/
   ```

2. **Taxonomy Pages Missing**: Ensure you've defined taxonomies in your config

   ```yaml
   taxonomies:
     category: categories
     tag: tags
   ```

3. **Images Not Loading**: Verify image paths and try using page bundles

   Create a directory structure:
   ```
   content/
   └── posts/
       └── my-post/
           ├── index.md
           └── images/
               └── featured.jpg
   ```

   Then reference with:
   ```markdown
   ![Alt text](images/featured.jpg)
   ```

4. **Hugo Server Error**: Clear cache and restart

   ```bash
   hugo mod clean
   hugo server
   ```

## Advanced Features

### Adding a Comment System

To add Disqus comments:

1. Update your `config.yml`:

```yaml
disqusShortname: your-disqus-shortname
```

2. Enable comments in front matter:

```yaml
---
title: "My Post with Comments"
comments: true
---
```

### Multilingual Support

Update your `config.yml`:

```yaml
languageCode: "en-us"
defaultContentLanguage: "en"

languages:
  en:
    languageName: "English"
    weight: 1
    taxonomies:
      category: categories
      tag: tags
  fr:
    languageName: "Français"
    weight: 2
    taxonomies:
      category: categories
      tag: tags
```

Create language-specific content:
```
content/
├── posts/
│   └── hello-world.md  # English
└── fr/
    └── posts/
        └── bonjour-monde.md  # French
```

### Content Organization with Page Bundles

Page bundles keep content and its resources together:

```
content/
└── posts/
    └── my-bundled-post/
        ├── index.md
        ├── image1.jpg
        └── data.json
```

Reference bundled resources in your content:

```markdown
![Featured Image](image1.jpg)
```

## Useful Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [PaperMod Wiki](https://github.com/adityatelange/hugo-PaperMod/wiki)
- [Hugo Forum](https://discourse.gohugo.io/)
- [PaperMod GitHub Repository](https://github.com/adityatelange/hugo-PaperMod)
- [Markdown Guide](https://www.markdownguide.org/)
- [Learn Hugo in Under 2 Hours](https://youtu.be/hjD9jTi_DQ4)

## Conclusion

This crash course has provided you with the essential knowledge to get started with Hugo and the PaperMod theme. As you become more comfortable, explore Hugo's documentation and the PaperMod wiki for advanced features and customization options.

Remember that Hugo's strength lies in its flexibility and speed, while PaperMod offers a clean, modern design with excellent performance. Together, they provide an excellent foundation for your website.

Happy building!