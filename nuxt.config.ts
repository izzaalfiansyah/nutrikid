import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/app.css"],
  modules: ["@nuxt/image", "shadcn-nuxt", "nuxt-lucide-icons", "@pinia/nuxt"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  runtimeConfig: {
    public: {
      APP_NAME: process.env.APP_NAME,
      APP_DESCRIPTION: process.env.APP_DESCRIPTION,
      APP_KEY: process.env.APP_KEY,
      APP_API_URL: process.env.APP_API_URL,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
      ANDROID_DOWNLOAD_URL: process.env.ANDROID_DOWNLOAD_URL,
      IOS_DOWNLOAD_URL: process.env.IOS_DOWNLOAD_URL,
    },
  },
  devServer: {
    cors: {
      origin: "*",
      methods: "*",
    },
  },
});
