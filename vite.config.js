/**
    Files located in the public directory will be included in the build output without any modification. Additionally,
    we will preserve the file names of content.js and popup.js and ensure that no content hash is added to them.
    These files will be set as entry files for the build process.
 */

// vite.config.js

import { defineConfig } from 'vite';

export default defineConfig({
  // Specify the root directory of your project
  root: './src',

  // Specify the public directory where your built files will be served from
  publicDir: './public',

  // Configure the development server
  server: {
    port: 3000, // Specify the port number to use
    open: true, // Automatically open the browser when the server starts
  },
  // Configure the build options
  build: {
    outDir: '../dist', // Specify the output directory for the built files
    rollupOptions: {
        input: {
            content: 'src/content.js',
            popup: 'src/popup.js',
        },
         output: {
            entryFileNames: '[name].js',
            chunkFileNames: '[name].js',
            assetFileNames: '[name].[ext]',
        },
    }
  },
});