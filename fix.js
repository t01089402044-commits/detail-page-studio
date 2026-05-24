const fs = require('fs');
const js = fs.readFileSync('public/editor.js', 'utf8');

const idx = js.indexOf("feat:");
console.log('=== feat 섹션 ===');
console.log(js.substring(idx, idx+600));
console.log('\n=== 전체 izNew 목록 ===');
const matches = js.match(/izNew\([^)]+\)/g);
matches.forEach(m => console.log(m));