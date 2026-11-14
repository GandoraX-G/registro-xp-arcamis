import {readFileSync} from 'node:fs';
const grab=f=>{const m=readFileSync(f,'utf8').match(/\b\d{8}[a-z]\b/);return m&&m[0]};
const a=grab('public/index.html'),b=grab('public/sw.js');
if(!a||!b||a!==b){console.error(`Versione cache disallineata: index.html=${a} sw.js=${b}`);process.exit(1)}
console.log('versione cache coerente:',a);
