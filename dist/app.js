'use strict';
const {escape:esc,safeUrl,videoSource,validate}=ContentUtils;
let games=[],videos=[],socials=[];
function renderVideos(filter){
 const shown=filter?videos.filter(v=>v.game===filter):videos;
 document.querySelector('#video-grid').innerHTML=shown.map(v=>`<article class="video-card"><button class="thumbnail" data-video="${esc(v.id)}" aria-label="Watch ${esc(v.title)}"><img src="${esc(safeUrl(v.image,{local:true}))}" alt="${esc(v.title)}" loading="lazy"><span class="play">▷</span>${v.duration?`<span class="duration">${esc(v.duration)}</span>`:''}</button><div class="video-info"><span class="category">${esc(games.find(g=>g.id===v.game)?.title.toUpperCase()||'')}${v.sample?' · SAMPLE':''}</span><h3>${esc(v.title)}</h3><div class="video-meta"><span>${v.views?'◉ '+esc(v.views)+' views':''}</span><time datetime="${esc(v.date)}">${esc(v.date)}</time></div></div></article>`).join('');
 document.querySelector('#empty-state').hidden=shown.length>0;
 document.querySelector('#filter-label').textContent=filter?(games.find(g=>g.id===filter)?.title.toUpperCase()||'GAME')+' CONTENT':'FEATURED MOMENTS';
 document.querySelector('#sample-label').hidden=!shown.some(v=>v.sample);
}
async function loadContent(){
 const status=document.querySelector('#content-status');
 try{
  const response=await fetch('content/site.json',{cache:'no-cache'});if(!response.ok)throw Error('Content unavailable');
  const content=validate(await response.json());({games,videos,socials}=content);
  document.querySelector('#game-grid').innerHTML=games.map(g=>`<article class="game-card"><img src="${esc(safeUrl(g.image,{local:true}))}" alt="${esc(g.title)} game artwork" loading="lazy"><div class="game-info"><small>${esc(g.category)}</small><h3>${esc(g.title.toUpperCase())}</h3><button data-game="${esc(g.id)}">View Content <span>↗</span></button></div></article>`).join('');
  document.querySelector('.hero-art').style.backgroundImage='url('+JSON.stringify(safeUrl(content.heroImage,{local:true}))+')';
  document.querySelector('.profile-visual>img').src=safeUrl(content.profileImage,{local:true});
  renderVideos();status.textContent=games.length?'':'New games are coming soon.';status.hidden=games.length>0;
 }catch(error){status.hidden=false;status.replaceChildren(document.createTextNode('Content could not be loaded. '));const retry=document.createElement('button');retry.textContent='Try again';retry.className='text-link';retry.addEventListener('click',loadContent);status.append(retry);document.querySelector('#sample-label').hidden=true;console.error(error.message)}
}
loadContent();

