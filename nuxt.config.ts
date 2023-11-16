// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-vuefire', "@nuxt/image", '@nuxt/ui', '@formkit/auto-animate/nuxt'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vuefire: {
    config: {
      apiKey: process.env.APIKEY,
      authDomain: process.env.AUTHDOMAIN,
      projectId: process.env.PROJECTID,
      appId: process.env.APPID,
      // there could be other properties depending on the project
    },
    appCheck: {
      // Allows you to use a debug token in development
      debug: process.env.NODE_ENV !== 'production',
      isTokenAutoRefreshEnabled: false,
      provider: 'ReCaptchaV3',
      // Find the instructions in the Firebase documentation, link above
      key: process.env.RECAPTCHAKEY,
    },
    auth: {
      enabled: true,
      sessionCookie: true
    },
  },
  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  }
})
