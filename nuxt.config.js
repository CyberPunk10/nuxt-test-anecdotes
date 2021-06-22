export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'nuxt-test-jokes',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/icon?family=Material+Icons" }
    ]
  },
  loading: {
    color: 'blue',
    height: '5px'
  },
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~assets/sass/main.sass'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/style-resources', // https://github.com/nuxt-community/style-resources-module/
    '@nuxtjs/axios', // https://go.nuxtjs.dev/axios
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.BASE_URL || 'https://v2.jokeapi.dev/'
  },

  styleResources: {
    sass: [
      '~assets/sass/vars/_index.sass',
    ],
    // scss: [],
    // less: [],
    // stylus: [],
    hoistUseStatements: true  // Hoists the "@use" imports. Applies only to "sass", "scss" and "less". Default: false.
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
