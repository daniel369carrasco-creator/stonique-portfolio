(()=>{
 const lang=(document.documentElement.lang||'es').slice(0,2);
 const grid=document.getElementById('media-grid');
 const empty=document.getElementById('media-empty');
 const labels={es:{tutorial:'Guía',video:'Video',audio:'Audio',youtube:'Video',empty:'Todavía no hay audios o videos cargados.'},en:{tutorial:'Guide',video:'Video',audio:'Audio',youtube:'Video',empty:'No audio or video files have been added yet.'},pt:{tutorial:'Guia',video:'Vídeo',audio:'Áudio',youtube:'Vídeo',empty:'Ainda não foram adicionados áudios ou vídeos.'}};
 const L=labels[lang]||labels.es;
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
 const localMedia=(src)=>typeof src==='string'&&!src.startsWith('/')&&!src.startsWith('..')&&!/^https?:/i.test(src);
 const youtubeId=(src)=>{try{const u=new URL(src);if(u.hostname==='youtu.be')return u.pathname.slice(1);if(u.hostname.endsWith('youtube.com'))return u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).pop();}catch(e){}return null;};
 fetch('resources.json').then(r=>{if(!r.ok)throw new Error('resources');return r.json()}).then(data=>{
   const items=Array.isArray(data[lang])?data[lang]:[];let playable=0;
   for(const item of items){
     if(!item||!['tutorial','video','audio','youtube'].includes(item.type))continue;
     const card=el('article','resource-card');
     const title=el('h3','',item.title||L[item.type]);card.append(title);
     if(item.summary)card.append(el('p','',item.summary));
     if(item.type==='tutorial'){
       const d=document.createElement('details');const sum=el('summary','',L.tutorial);d.append(sum);
       if(item.body)d.append(el('p','',item.body));card.append(d);
     }else if(item.type==='audio'||item.type==='video'){
       if(!localMedia(item.src))continue;
       const player=document.createElement(item.type);player.controls=true;player.preload='metadata';player.className='media-player';player.src=item.src;
       if(item.type==='video'){player.playsInline=true;if(localMedia(item.poster))player.poster=item.poster;}
       card.append(player);playable++;
     }else if(item.type==='youtube'){
       const id=youtubeId(item.src||'');if(!id)continue;
       const frame=document.createElement('iframe');frame.className='media-player';frame.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id);frame.title=item.title||'Video';frame.loading='lazy';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;card.append(frame);playable++;
     }
     grid.append(card);
   }
   if(playable===0&&empty)empty.textContent=L.empty;
   else if(playable>0&&empty)empty.hidden=true;
 }).catch(()=>{if(empty)empty.textContent=L.empty;});
})();
