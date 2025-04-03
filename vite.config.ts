import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom', // Simular el navegador
    globals: true, // Permitir uso global de funciones de test
    setupFiles: ['./src/setuptest.ts'], // Configuración global previa a cada test
  },
  plugins: [react()],
})