const icons={PC:'<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="9" r="3"/><path d="M10 18h4"/>',Monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M12 17v4m-5 0h10"/>',Keyboard:'<rect x="1" y="6" width="22" height="12" rx="2"/><path d="M4 10h1m3 0h1m3 0h1m3 0h1m3 0h1M4 14h1m3 0h8m3 0h1"/>',Mouse:'<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 2v7"/>',Headset:'<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="12" width="5" height="8" rx="2"/><rect x="17" y="12" width="5" height="8" rx="2"/>',Controller:'<path d="M7 7h10c3 0 6 10 4 12s-5-3-7-3h-4c-2 0-5 5-7 3S4 7 7 7Z"/><path d="M8 10v5m-2.5-2.5h5M16 11h.01M18 14h.01"/>'};
const svg=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
document.querySelector('#setup-grid').innerHTML=Object.entries(icons).map(([name,path],i)=>`<article class="setup-card"><div class="setup-icon">${svg(path)}</div><h3>${name==='PC'?'Gaming PC':name}</h3><p>${['THE POWERHOUSE','EVERY FRAME COUNTS','BUILT FOR PRECISION','MAKE EVERY MOVE','HEAR EVERYTHING','TAKE CONTROL'][i]}</p></article>`).join('');
const socialIcons={YouTube:'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z"/>',Twitch:'<path d="M4 2h18v14l-5 5h-5l-4 3v-3H3V6ZM9 21v-5H6V5h13v10l-4 3h-3Z"/><path d="M11 7v5m5-5v5"/>',TikTok:'<path d="M14 3v13a5 5 0 1 1-5-5v4a2 2 0 1 0 2 2V3h3c1 3 3 5 6 5v4c-3 0-5-2-6-3"/>',Instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',Discord:'<path d="m8 5-3 1-3 12 5 2 2-3m6 0 2 3 5-2-3-12-3-1M6 16c4 2 8 2 12 0M8 6h8"/><circle cx="8" cy="12" r="1"/><circle cx="16" cy="12" r="1"/>'};
document.querySelector('#social-grid').innerHTML=Object.entries(socialIcons).map(([name,path])=>`<button class="social-card" data-social="${name}">${svg(path)}<span><strong>${name}</strong><small>${name==='Discord'?'Join the squad':'@GMG_ALEJO7'}</small></span><span>↗</span></button>`).join('');document.querySelector('#footer-socials').innerHTML=Object.entries(socialIcons).map(([name,path])=>`<button data-social="${name}" aria-label="${name}">${svg(path)}</button>`).join('');
const dialog=document.querySelector('dialog');function showDialog(title,description,label){document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-description').textContent=description;document.querySelector('#dialog-label').textContent=label;dialog.showModal()}

const player=document.querySelector('#video-player');
function clearPlayer(){player.replaceChildren();dialog.classList.remove('has-video')}
dialog.addEventListener('close',clearPlayer);
document.addEventListener('click',e=>{
 const game=e.target.closest('[data-game]');if(game){renderVideos(game.dataset.game);document.querySelector('#videos').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
 const video=e.target.closest('[data-video]');if(video){
  const item=videos.find(v=>v.id===video.dataset.video);if(!item)return;clearPlayer();const source=videoSource(item);
  showDialog(item.title,source?'':(item.sample?'This is a sample highlight. The official video is coming soon.':'Video unavailable.'),games.find(g=>g.id===item.game)?.title.toUpperCase()||'VIDEO');
  if(source?.type==='youtube'){const frame=document.createElement('iframe');frame.src=source.url;frame.title=item.title;frame.allow='encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';player.append(frame);dialog.classList.add('has-video')}
  if(source?.type==='file'){const media=document.createElement('video');media.controls=true;media.playsInline=true;media.preload='metadata';media.src=source.url;media.poster=safeUrl(item.image,{local:true});media.addEventListener('error',()=>{document.querySelector('#dialog-description').textContent='The video could not be loaded. Please try again later.'});player.append(media);dialog.classList.add('has-video')}
  if(source?.type==='external'){const link=document.createElement('a');link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';link.className='button primary';link.textContent='WATCH ON PLATFORM ↗';player.append(link)}
 }
 const social=e.target.closest('[data-social]');if(social){const url=safeUrl(socials.find(s=>s.platform===social.dataset.social)?.url);if(url){window.open(url,'_blank','noopener,noreferrer')}else{clearPlayer();showDialog('GMG_ALEJO7 ON '+social.dataset.social.toUpperCase(),'The official profile link is coming soon.','JOIN THE COMMUNITY')}}
 if(e.target.closest('.dialog-close,.dialog-dismiss'))dialog.close();
});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});

for(const id of ['reset-filter','show-all'])document.getElementById(id).addEventListener('click',()=>renderVideos());const menu=document.querySelector('.menu-toggle');menu.addEventListener('click',()=>{const open=document.querySelector('header nav').classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.textContent=open?'×':'☰'});document.querySelectorAll('header nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('header nav').classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('header nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id))}})},{rootMargin:'-20% 0px -50% 0px'});document.querySelectorAll('main section[id]').forEach(s=>observer.observe(s));if(!matchMedia('(prefers-reduced-motion: reduce)').matches){let waiting=false;window.addEventListener('scroll',()=>{if(!waiting){requestAnimationFrame(()=>{if(scrollY<innerHeight)document.querySelector('.hero-art').style.transform=`translateY(${scrollY*.16}px) scale(1.04)`;waiting=false});waiting=true}},{passive:true})}

