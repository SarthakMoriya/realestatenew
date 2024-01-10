import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
// replace/api with http://localhost:5000
export default defineConfig({
  server:{
    proxy:{
      '/api':{
        target:'https://realestatenew.onrender.com',
        secure:false
      }
    }
  },
  plugins: [react()],
})
