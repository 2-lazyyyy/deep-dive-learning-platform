const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const replacements = [
        { regex: /bg-white(?!\s+dark:)/g, replacement: 'bg-white dark:bg-[#000313]' },
        { regex: /bg-\[#F8F8F8\](?!\s+dark:)/g, replacement: 'bg-[#F8F8F8] dark:bg-[#060a1d]' },
        { regex: /bg-\[#F0F8FF\](?!\s+dark:)/g, replacement: 'bg-[#F0F8FF] dark:bg-[#0a1128]' },
        { regex: /text-\[#000313\](?!\s+dark:)/g, replacement: 'text-[#000313] dark:text-white' },
        { regex: /text-\[#6B7280\](?!\s+dark:)/g, replacement: 'text-[#6B7280] dark:text-gray-400' },
        { regex: /border-\[#00031333\](?!\s+dark:)/g, replacement: 'border-[#00031333] dark:border-white/20' },
        { regex: /border-\[#00031311\](?!\s+dark:)/g, replacement: 'border-[#00031311] dark:border-white/10' },
        { regex: /bg-\[#00031333\](?!\s+dark:)/g, replacement: 'bg-[#00031333] dark:bg-white/20' },
        { regex: /bg-\[#00031311\](?!\s+dark:)/g, replacement: 'bg-[#00031311] dark:bg-white/10' },
      ];

      let newContent = content;
      for (const { regex, replacement } of replacements) {
        newContent = newContent.replace(regex, replacement);
      }
        
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir('c:\\DeepDive\\deep-dive-learning-platform\\src');
console.log('Dark mode classes injected successfully!');
