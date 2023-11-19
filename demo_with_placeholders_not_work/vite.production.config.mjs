import { defineConfig } from 'vite';
import { createStyleImportPlugin } from 'vite-plugin-style-import';
import path from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@demo': path.resolve(__dirname, './src'),
      react: path.resolve('./node_modules/react'),
      'react-final-form': path.resolve(__dirname, './node_modules/react-final-form'),
      'easy-email-localization': path.resolve('../packages/easy-email-localization'),
      'easy-email-core': path.resolve('../packages/easy-email-core'),
      'easy-email-editor': path.resolve('../packages/easy-email-editor'),
      'easy-email-extensions': path.resolve('../packages/easy-email-extensions'),
    },
  },
  optimizeDeps: {},
  define: {},
  build: {
    minify: true,
    cssMinify: false,
    manifest: false,
    sourcemap: false,
    target: 'es2015',
    chunkSizeWarningLimit: 20000,
    rollupOptions: {
      output: {
        entryFileNames: "easy-email.js",
        //assetFileNames: 'easy-email.css',
        manualChunks(id) {
          return 'easy-email'
        },
        exports : "none",
        assetFileNames: ({name}) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')){
            return './images/[name][extname]';
          }

          if (/\.css$/.test(name ?? '')) {
            return 'easy-email.css';//'[name][extname]';
          }

          // default value
          // ref: https://rollupjs.org/guide/en/#outputassetfilenames
          return '[name][extname]';
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'dashes',
    },
    preprocessorOptions: {
      scss: {},
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    //react(),
    createStyleImportPlugin({
      libs: [
        // Dynamic import @arco-design styles
        {
          libraryName: '@arco-design/web-react',
          libraryNameChangeCase: 'pascalCase',
          esModule: true,
          resolveStyle: name => `@arco-design/web-react/es/${name}/style/index`,
        },
        {
          libraryName: '@arco-design/web-react/icon',
          libraryNameChangeCase: 'pascalCase',
          resolveStyle: name => `@arco-design/web-react/icon/react-icon/${name}`,
          //resolveComponent: name => `@arco-design/web-react/icon/react-icon/${name}`,
        },
      ],
    }),
    createHtmlPlugin({
      minify: false,
      inject: {
        data: {
          buildTime: `<meta name="updated-time" content="${new Date().toUTCString()}" />`,
        },
      }
    }),
  ].filter(Boolean),
});
