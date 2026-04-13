const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('./app');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Scrub react-hot-toast
  if (content.includes('react-hot-toast')) {
    content = content.replace(/import\s+(?:\{[^}]+\}|toast)\s+from\s+['\"]react-hot-toast['\"];?/g, '');
    if (!content.includes('const toast =')) {
        // Add a mock toast object
        content = content.replace(/import .+;(\r?\n)/, '$&\nconst toast = { success: (msg) => alert(msg), error: (msg) => alert(msg), custom: () => {} };\n');
    }
    // Remove Toaster component
    content = content.replace(/<Toaster\s*[^>]*\/>/g, '');
    changed = true;
  }

  // 2. Scrub framer-motion
  if (content.includes('framer-motion')) {
    content = content.replace(/import\s+(?:\{[^}]+\}|motion)\s+from\s+['\"]framer-motion['\"];?/g, '');
    content = content.replace(/<motion\.div/g, '<div');
    content = content.replace(/<\/motion\.div>/g, '</div>');
    content = content.replace(/initial=\{[^}]+\}/g, '');
    content = content.replace(/animate=\{[^}]+\}/g, '');
    content = content.replace(/exit=\{[^}]+\}/g, '');
    content = content.replace(/transition=\{[^}]+\}/g, '');
    changed = true;
  }

  // 3. Scrub Recharts
  if (content.includes('recharts')) {
    content = content.replace(/import\s+\{[^}]+\}\s+from\s+['\"]recharts['\"];?/g, '');
    // Regex to remove the whole ResponsiveContainer block. Very tricky, so just replace the tags safely
    content = content.replace(/<(ResponsiveContainer|BarChart|Bar|XAxis|YAxis|Tooltip|Cell)[^>]*>/g, '<div>');
    content = content.replace(/<\/(ResponsiveContainer|BarChart|Bar|XAxis|YAxis|Tooltip|Cell)>/g, '</div>');
    changed = true;
  }

  // 4. Scrub Redux (Mainly checking if it's there)
  if (content.includes('react-redux') || content.includes('@reduxjs/toolkit')) {
    content = content.replace(/import\s+\{[^}]+\}\s+from\s+['\"]react-redux['\"];?/g, '');
    content = content.replace(/import\s+\{[^}]+\}\s+from\s+['\"]@reduxjs\/toolkit['\"];?/g, '');
    content = content.replace(/<Provider\s+store=\{[^}]+\}>/g, '<>');
    content = content.replace(/<\/Provider>/g, '</>');
    // remove store imports completely
    content = content.replace(/import\s+\w+\s+from\s+['\"].*\/(store|redux)['\"];?/g, '');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Patched', file);
  }
});
