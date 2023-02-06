// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  postcss: { plugins: { tailwindcss: "./tailwind.config.js" } },
  css: [
    "@/assets/css/main.css",
  ],

  plugins: ["~/plugins/websocket.client.ts"],

  components: [
    { path: "~/components", extensions: ["vue"] },
    { path: "~/components/icons", extensions: ["vue"] }
  ],

});
