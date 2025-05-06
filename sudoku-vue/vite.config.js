import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// No tailwindcss plugin needed here
export default defineConfig({
  plugins: [vue()]
})
