import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Render deployment'da kullanılacak API URL'i
  const API_URL = process.env.VITE_API_URL || "http://localhost:8148";
  
  return {
    // CRITICAL FIX: Change from "/" to "./" for Tauri
    // This ensures all asset paths are relative
    base: process.env.TAURI_PLATFORM ? "./" : "/",
    
    // Clear screen for Tauri
    clearScreen: false,
    
    server: {
      host: "::",
      port: 8080,
      // Watch configuration for Tauri
      watch: {
        ignored: ['**/src-tauri/**']
      },
      // Render'da çalışırken proxy'yi backend URL'ye yönlendir
      proxy: API_URL === "http://localhost:8148" ? {
        '/auth': {
          target: 'http://localhost:8148',
          changeOrigin: true,
          secure: false,
        },
        '/files': {
          target: 'http://localhost:8148',
          changeOrigin: true,
          secure: false,
        },
        '/folders': {
          target: 'http://localhost:8148',
          changeOrigin: true,
          secure: false,
        },
        '/system': {
          target: 'http://localhost:8148',
          changeOrigin: true,
          secure: false,
        },
        '/user': {
          target: 'http://localhost:8148',
          changeOrigin: true,
          secure: false,
        },
        '/dl': {
          target: 'http://localhost:8148',
          changeOrigin: true,
          secure: false,
        },
        '/watch': {
          target: 'http://localhost:8148',
          changeOrigin: true,
          secure: false,
        },
      } : undefined,
      middlewareMode: false,
      // ⭐ BU ÇOK ÖNEMLİ: Render host'una izin ver
      allowedHosts: [
        'fileserverapp-4d5j.onrender.com',
        '.onrender.com',  // Tüm onrender.com alt alanlarına izin ver
      ],
    },
    
    preview: {
      port: 8080,
      strictPort: false,
      middlewareMode: false,
      // ⭐ PREVIEW İÇİN DE AYNI İZİNLERİ EKLE
      allowedHosts: [
        'fileserverapp-4d5j.onrender.com',
        '.onrender.com',
      ],
    },
    
    plugins: [
      react(), 
      mode === "development" && componentTagger()
    ].filter(Boolean),
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    
    // Environment variable prefix for Tauri
    envPrefix: ['VITE_', 'TAURI_'],
    
    // Build configuration for Tauri
    build: {
      // Tauri uses Chromium on Windows
      target: ['es2021', 'chrome100', 'safari13'],
      
      // Don't minify in debug builds
      minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
      
      // Generate sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_DEBUG,
      
      // Output directory
      outDir: 'dist',
      
      // Ensure assets are properly included
      assetsDir: 'assets',
      
      // Clear output directory before build
      emptyOutDir: true,
      
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  };
});
