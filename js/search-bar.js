/* SEARCH — fixed version of your original (it was looking for a .search-button that didn't exist). Needs products.js. */
(() => {
  const box=$('.search-box'),btn=$('.search-icon'),form=$('.search-form'),input=$('.search-input'),list=$('.search-results');
  if(!box||!btn)return;
  const close=()=>{box.hidden=true;btn.setAttribute('aria-expanded','false')};
  btn.addEventListener('click',()=>{box.hidden=!box.hidden;btn.setAttribute('aria-expanded',String(!box.hidden));if(!box.hidden)input.focus()});
  input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();list.innerHTML=q?PRODUCTS.filter(p=>(p.name+p.cat+p.short).toLowerCase().includes(q)).slice(0,5).map(p=>`<li><a href="product.html?id=${p.id}"><span>${esc(p.name)}</span><span>${fmt(p.price)}</span></a></li>`).join(''):''});
  form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(q)location.href='shop.html?q='+encodeURIComponent(q)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
})();
