// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

 
export default defineConfig({
  plugins: [react()],
  base: '/TUTOR_ANATOMIA/',  
  server: {
    host: true,  
    hmr: {
      clientPort: 443,
    },
 
    allowedHosts: ['.ngrok-free.app'] 
  }
})