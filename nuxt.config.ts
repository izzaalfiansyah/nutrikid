import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/app.css"],
  modules: [
    "@nuxt/image",
    "shadcn-nuxt",
    "nuxt-lucide-icons",
    "@pinia/nuxt",
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  },
});