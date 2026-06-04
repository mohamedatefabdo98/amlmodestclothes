// ======= PRODUCTS DATA =======
const PRODUCTS = {
  winter: [
    {id:'w3',name:'دريس شتوي رباط',price:950,imgId:'1ncpV11mmkb-CqI7-YasiVyN9FPLXKEKf',badge:'شتوي'},
    {id:'w2',name:'دريس شتوي مضفر',price:850,imgId:'18uZv8R-CWFb7CZRCH1s5o1NSfJoTs_y5',badge:'شتوي'},
    {id:'w4',name:'سوت شتوي مضلع',price:800,imgId:'1OTfxp3EPxrdF3AN1jB0e8J-Uvh-sepXx',badge:'شتوي'},
    {id:'w1',name:'دريس شتوي مضلع',price:800,imgId:'1BxOx1WXD2XCl48aIsWG7SjUIFDlzrbWc',badge:'شتوي'},
    {id:'w5',name:'كوت جوخ',price:950,imgId:'1am8tdNZFT8cfnMMgAUQ4uWHQW7BM3tIB',badge:'شتوي'},
  ],
  summer: [
    {id:'s7',name:'شيرت دريس',price:800,imgId:'1gzjSp3XtQ7Fd7rjSmIlFj_j1baEHTLC8',badge:'صيفي'},
    {id:'s4',name:'دريس صيفي رباط',price:750,imgId:'1K29kAQCUHogP0hayf4SX_5U2390Y1mDA',badge:'صيفي'},
    {id:'s3',name:'دريس اوفر سايز',price:750,imgId:'1sK-aceMfrSOA8begRPl2f6Ri4cQao9Eh',badge:'صيفي'},
    {id:'s2',name:'دريس بيليسيه رباط',price:800,imgId:'1rZ0itEnXQfNG1thtEcz6OMHfoSr3UZzP',badge:'صيفي'},
    {id:'s1',name:'الكاردي العباية',price:800,imgId:'185ERyxzBeMAYR96yoQ_Ay8L1YPDuOSI-',badge:'صيفي'},
    {id:'s5',name:'سوت صيفي (شميز-اسكيرت)',price:800,imgId:'1rYtBKTeH2pSSDMbbQbDscQCmaNgQkd0P',badge:'صيفي'},
    {id:'s6',name:'شميز دريس صيفي',price:750,imgId:'1Qd6AxIXzylZCL7xvjtI3fEFRgv2yDISL',badge:'صيفي'},
    {id:'s8',name:'لونج كيمونو',price:750,imgId:'1fMlYWzxZAaafMKcDf5VlVXVGTKyIzQxW',badge:'صيفي'},
    {id:'s9',name:'ميني كيمونو',price:700,imgId:'1IwLTK9H4Kui8sHhkvvVpvx7vxx73_6H3',badge:'صيفي'},
  ]
};

function img(id, sz='w600') {
  return 'https://drive.google.com/thumbnail?id=' + id + '&sz=' + sz;
}

function card(p) {
  return `<div class="product-card">
    <div class="card-img-wrap">
      <img src="${img(p.imgId)}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/400x533/EFE4D0/2C1A0E?text=${encodeURIComponent(p.name)}'">
      <span class="card-badge">${p.badge}</span>
      <button class="wishlist-btn" onclick="toggleWish(event,'${p.id}')" title="أضيفي للمفضلة"><i class="ti ti-heart"></i></button>
    </div>
    <div class="card-body">
      <p class="card-name">${p.name}</p>
      <div class="card-footer">
        <span class="card-price">${p.price} جنيه</span>
        <button class="card-action" onclick="openDetail('${p.id}')">التفاصيل</button>
      </div>
    </div>
  </div>`;
}

// ======= TOAST =======
let toastT;
function showToast(msg) {
  let t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2400);
}

