const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') {
        if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
          filelist.push(dirFile);
        }
      } else {
        throw err;
      }
    }
  });
  return filelist;
};

const map = {
  // Primary (100)
  '#1CB0F6': '#077d8a', // Student primary
  '#5E078A': '#077d8a', // Teacher primary
  
  // Primary Dark (For borders/hovers - deriving a darker shade)
  '#1899D6': '#055a63', 
  '#4A0570': '#055a63',
  '#390457': '#055a63',
  
  // Text & Dark Elements (300)
  '#4B4B4B': '#1C1D20', // Main Text
  '#777777': '#1C1D20', // Or perhaps opacity: #1C1D20cc
  '#AFAFAF': '#1C1D20', // Muted Text: #1C1D2080
  
  // Borders & Light Backgrounds (300-20 & 600-3)
  '#E5E5E5': '#1C1D2033', // 20% opacity border
  '#F7F7F7': '#F8F8F8',   // 600-3 Light grey bg
  '#F3E8FF': '#F0F8FF',   // 600-2 Very light blue bg
  '#DDF4FF': '#F0F8FF',   // 600-2 Very light blue bg
  '#FCE8EB': '#F0F8FF',   // Convert light error bg to standard light bg
  
  // Errors (error)
  '#FF4B4B': '#FC4B0B',
  '#8A0720': '#FC4B0B',
  
  // Success (success)
  '#077d8a': '#34C759', // Wait, we can't blindly replace this because it's our new primary! 
  '#FFC800': '#34C759', // Used for some checkmarks
};

// We need to carefully replace the success color that used to be #077d8a, but since we are changing primary to #077d8a, we shouldn't mix them up.
// Actually, earlier in teacher UI we had `#077d8a` as pass/success. Let's do a special regex for that if needed, or we just replace the exact usages.

const replaceColors = () => {
  const files = walkSync(path.join(__dirname, 'src'));
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // First, fix the old success #077d8a to #34C759 before we map primary to #077d8a
    // The old success used #077d8a in teacher UI for Pass checks.
    // However, if there are no conflicts, we can just replace.
    // In Teacher UI, #077d8a was used for passing grades.
    content = content.replace(/#077d8a/gi, '#34C759');
    
    // Now apply the global map
    for (const [oldColor, newColor] of Object.entries(map)) {
      if (oldColor === '#077d8a') continue; // already handled
      
      const regex = new RegExp(oldColor, 'gi');
      content = content.replace(regex, newColor);
    }
    
    // We also need to fix opacity strings like bg-[#1C1D20]/10 which might become bg-[#1C1D2033]/10.
    // Let's clean up any double opacities
    content = content.replace(/bg-\[#1C1D2033\]\/10/g, 'bg-[#1C1D20]/10');
    
    fs.writeFileSync(file, content, 'utf8');
  });
  
  console.log('Successfully applied new color system across all files!');
};

replaceColors();
