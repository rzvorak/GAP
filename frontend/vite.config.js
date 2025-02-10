import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // allows for shortened url in api calls
  server:{
    proxy:{
      "/api":{
        target:"http://localhost:5000"
      }
    }
  }
})
