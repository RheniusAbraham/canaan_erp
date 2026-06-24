import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('page.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/app');
let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('animate-stagger')) {
    // Find the first <div className=" after the 'return' keyword
    // Since some components might have early returns, we look for 'return ('
    const returnIndex = content.indexOf('return (');
    if (returnIndex !== -1) {
      const beforeReturn = content.substring(0, returnIndex);
      let afterReturn = content.substring(returnIndex);
      
      afterReturn = afterReturn.replace(/<div\s+className="/, '<div className="animate-stagger ');
      content = beforeReturn + afterReturn;
      fs.writeFileSync(file, content);
      modifiedCount++;
    } else {
      // Just replace the first <div className="
      content = content.replace(/<div\s+className="/, '<div className="animate-stagger ');
      fs.writeFileSync(file, content);
      modifiedCount++;
    }
  }
}

console.log(`Successfully added animate-stagger to ${modifiedCount} files.`);
