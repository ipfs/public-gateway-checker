import { generateSW } from 'workbox-build'

generateSW({
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{css,woff2,png,svg,jpg,js}'
  ],
  globIgnores: [
    'src/**/*'
  ],
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
      handler: 'NetworkFirst'
    }
  ],
  swDest: 'dist/sw.js'
})
