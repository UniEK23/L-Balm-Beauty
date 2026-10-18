/* PAGE LOGIC — each page sets <body data-page="..."> and the matching function below runs. */
const params=new URLSearchParams(location.search);
const Pages={
  home(){$('[data-render=bestsellers]').innerHTML=PRODUCTS.filter(p=>p.best).slice(0,4).map(card).join('')},
  shop(){
    const cat=params.get('category')||'all',q=(params.get('q')||'').toLowerCase(),sort=params.get('sort')||'featured';
    $('.chips').innerHTML=['all',...Object.keys(CATS)].map(c=>`<a class="chip ${c===cat?'active':''}" href="shop.html?category=${c}">${c==='all'?'All':CATS[c]}</a>`).join('');
    const list=PRODUCTS.filter(p=>(cat==='all'||p.cat===cat)&&(!q||(p.name+' '+p.cat+' '+p.short).toLowerCase().includes(q)));
    if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name));
    $('#count').textContent=list.length+(list.length===1?' product':' products')+(q?' for “'+params.get('q')+'”':'');
    $('#grid').innerHTML=list.length?list.map(card).join(''):'<div class="empty" style="grid-column:1/-1"><h3>Nothing found</h3><p>Try another search, or browse the full collection.</p><a class="btn" href="shop.html">View all products</a></div>';
    const s=$('#sort');s.value=sort;s.onchange=()=>{params.set('sort',s.value);location.search=params.toString()};
  },
  product(){
    const p=PRODUCTS.find(x=>x.id===params.get('id'))||PRODUCTS[0];let q=1;document.title=p.name+" — L'Balm Beauty";
    const imgs=p.gallery||[p.img||IMG,p.img||IMG,p.img||IMG],pos=p.gallery?['50% 50%','50% 50%','50% 50%']:['50% 62%','50% 25%','50% 92%'];
    $('#crumb-name').textContent=p.name;
    $('#pdp').innerHTML=`<div class="gallery reveal"><div class="main"><img id="mainimg" src="${imgs[0]}" alt="${esc(p.name)}" style="object-position:${pos[0]}"></div><div class="thumbs">${imgs.map((s,i)=>`<button class="${i?'':'on'}" data-i="${i}" aria-label="View image ${i+1}"><img src="${s}" alt="" style="object-position:${pos[i]}"></button>`).join('')}</div></div>
    <div class="pdp-info reveal"><span class="eyebrow">${CATS[p.cat]} · ${p.size}</span><h1>${esc(p.name)}</h1><div class="pdp-price">${fmt(p.price)}</div><p class="pdp-short">${esc(p.desc)}</p>
    <div class="pdp-buy"><div class="qty"><button aria-label="Decrease" data-q="-1">−</button><span id="qv">1</span><button aria-label="Increase" data-q="1">+</button></div><button class="cta" id="addbtn">Add to bag</button></div>
    <a class="btn outline" href="cart.html" id="buynow">Buy now</a>
    <ul class="assure"><li><i class="ri-shield-check-line"></i>100% authentic products</li><li><i class="ri-lock-line"></i>Secure checkout</li><li><i class="ri-truck-line"></i>Complimentary delivery over ${fmt(FREE_OVER)}</li></ul>
    <div><details open><summary>Description</summary><div class="body"><p>${esc(p.desc)}</p></div></details>
    <details><summary>${p.cat==='fragrance'?'Fragrance notes':'Key ingredients'}</summary><div class="body"><ul class="dots">${p.ing.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div></details>
    <details><summary>How to use</summary><div class="body"><p>${esc(p.use)}</p></div></details>
    <details><summary>Caution</summary><div class="body"><p>${esc(p.caution)}</p></div></details></div></div>`;
    $$('.thumbs button').forEach(b=>b.onclick=()=>{$$('.thumbs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');const i=+b.dataset.i,m=$('#mainimg');m.src=imgs[i];m.style.objectPosition=pos[i]});
    $$('[data-q]').forEach(b=>b.onclick=()=>{q=Math.max(1,Math.min(10,q+ +b.dataset.q));$('#qv').textContent=q});
    $('#addbtn').onclick=()=>{Cart.add(p.id,q);toast(p.name+' added to your bag')};
    $('#buynow').onclick=()=>Cart.add(p.id,q);
    const rel=PRODUCTS.filter(x=>x.id!==p.id).sort((a,b)=>(b.cat===p.cat)-(a.cat===p.cat)).slice(0,4);$('#related').innerHTML=rel.map(card).join('');
  },
  cart(){
    const root=$('#cart-root');
    const draw=()=>{const ls=Cart.lines();
      if(!ls.length){root.innerHTML='<div class="empty"><h3>Your bag is empty</h3><p>Discover something your skin will love.</p><a class="btn" href="shop.html">Continue shopping</a></div>';return}
      const t=Cart.totals(),left=Math.max(0,FREE_OVER-t.after);
      root.innerHTML=`<div class="cart-layout"><div>${ls.map(l=>`<div class="line"><a href="product.html?id=${l.p.id}"><img src="${l.p.img||IMG}" alt="${esc(l.p.name)}"></a><div><h3><a href="product.html?id=${l.p.id}">${esc(l.p.name)}</a></h3><div class="meta">${CATS[l.p.cat]} · ${l.p.size} · ${fmt(l.p.price)}</div><div class="qty"><button data-a="dec" data-id="${l.p.id}" aria-label="Decrease">−</button><span>${l.q}</span><button data-a="inc" data-id="${l.p.id}" aria-label="Increase">+</button></div><button class="rm" data-a="rm" data-id="${l.p.id}">Remove</button></div><div class="tot">${fmt(l.p.price*l.q)}</div></div>`).join('')}</div>
      <aside class="summary"><h3>Order summary</h3><div class="progress">${left?`Add ${fmt(left)} more for complimentary delivery`:'You have complimentary delivery'}</div>
      <div class="row"><span>Subtotal</span><span>${fmt(t.sub)}</span></div>${t.disc?`<div class="row"><span>Discount (${Cart.code()})</span><span>−${fmt(t.disc)}</span></div>`:''}<div class="row"><span>Delivery</span><span>${t.ship?fmt(t.ship):'Free'}</span></div><div class="row total"><span>Total</span><span>${fmt(t.total)}</span></div>
      <form class="promo" id="promo"><input id="code" placeholder="Promo code" aria-label="Promo code"><button>Apply</button></form><div class="form-note" id="pm"></div>
      <a class="cta" href="checkout.html">Proceed to checkout</a><p class="note">Delivery is calculated at checkout. Prices in Nigerian naira (₦).</p></aside></div>`;
      $('#promo').onsubmit=e=>{e.preventDefault();if(Cart.setCode($('#code').value))draw();else $('#pm').textContent='That code is not valid.'};
    };
    root.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const id=b.dataset.id,l=Cart.get().find(x=>x.id===id);if(b.dataset.a==='inc')Cart.setQty(id,l.q+1);if(b.dataset.a==='dec')Cart.setQty(id,l.q-1);if(b.dataset.a==='rm')Cart.remove(id);draw()};
    draw();
  },
  checkout(){
    const ls=Cart.lines(),t=Cart.totals();
    $('#sum').innerHTML=ls.length?ls.map(l=>`<div class="row"><span>${esc(l.p.name)} × ${l.q}</span><span>${fmt(l.p.price*l.q)}</span></div>`).join('')+`<div class="row"><span>Delivery</span><span>${t.ship?fmt(t.ship):'Free'}</span></div>${t.disc?`<div class="row"><span>Discount</span><span>−${fmt(t.disc)}</span></div>`:''}<div class="row total"><span>Total</span><span>${fmt(t.total)}</span></div>`:'<p>Your bag is empty. <a href="shop.html" class="link-arrow">Shop now</a></p>';
    $('#co').onsubmit=e=>{e.preventDefault();if(!ls.length){toast('Your bag is empty');return}const f=new FormData(e.target),pay=f.get('pay');
      const msg=`Hello L'Balm Beauty, I'd like to place an order.\n\n${ls.map(l=>`• ${l.p.name} × ${l.q} — ${fmt(l.p.price*l.q)}`).join('\n')}\n\nDelivery: ${t.ship?fmt(t.ship):'Free'}\nTotal: ${fmt(t.total)}\nPayment: ${pay}\n\nName: ${f.get('name')}\nPhone: ${f.get('phone')}\nEmail: ${f.get('email')}\nAddress: ${f.get('address')}, ${f.get('city')}, ${f.get('state')}\nNotes: ${f.get('notes')||'-'}`;
      window.open('https://wa.me/'+SHOP_WA+'?text='+encodeURIComponent(msg),'_blank');$('#done').hidden=false};
  },
  contact(){$('#cf').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);location.href='mailto:info@lbalmbeauty.com?subject='+encodeURIComponent(f.get('subject')||'Enquiry from website')+'&body='+encodeURIComponent(f.get('message')+'\n\n— '+f.get('name')+' ('+f.get('email')+')');$('#cdone').hidden=false}},
  track(){$('#tf').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);window.open('https://wa.me/'+SHOP_WA+'?text='+encodeURIComponent('Hello, I would like an update on order '+f.get('order')+'. Email: '+f.get('email')),'_blank')}},
  auth(){const f=$('form[data-auth]');f.addEventListener('submit',e=>{e.preventDefault();const m=$('.auth-msg');m.hidden=false;
    if(f.dataset.auth==='register'&&f.password.value.length<8){m.textContent='Please choose a password of at least 8 characters.';return}
    m.textContent='Front-end demo: accounts need a backend (e.g. Firebase or Supabase) before real sign-in works.'})}
};
if(Pages[document.body.dataset.page])Pages[document.body.dataset.page]();
if(window.observeReveals)observeReveals();
