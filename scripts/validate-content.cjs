const fs=require('node:fs');
const path=require('node:path');
const {validate,safeUrl}=require('../dist/content-utils.js');
const root=path.resolve(__dirname,'../dist');
const data=validate(JSON.parse(fs.readFileSync(path.join(root,'content/site.json'),'utf8')));
for(const value of [data.heroImage,data.profileImage,...data.games.map(g=>g.image),...data.videos.flatMap(v=>[v.image,v.file]).filter(Boolean)]){
 const url=safeUrl(value,{local:true});
 if(!url.startsWith('https:')){
  const filename=path.resolve(root,decodeURIComponent(url));
  if(!filename.startsWith(root+path.sep)||!fs.existsSync(filename))throw Error('Missing local asset: '+url);
  const limit=/\.(mp4|webm)$/i.test(filename)?20971520:5242880;
  if(fs.statSync(filename).size>limit)throw Error('Asset exceeds upload limit: '+url);
 }
}
const config=JSON.parse(fs.readFileSync(path.join(root,'admin/config.yml'),'utf8'));
if(config.backend.repo!=='Yostin0R/gmg-alejo'||config.backend.name!=='github')throw Error('Unexpected CMS backend');
console.log(`Content validated: ${data.games.length} games, ${data.videos.length} videos.`);
