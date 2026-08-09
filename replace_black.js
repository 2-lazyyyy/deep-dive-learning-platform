const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace pure black #000000 and #1c1d20 (and #1C1D20)
      const newContent = content
        .replace(/#000000/gi, '#000313')
        .replace(/#1C1D20/gi, '#000313')
        .replace(/text-black/g, 'text-[#000313]')
        .replace(/bg-black/g, 'bg-[#000313]');
        
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir('c:\\DeepDive\\deep-dive-learning-platform\\src');
console.log('Done!');
