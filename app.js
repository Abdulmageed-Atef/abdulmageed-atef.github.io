const btn=document.querySelector('.menu-btn');
const links=document.querySelector('.nav-links');
if(btn&&links){btn.addEventListener('click',()=>{links.style.display=links.style.display==='flex'?'none':'flex';links.style.position='absolute';links.style.top='76px';links.style.left='0';links.style.right='0';links.style.background='#071523';links.style.padding='16px 5%';links.style.flexDirection='column';});}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
