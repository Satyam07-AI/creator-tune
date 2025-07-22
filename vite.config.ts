import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all environment variables from .env files based on the current mode.
  const env = loadEnv(mode, '', '');

  return {
    plugins: [react()],
    // The 'define' option statically replaces properties.
    // This makes environment variables available on `process.env` in client code,
    // which is a robust way to handle secrets and configuration.
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
      'process.env.RAZORPAY_KEY_ID': JSON.stringify(env.VITE_RAZORPAY_KEY_ID),
      'process.env.CONTACT_WEBHOOK_URL': JSON.stringify(env.VITE_CONTACT_WEBHOOK_URL)
    }
  }
})