const fs = require('fs');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
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
  if (content.includes('react-icons/fi') || content.includes('react-ions')) {
    // 1. Remove Imports
    content = content.replace(/import\s+\{[^}]+\}\s+from\s+['\"]react-icons\/fi['\"];?/g, '');
    
    // 2. Replace empty icon invocations
    content = content.replace(/<Fi[A-Za-z0-9]+\s*\/>/g, '<span className=\"w-4 h-4 bg-white/20 rounded-full inline-block\"></span>');
    
    // 3. Replace <FiIcon className="..." />
    content = content.replace(/<Fi[A-Za-z0-9]+[^>]*\/>/g, '<span className=\"w-4 h-4 bg-white/20 rounded-full inline-block\"></span>');
    
    // 4. Replace uncalled icons (for StatsCards, e.g. icon={FiUsers} -> icon={null})
    content = content.replace(/{Fi[A-Za-z0-9]+}/g, '{null}');

    fs.writeFileSync(file, content, 'utf8');
    console.log('Patched', file);
  }
});
