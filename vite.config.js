import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      // two entry pages, one app: /ro/ ships its own <head> (lang="ro",
      // Romanian SEO) and copy.js picks the locale from <html lang>
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        ro: fileURLToPath(new URL('./ro/index.html', import.meta.url)),
      },
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap', 'lenis'],
        },
      },
    },
  },
})
