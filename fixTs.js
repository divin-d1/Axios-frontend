const fs = require('fs');

const files = [
  './app/screening/[jobId]/page.tsx',
  './app/layout.tsx',
  './app/jobs/[id]/page.tsx',
  './app/jobs/page.tsx',
  './app/jobs/create/page.tsx',
  './app/emails/page.tsx',
  './app/company/page.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/const toast = \{ success: \(msg\) => alert\(msg\), error: \(msg\) => alert\(msg\), custom: \(\) => \{\} \};/g, 
                              'const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg), custom: () => {} };');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed types in', file);
  }
});
