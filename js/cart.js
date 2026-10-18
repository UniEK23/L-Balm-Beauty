/* CART — stored in the browser (localStorage). */
const Cart={
  key:'lbalm_cart',promoKey:'lbalm_promo',
  get(){try{return JSON.parse(localStorage.getItem(this.key))||[]}catch(e){return[]}},
  save(c){localStorage.setItem(this.key,JSON.stringify(c));this.badge()},
  add(id,q=1){const c=this.get(),i=c.find(x=>x.id===id);i?i.q+=q:c.push({id,q});this.save(c)},
  setQty(id,q){const c=this.get(),i=c.find(x=>x.id===id);if(!i)return;i.q=Math.max(1,q);this.save(c)},
  remove(id){this.save(this.get().filter(x=>x.id!==id))},
  clear(){this.save([])},
  count(){return this.get().reduce((a,b)=>a+b.q,0)},
  lines(){return this.get().map(l=>({...l,p:PRODUCTS.find(p=>p.id===l.id)})).filter(l=>l.p)},
  code(){return localStorage.getItem(this.promoKey)||''},
  setCode(c){const k=c.trim().toUpperCase();if(!PROMO[k])return false;localStorage.setItem(this.promoKey,k);return true},
  totals(){const sub=this.lines().reduce((a,l)=>a+l.p.price*l.q,0),disc=Math.round(sub*(PROMO[this.code()]||0)),after=sub-disc,ship=!sub?0:(after>=FREE_OVER?0:FLAT_SHIPPING);return{sub,disc,ship,total:after+ship,after}},
  badge(){const n=this.count();$$('.cart-count').forEach(b=>{b.textContent=n;b.hidden=!n})}
};
let toastTimer;function toast(m){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2400)}
