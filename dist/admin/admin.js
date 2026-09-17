if(window.CMS){
 CMS.registerEventListener({name:'preSave',handler:({entry})=>{
  if(entry.get('collection')==='website')ContentUtils.validate(entry.get('data').toJS());
 }});
 CMS.init();
 document.querySelector('#loading-status').textContent='Inicia sesión con GitHub. Si el acceso aún no está configurado, consulta la guía.';
}
