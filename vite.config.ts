
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 确保在生产环境下，如果 process.env.API_KEY 不存在，也不会导致代码执行报错
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});
