import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - lessons-front-admin',
    title: 'Kidup админ',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/jpg', href: '/kidup-logo.jpg' }
    ]
  },

  server: {
    port: 3001
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "~/assets/styles/global.scss",
    "vue-modal-service/dist/modal-service.css",
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/external",
    "~/plugins/apiLayer",
    "~/plugins/filters",
    "~/plugins/yandex",
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  styleResources: {
    scss: ["~/assets/styles/variables.scss"]
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    "@nuxtjs/style-resources",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "vue-toastification/nuxt",
    "cookie-universal-nuxt",
    "@nuxtjs/device",
    "@nuxtjs/axios",
    "vue2-editor/nuxt",
    "@nuxtjs/dotenv",
    "@nuxtjs/pwa"
  ],

  pwa: {
    icon: {
      fileName: 'kidup-logo.jpg',
    },
    manifest: {
      name: 'Kidup админ',
      short_name: 'Kidup админ',
      lang: 'ru',
      theme_color: '#1976d2',
      background_color: '#1976d2',
      start_url: '/adminpanel',
      icons: [
        {
          src: '/kidup-logo.jpg',
          sizes: '512x512',
          type: 'image/jpg',
        },
      ],
    },
    workbox: {
      offline: false,
    },
  },

  // Axios
  axios: {
    baseURL: process.env.BACKEND_URL,
    credentials: true,
  },

  router: {
    base: process.env.BASE_URL
  },

  // Toastification
  toast: {
    timeout: 2000,
    closeOnClick: true,
    hideProgressBar: true,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/styles/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
