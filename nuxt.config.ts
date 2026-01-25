export default defineNuxtConfig({
  compatibilityDate: '2026-01-25',

  app: { head: { title: "Takopi" } },

  runtimeConfig: {
    public: {
      firebaseConfig: process.env.NUXT_PUBLIC_FIREBASE_CONFIG
    }
  },

  components: [
    { path: "~/components", extensions: ["vue"] },
    { path: "~/components/icons", extensions: ["vue"] }
  ],

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss'
  ]
});