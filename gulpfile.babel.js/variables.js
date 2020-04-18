var paths = {
    pageLayouts: {
        input: 'src/layouts/**/{*.html,*shtml}',
        testing: 'test/_layouts/',
        watch: 'src/layouts/**/{*.html,*shtml}',
        dist: 'dist/',
        links: 'src/layouts/partials/js_links.html',
    },
    pages: {
        input: 'src/pages/**/*',
        exclude: 'src/pages/{_partials,_partials/**}',
        testing: 'test/',
        watch: 'src/pages/**/*.html',
        site: 'test/_site/**/*html',
        deploy: 'dist/'
    },
    includes: {
        input: 'src/includes/*.html',
        testing: 'test/_includes/'
        //  dist: 'dist/templates'
    },
    scripts: {
        input: 'src/scripts/**/*.js',
        exclude: 'src/scripts/exclude/*{.js,.json}',
        bower: 'src/scripts/bower_components/**/*.js',
        vendor: 'src/scripts/vendor/*.js',
        testing: 'test/scripts/',
        dist: 'dist/scripts/'
    },
    bower: {
        components: 'bower_components',
        json: 'bower.json',
        vendor: 'src/scripts/vendor/'
    },
    styles: {
        input: 'src/sass/main_styles.scss',
        inputInline: 'src/sass/inline_styles/{blog_embedded_styles.scss,index_embeded_styles.scss,main_embedded_styles.scss}',
        outputInline: 'test/_includes',
        exclude: '!src/sass/partials/*.scss',
        testing: 'test/css/',
        dist: 'dist/css/',
        watch: 'src/sass/**/*.scss'
    },
    stylesEmbed: {
        input: 'src/styles_embed/irotm_embed_styles.scss',
        testing: 'test/embed-css/',
        dist: 'dist/embed-css/'
    },
    remove: {
        input: 'test/css/*.css',
        exclude: '!test/css/styles.css',
        jsRemove: "test/scripts/*.js",
        distStyles: 'dist/css/*.css',
        distJS: 'dist/scripts/*.js'
    },
    images: {
        input: 'src/photos_in/{*.jpg,*.tiff,*.png}',
        output: 'src/photos_out/',
        testing: 'test/siteart/',
        dist: 'dist/siteart/'
    },
    svg: {
        input: 'src/svg/svg_in/*.svg',
        output: 'src/svg/'
        // dist: 'dist/svg/'
    },
    fonts: {
        input: 'src/fonts/*.css',
        testing: 'test/fonts/',
        dist: 'dist/fonts/'
    },
    posts: {
        input: 'src/posts/**/*.markdown',
        output: 'test/_posts/'
    },
    collections: {
        input: 'src/collections/**/*.markdown',
        output: 'test/'
    },
    sitemap: {
        input: 'test/_site/sitemap.xml',
        output: 'dist/'
    },
    drafts: {
        input: 'src/drafts/*.markdown',
        output: 'test/_drafts/'
    },
    json: {
        input: 'test/_site/site-feed.json',
        output: 'dist/'
    }
};

// creates file names based on date
const date = new Date();
const dateString = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`
const cacheBustNames = {
    filename: `styles-${dateString}.css`,
    scriptname: `script-${dateString}.js`,
    searchname: `search-${dateString}.js`,
    adminname: `admin-${dateString}.js`
}

const googleAnalytics = 'UA-56763803-1';

export { paths, googleAnalytics, cacheBustNames }