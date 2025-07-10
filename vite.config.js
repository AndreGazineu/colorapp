// vite.config.js - VERSÃO CORRIGIDA PARA SUA ESTRUTURA

import { defineConfig } from 'vite'

export default defineConfig({
  // 1. Diz ao Vite que a raiz do seu código-fonte é a pasta 'public'
  root: 'public',

  // 2. Diz ao Vite para colocar os arquivos finais na pasta 'dist' na raiz do projeto
  build: {
    outDir: '../dist'
  },

  // 3. Diz ao Vite que o site final estará em um subdiretório
  base: '/colorapp/',
})
