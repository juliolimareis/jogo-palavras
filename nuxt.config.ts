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
    '@nuxtjs/tailwindcss',
    '@nuxt/test-utils/module',
    'shadcn-nuxt'
  ]
  ,

   shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  }
});