// ======= CART =======
let cart = [];
function addToCart(name, price, imgSrc, size) {
  let key = name + '||' + size;
  let ex = cart.find(i => i.key === key);
  if (ex) ex.qty++;
  else cart.push({key, name, price, img: imgSrc, size, qty: 1});
  renderCart();
  showToast('تمت الإضافة ✓');
}
function removeItem(key) { cart = cart.filter(i => i.key !== key); renderCart(); }
function changeQty(key, d) {
  let it = cart.find(i => i.key === key);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) removeItem(key); else renderCart();
}
function renderCart() {
  let wrap = document.getElementById('cartItems');
  let foot = document.getElementById('cartFoot');
  let cnt = document.getElementById('cartCount');
  let tot = document.getElementById('cartTotal');
  let total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  let count = cart.reduce((s, i) => s + i.qty, 0);
  cnt.textContent = count;
  cnt.classList.toggle('show', count > 0);
  let mcnt = document.getElementById('cartCountMobile');
  if (mcnt) mcnt.textContent = count;
  if (!cart.length) {
    wrap.innerHTML = '<p class="cart-empty-msg">السلة فارغة</p>';
    foot.style.display = 'none';
    return;
  }
  foot.style.display = 'block';
  tot.textContent = total + ' جنيه';
  wrap.innerHTML = cart.map(it => {
    let k = it.key.replace(/'/g, "\\'");
    return `<div class="cart-item">
      <img src="${it.img}" alt="${it.name}" onerror="this.style.display='none'">
      <div style="flex:1">
        <p class="cart-item-name">${it.name}</p>
        <p class="cart-item-size">${it.size}</p>
        <p class="cart-item-price">${it.price * it.qty} جنيه</p>
        <div class="qty-row">
          <button class="q-btn" onclick="changeQty('${k}',-1)">−</button>
          <span style="font-weight:600;font-size:.9rem">${it.qty}</span>
          <button class="q-btn" onclick="changeQty('${k}',1)">+</button>
        </div>
      </div>
      <button class="rm-btn" onclick="removeItem('${k}')">✕</button>
    </div>`;
  }).join('');
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('backdrop').classList.add('open');
  document.getElementById('wishDrawer').classList.remove('open');
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  if (!document.getElementById('wishDrawer').classList.contains('open'))
    document.getElementById('backdrop').classList.remove('open');
}

// ======= CHECKOUT =======
let selPay = 'cod';
function openCheckout() { if (!cart.length) return; goStep1(); document.getElementById('checkoutModal').classList.add('open'); }
function closeCheckout() { document.getElementById('checkoutModal').classList.remove('open'); }
function goStep1() {
  document.getElementById('step-ship').style.display = 'block';
  document.getElementById('step-platform').style.display = 'none';
}
function goStep2() {
  let valid = true;
  let fields = [
    {id:'sh-name', err:'err-name', ok: v => v.trim().split(/\s+/).length >= 3},
    {id:'sh-phone1', err:'err-phone1', ok: v => /^01[0-2,5]{1}[0-9]{8}$/.test(v.trim())},
    {id:'sh-gov', err:'err-gov', ok: v => v !== ''},
    {id:'sh-address', err:'err-address', ok: v => v.trim().length >= 5},
    {id:'sh-color', err:'err-color', ok: v => v.trim().length >= 2}
  ];
  fields.forEach(f => {
    let el = document.getElementById(f.id);
    let ok = f.ok(el.value);
    el.classList.toggle('err', !ok);
    document.getElementById(f.err).classList.toggle('show', !ok);
    if (!ok) valid = false;
  });
  if (!valid) return;
  document.getElementById('step-ship').style.display = 'none';
  document.getElementById('step-platform').style.display = 'block';
}

function buildMsg() {
  let name = document.getElementById('sh-name').value.trim();
  let p1 = document.getElementById('sh-phone1').value.trim();
  let p2 = document.getElementById('sh-phone2').value.trim();
  let gov = document.getElementById('sh-gov').value;
  let addr = document.getElementById('sh-address').value.trim();
  let color = document.getElementById('sh-color').value.trim();
  let lines = cart.map(i => '- ' + i.name + '\n  المقاس: ' + i.size + '\n  الكمية: ' + i.qty + ' x ' + i.price + ' = ' + i.price * i.qty + ' جنيه').join('\n\n');
  let total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return 'أهلاً AML Modest Clothes\nأريد طلب:\n\n' + lines + '\n\nالإجمالي: ' + total + ' جنيه\n\n--- بيانات الشحن ---\nالاسم: ' + name + '\nموبايل 1: ' + p1 + (p2 ? '\nموبايل 2: ' + p2 : '') + '\nالمحافظة: ' + gov + '\nالعنوان: ' + addr + '\nاللون: ' + color;
}

function doCheckout(platform) {
  let text = buildMsg();
  closeCheckout(); closeCart();
  if (platform === 'whatsapp') {
    let ov = document.getElementById('successWa');
    let prog = ov.querySelector('.success-prog');
    prog.innerHTML = '<div class="success-fill"></div>';
    ov.classList.add('show');
    setTimeout(() => {
      ov.classList.remove('show');
      window.location.href = 'https://wa.me/201211523707?text=' + encodeURIComponent(text);
    }, 5000);
  } else {
    let go = () => { document.getElementById('successIg').classList.add('open'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(go).catch(go);
    } else {
      let ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch(e) {}
      document.body.removeChild(ta); go();
    }
  }
}

function copyPhoneNum(btn) {
  let num = '01211523707';
  let go = () => {
    let t = document.getElementById('copyPayToast');
    document.getElementById('copyPayTitle').textContent = 'تم نسخ الرقم 📋';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(num).then(go).catch(go);
  } else {
    let ta = document.createElement('textarea'); ta.value = num; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta); go();
  }
}

// ======= WISHLIST =======
let wishlist = [];
function toggleWish(e, pid) {
  e.stopPropagation();
  let all = [...PRODUCTS.winter, ...PRODUCTS.summer];
  let p = all.find(x => x.id === pid); if (!p) return;
  let btn = e.currentTarget;
  let idx = wishlist.findIndex(x => x.id === pid);
  if (idx >= 0) {
    wishlist.splice(idx, 1);
    btn.classList.remove('saved');
    showToast('تم الحذف من المفضلة');
  } else {
    wishlist.push(p);
    btn.classList.add('saved');
    showToast('تمت الإضافة للمفضلة');
  }
  renderWishlist();
}
function renderWishlist() {
  let wrap = document.getElementById('wishItems');
  let badge = document.getElementById('wishCount');
  badge.textContent = wishlist.length;
  badge.classList.toggle('show', wishlist.length > 0);
  let mb = document.getElementById('wishCountMobile');
  if (mb) mb.textContent = wishlist.length;
  if (!wishlist.length) { wrap.innerHTML = '<p class="wish-empty-msg">المفضلة فارغة</p>'; return; }
  wrap.innerHTML = wishlist.map(p => `<div class="wish-item">
    <img src="${img(p.imgId,'w120')}" alt="${p.name}" onerror="this.style.display='none'">
    <div style="flex:1">
      <p class="wish-item-name">${p.name}</p>
      <p class="wish-item-price">${p.price} جنيه</p>
      <button class="wish-item-add" onclick="openDetail('${p.id}');closeWishlist()">عرض المنتج</button>
    </div>
    <button class="wish-rm" onclick="removeWish('${p.id}')">✕</button>
  </div>`).join('');
}
function removeWish(pid) {
  wishlist = wishlist.filter(x => x.id !== pid);
  renderWishlist();
  refreshHearts();
}
function refreshHearts() {
  document.querySelectorAll('.product-card').forEach(c => {
    let btn = c.querySelector('.wishlist-btn');
    let actionBtn = c.querySelector('.card-action');
    if (!btn || !actionBtn) return;
    let m = (actionBtn.getAttribute('onclick') || '').match(/openDetail\('([^']+)'\)/);
    if (!m) return;
    if (wishlist.find(x => x.id === m[1])) btn.classList.add('saved');
    else btn.classList.remove('saved');
  });
}
function openWishlist() {
  renderWishlist();
  document.getElementById('wishDrawer').classList.add('open');
  document.getElementById('backdrop').classList.add('open');
}
function closeWishlist() {
  document.getElementById('wishDrawer').classList.remove('open');
  document.getElementById('backdrop').classList.remove('open');
}

// ======= SEARCH =======
function handleSearch(val) {
  let clear = document.getElementById('searchClear');
  clear.classList.toggle('show', val.length > 0);
  if (val.trim().length === 0) { closeSearch(); return; }
  showDropdown();
  let all = [...PRODUCTS.winter, ...PRODUCTS.summer];
  let q = val.trim().toLowerCase();
  let results = all.filter(p => p.name.toLowerCase().includes(q) || p.badge.includes(q));
  let list = document.getElementById('searchResults');
  if (!results.length) {
    list.innerHTML = '<div class="search-no-results">لا توجد نتائج لـ "' + val + '"</div>';
  } else {
    list.innerHTML = results.map(p => `
      <div class="search-result-item" onclick="openDetail('${p.id}');closeSearch()">
        <img class="search-result-img" src="${img(p.imgId,'w120')}" alt="${p.name}" onerror="this.style.background='var(--sand2)'">
        <div>
          <p class="search-result-name">${p.name}</p>
          <p class="search-result-price">${p.price} جنيه</p>
          <p class="search-result-badge">${p.badge}</p>
        </div>
      </div>`).join('');
  }
}
function showDropdown() {
  let val = document.getElementById('searchInput').value.trim();
  if (!val) return;
  document.getElementById('searchDropdown').classList.add('show');
  document.getElementById('searchBackdrop').classList.add('show');
}
function closeSearch() {
  document.getElementById('searchDropdown').classList.remove('show');
  document.getElementById('searchBackdrop').classList.remove('show');
}
function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('searchClear').classList.remove('show');
  closeSearch();
}

