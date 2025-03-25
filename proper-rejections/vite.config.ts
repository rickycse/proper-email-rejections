import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})