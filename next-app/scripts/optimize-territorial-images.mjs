import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import sharp from 'sharp';
const rows=JSON.parse(await readFile('../docs/catalog/GET-CATALOG-IMAGE-SOURCES.json','utf8'));
await mkdir('public/assets/catalog',{recursive:true});
for(const row of rows){
 const output='public'+row.output;
 await sharp(row.sourcePath).resize(1200,800,{fit:'cover'}).webp({quality:78,effort:6}).toFile(output);
 await sharp(row.sourcePath).resize(480,320,{fit:'cover'}).webp({quality:76,effort:6}).toFile(output.replace('.webp','-card.webp'));
 row.width=1200;row.height=800;row.bytes=(await stat(output)).size;row.thumbnail=row.output.replace('.webp','-card.webp');row.thumbnailBytes=(await stat('public'+row.thumbnail)).size;
}
await writeFile('../docs/catalog/GET-CATALOG-IMAGES.json',JSON.stringify(rows,null,2)+'\n');
console.log(JSON.stringify({generated:rows.length,webpFiles:rows.length*2,totalBytes:rows.reduce((n,r)=>n+r.bytes+r.thumbnailBytes,0),largest:Math.max(...rows.map(r=>r.bytes))}));