// ======= PAGE NAVIGATION =======
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  window.scrollTo({top: 0, behavior: 'smooth'});
}
function goHome() { showPage('home'); }
function showAbout() { showPage('about'); }

// ======= DETAIL PAGE =======
let curP = null, selSize = '';
function openDetail(pid) {
  let all = [...PRODUCTS.winter, ...PRODUCTS.summer];
  let p = all.find(x => x.id === pid); if (!p) return;
  curP = p; selSize = '';
  document.getElementById('d-img').src = img(p.imgId, 'w800');
  document.getElementById('d-name').textContent = p.name;
  document.getElementById('d-price').textContent = p.price + ' جنيه';
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('size-req').classList.remove('show');
  showPage('detail');
}
function selectSize(btn, label) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected'); selSize = label;
  document.getElementById('size-req').classList.remove('show');
}
function handleAdd() {
  if (!selSize) { document.getElementById('sizeWarn').classList.add('open'); return; }
  addToCart(curP.name, curP.price, img(curP.imgId, 'w120'), selSize);
}

// ======= TABS =======
function switchTab(id, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
}
function switchTabByName(id) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(b => {
    if ((id === 'winter' && b.textContent.includes('الشتوي')) || (id === 'summer' && b.textContent.includes('الصيفي'))) b.classList.add('active');
  });
}

// ======= MOBILE MENU =======
function toggleMobileMenu(e) {
  if (e) e.stopPropagation();
  let m = document.getElementById('mobileMenu');
  let btn = document.getElementById('hamburgerBtn');
  let isOpen = m.classList.toggle('open');
  btn.innerHTML = isOpen ? '<i class="ti ti-x" aria-hidden="true"></i>' : '<i class="ti ti-menu-2" aria-hidden="true"></i>';
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburgerBtn').innerHTML = '<i class="ti ti-menu-2" aria-hidden="true"></i>';
}
document.addEventListener('click', function(e) {
  let menu = document.getElementById('mobileMenu');
  let btn = document.getElementById('hamburgerBtn');
  if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) closeMobileMenu();
});

// ======= SCROLL TO TOP =======
window.addEventListener('scroll', () => {
  document.getElementById('scrollTopBtn').classList.toggle('show', window.scrollY > 300);
});
