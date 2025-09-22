import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // define: {
  //   __API_URL__: 'https://ai-prompt-backend-pwqv.onrender.com/api',
  // }
  // server: {
  //   cors: true,
  //   proxy: {
  //     '/api': {
  //       target: 'https://ai-prompt-backend-pwqv.onrender.com/api',
  //       changeOrigin: true,
  //       secure: true
  //     }
  //   }
  // }
})
