import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// logic: configuring vite for my frontend layer. 
// the idea is that my react app runs on port 5173 but my backend is on port 3000. i want seamless connection between the two without any weird errors later.
// so i am setting up a proxy here to catch any request starting with '/api' and forward it to my server. this will avoid erros (especially cors) later.
// https://stackoverflow.com/questions/64677212/how-to-configure-proxy-in-vite
// https://github.com/bradtraversy/proshop-v2/tree/main/frontend

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})



/// notes for future
// i was able to test it by running the backend at port 3000 and fetching products json using port 5173 (http://localhost:5173/api/products)