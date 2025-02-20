// https://nuxt.com/docs/api/configuration/nuxt-config
// import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: [
    '~/plugins/repositories',
    '~/plugins/services'
  ],
  supabase: {
    redirect: false
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_KEY || '',
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  compatibilityDate: '2025-02-17',
})

