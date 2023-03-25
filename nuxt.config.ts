// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      server_websocket: process.env.SERVER_WEBSOCKET,
      websocket_port: process.env.WEBSOCKET_PORT,
    }
  },

  postcss: { plugins: { tailwindcss: "./tailwind.config.js" } },
  css: [
    "@/assets/css/main.css",
  ],

  plugins: ["~/plugins/websocket.client.ts"],

  components: [
    { path: "~/components", extensions: ["vue"] },
    { path: "~/components/icons", extensions: ["vue"] }
  ],

  // build: {
  //   extend(config, ctx) {
  //     if (ctx.isDev) {
  //       config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
  //     }
  //   }
  // }

});
