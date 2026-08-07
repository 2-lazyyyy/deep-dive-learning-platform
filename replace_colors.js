const fs = require('fs');

const files = [
    'src/components/teacher-sidebar.tsx',
    'src/components/teacher/lesson-editor.tsx',
    'src/app/teacher/settings/page.tsx',
    'src/app/teacher/page.tsx',
    'src/app/teacher/submissions/page.tsx',
    'src/app/teacher/lessons/page.tsx'
];

for (const f of files) {
    try {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/#CE82FF/gi, '#5E078A');
        content = content.replace(/#B86EE6/gi, '#4A0570');
        content = content.replace(/#A86BD8/gi, '#390457');
        content = content.replace(/#F3E8FF/gi, '#F4EAF9');
        fs.writeFileSync(f, content, 'utf8');
        console.log(`Updated ${f}`);
    } catch (e) {
        console.error(`Error updating ${f}:`, e.message);
    }
}
