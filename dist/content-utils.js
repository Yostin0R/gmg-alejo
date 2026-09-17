(function(root){
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function safeUrl(value,{local=false}={}){
    if(typeof value!=='string'||!value.trim())return '';
    const s=value.trim();
    if(local&&/^\/?assets\/[a-zA-Z0-9_./% -]+$/.test(s)&&!s.includes('..'))return s.replace(/^\//,'');
    try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password?u.href:''}catch{return ''}
  }
  function videoSource(item){
    const url=safeUrl(item.url);
    if(url){
      const u=new URL(url);let id='';
      if(u.hostname==='youtu.be')id=u.pathname.slice(1);
      if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname))id=u.searchParams.get('v')||u.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)$/)?.[1]||'';
      if(/^[a-zA-Z0-9_-]{11}$/.test(id))return {type:'youtube',url:'https://www.youtube-nocookie.com/embed/'+id};
      if(/\.(mp4|webm)$/i.test(u.pathname))return {type:'file',url};
      return {type:'external',url};
    }
    const file=safeUrl(item.file,{local:true});
    if(file&&/\.(mp4|webm)(?:\?.*)?$/i.test(file))return {type:'file',url:file};
    return null;
  }
  function validate(data){
    if(!data||!Array.isArray(data.games)||!Array.isArray(data.videos)||!Array.isArray(data.socials))throw Error('Content collections are missing');
    for(const key of ['heroImage','profileImage'])if(!safeUrl(data[key],{local:true}))throw Error('Invalid '+key);
    for(const collection of ['games','videos']){
      const ids=new Set();for(const item of data[collection]){
        if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)||ids.has(item.id))throw Error('Duplicate or invalid '+collection+' ID');ids.add(item.id);
        if(typeof item.title!=='string'||!item.title.trim())throw Error('Missing title');
        if(!safeUrl(item.image,{local:true}))throw Error('Invalid image');
      }
    }
    for(const v of data.videos){
      if(!data.games.some(g=>g.id===v.game))throw Error('Video references a missing game: '+v.id);
      if(!/^\d{4}-\d{2}-\d{2}$/.test(v.date)||Number.isNaN(Date.parse(v.date)))throw Error('Invalid date: '+v.id);
      if(v.url&&!safeUrl(v.url))throw Error('Invalid video URL');
      if(v.file&&(!safeUrl(v.file,{local:true})||! /\.(mp4|webm)$/i.test(v.file)))throw Error('Invalid video file');
      if(!v.sample&&!videoSource(v))throw Error('Video needs a link or file: '+v.id);
    }
    const platforms=new Set();for(const s of data.socials){if(!['YouTube','Twitch','TikTok','Instagram','Discord'].includes(s.platform)||platforms.has(s.platform))throw Error('Invalid or duplicate social platform');platforms.add(s.platform);if(s.url&&!safeUrl(s.url))throw Error('Invalid social URL')}
    return data;
  }
  const api={escape,safeUrl,videoSource,validate};if(typeof module!=='undefined')module.exports=api;else root.ContentUtils=api;
})(typeof window!=='undefined'?window:globalThis);
