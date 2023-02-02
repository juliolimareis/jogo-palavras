// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  postcss: { plugins: { tailwindcss: "./tailwind.config.js" } },
  css: [
    "@/assets/css/main.css",
  ],

  // modules: ["./modules/socket"]

  // build: { transpile: ["@heroicons/vue", "@headlessui/vue"] },

  plugins: ["~/plugins/websocket.client.ts"],

});
