#!/usr/bin/env node
/**
 * Copia skills do node_modules/@its-thepoe para .agent-skills/
 * Uso: npm run skills:copy-to-agent
 */

import fs from 'fs';
import path from 'path';

const SKILLS_TO_COPY = [
  'frontend-design',
  'better-typography',
  'better-colors',
  'design-taste-frontend',
  'design-engineering',
  'high-end-visual-design',
  'stitch-design-taste',
  'better-ui',
  'design-motion-principles',
  'animation-systems',
  'gsap',
  'playwright',
  'optimize-web-animations',
  'alt-text',
  'copywriting',
  'image-to-code',
  'unsplash-asset-images',
  'aura-asset-images',
  'prototype',
  'container-lines',
  'framed-grid-layout',
  'css-border-gradient',
  'progressive-blur',
  'beautiful-shadows',
  'corner-diagonals',
  'company-logos',
  'netlify-deploy',
  'seo-audit',
  'write-a-skill',
  'full-output-enforcement',
  'agentic-design-engineering',
  'gpt-taste',
  'family-taste',
  'landing-page',
  'design-and-refine',
  'redesign-existing-projects',
  'stitched-full-page-capture',
];

const SOURCE_BASE = path.resolve('skills/node_modules/@its-thepoe');
const DEST_BASE = path.resolve('.agent-skills');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Origem não encontrada: ${src}`);
    return false;
  }
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  
  return true;
}

console.log('📦 Copiando skills para .agent-skills/\n');

let success = 0;
let failed = 0;

for (const skill of SKILLS_TO_COPY) {
  const src = path.join(SOURCE_BASE, skill);
  const dest = path.join(DEST_BASE, skill);
  
  if (copyDir(src, dest)) {
    console.log(`✅ ${skill}`);
    success++;
  } else {
    console.log(`❌ ${skill} (não encontrado em node_modules)`);
    failed++;
  }
}

console.log(`\n📊 Resultado: ${success} copiadas, ${failed} não encontradas`);

if (failed > 0) {
  console.log('\n💡 Rode `npm run skills:install` primeiro para baixar as skills no node_modules');
  process.exit(1);
}