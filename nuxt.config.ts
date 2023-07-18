import Game from "./game/index";

export default defineNuxtConfig({
  app: { head: { title: "Takopi" } },

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

  modules: ["nuxt-internal-socket"],

  components: [
    { path: "~/components", extensions: ["vue"] },
    { path: "~/components/icons", extensions: ["vue"] }
  ],

  imports: {
    dirs: [
      // Scan top-level modules
      "composables",
      // ... or scan modules nested one level deep with a specific name and file extension
      "composables/*/index.{ts,js,mjs,mts}",
      // ... or scan all modules within given directory
      "composables/**"
    ]
  },

  socketIO: {
    /** Required */
    socketFunctions: Game,
    /** Optional - these are the defaults
     * managerOptions is of type ManagerOptions from the socket.io-client library
     */
    clientOptions: {
      uri: "/", // If you want to connect to a different server than the one created by this plugin
      managerOptions: {},
    },
  },

});
