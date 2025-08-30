import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['server.ts'],
  format: ['cjs'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
})