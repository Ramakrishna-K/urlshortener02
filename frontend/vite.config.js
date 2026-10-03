// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss()
//   ],
//   server: {
//     open: true
//   }
// })


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],

    server: {
       port: 5173,
        open: true,

        proxy: {
            "/api": {
                target: "http://localhost:80",
                changeOrigin: true
            }
        }
    }
});