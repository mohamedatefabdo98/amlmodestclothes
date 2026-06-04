/* ========== CART ========== */
function loadCart() {
  try { return JSON.parse(localStorage.getItem('aml_cart') || '[]'); } catch(e) { return []; }
}
function saveCart(c) {
  localStorage.setItem('aml_cart', JSON.stringify(c));
}

let cart = loadCart();

function addToCart(name, price, imgSrc, size) {
  let key = name + '||' + size;
  let ex = cart.find(i => i.key === key);
  if (ex) ex.qty++; else cart.push({key, name, price, img: imgSrc, size, qty: 1});
  saveCart(cart);
  renderCart();
  showToast('تمت الإضافة ✓');
}
function removeItem(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart(cart);
  renderCart();
}
function changeQty(key, d) {
  let it = cart.find(i => i.key === key);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) removeItem(key); else { saveCart(cart); renderCart(); }
}

function renderCart() {
  let wrap = document.getElementById('cartItems');
  let foot = document.getElementById('cartFoot');
  let cnt  = document.getElementById('cartCount');
  let tot  = document.getElementById('cartTotal');
  if (!wrap) return;
  let total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  let count = cart.reduce((s,i) => s + i.qty, 0);
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

/* ========== WISHLIST ========== */
function loadWishlist() {
  try { return JSON.parse(localStorage.getItem('aml_wishlist') || '[]'); } catch(e) { return []; }
}
function saveWishlist(w) {
  localStorage.setItem('aml_wishlist', JSON.stringify(w));
}

let wishlist = loadWishlist();

function toggleWish(e, pid) {
  e.stopPropagation();
  let p = getProductById(pid);
  if (!p) return;
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
  saveWishlist(wishlist);
  renderWishlist();
}

function renderWishlist() {
  let wrap  = document.getElementById('wishItems');
  let badge = document.getElementById('wishCount');
  if (!wrap || !badge) return;
  badge.textContent = wishlist.length;
  badge.classList.toggle('show', wishlist.length > 0);
  let mb = document.getElementById('wishCountMobile');
  if (mb) mb.textContent = wishlist.length;
  if (!wishlist.length) { wrap.innerHTML = '<p class="wish-empty-msg">المفضلة فارغة</p>'; return; }
  wrap.innerHTML = wishlist.map(p => `
    <div class="wish-item">
      <img src="${imgUrl(p.imgId,'w120')}" alt="${p.name}" onerror="this.style.display='none'">
      <div style="flex:1">
        <p class="wish-item-name">${p.name}</p>
        <p class="wish-item-price">${p.price} جنيه</p>
        <button class="wish-item-add" onclick="location.href='detail.html?id=${p.id}'">عرض المنتج</button>
      </div>
      <button class="wish-rm" onclick="removeWish('${p.id}')">✕</button>
    </div>`).join('');
}

function removeWish(pid) {
  wishlist = wishlist.filter(x => x.id !== pid);
  saveWishlist(wishlist);
  renderWishlist();
  refreshHearts();
}

function refreshHearts() {
  document.querySelectorAll('.product-card').forEach(card => {
    let btn = card.querySelector('.wishlist-btn');
    let ac  = card.querySelector('.card-action');
    if (!btn || !ac) return;
    let m = (ac.getAttribute('href') || ac.getAttribute('onclick') || '').match(/id=([^'"&]+)/);
    if (!m) return;
    let pid = m[1];
    btn.classList.toggle('saved', !!wishlist.find(x => x.id === pid));
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

/* ========== CHECKOUT ========== */
function openCheckout() {
  if (!cart.length) return;
  goStep1();
  document.getElementById('checkoutModal').classList.add('open');
}
function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
}
function goStep1() {
  document.getElementById('step-ship').style.display = 'block';
  document.getElementById('step-platform').style.display = 'none';
}
function goStep2() {
  let valid = true;
  let fields = [
    {id:'sh-name',    err:'err-name',    ok: v => v.trim().split(/\s+/).length >= 3},
    {id:'sh-phone1',  err:'err-phone1',  ok: v => /^01[0-2,5]{1}[0-9]{8}$/.test(v.trim())},
    {id:'sh-gov',     err:'err-gov',     ok: v => v !== ''},
    {id:'sh-address', err:'err-address', ok: v => v.trim().length >= 5},
    {id:'sh-color',   err:'err-color',   ok: v => v.trim().length >= 2}
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
  let name  = document.getElementById('sh-name').value.trim();
  let p1    = document.getElementById('sh-phone1').value.trim();
  let p2    = document.getElementById('sh-phone2').value.trim();
  let gov   = document.getElementById('sh-gov').value;
  let addr  = document.getElementById('sh-address').value.trim();
  let color = document.getElementById('sh-color').value.trim();
  let lines = cart.map(i => '- ' + i.name + '\n  المقاس: ' + i.size + '\n  الكمية: ' + i.qty + ' x ' + i.price + ' = ' + i.price * i.qty + ' جنيه').join('\n\n');
  let total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  return 'أهلاً AML Modest Clothes\nأريد طلب:\n\n' + lines + '\n\nالإجمالي: ' + total + ' جنيه\n\n--- بيانات الشحن ---\nالاسم: ' + name + '\nموبايل 1: ' + p1 + (p2 ? '\nموبايل 2: ' + p2 : '') + '\nالمحافظة: ' + gov + '\nالعنوان: ' + addr + '\nاللون: ' + color;
}

function doCheckout(platform) {
  let text = buildMsg();
  closeCheckout(); closeCart();
  if (platform === 'whatsapp') {
    let ov   = document.getElementById('successWa');
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
      let ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch(e) {}
      document.body.removeChild(ta); go();
    }
  }
}

function copyPhoneNum() {
  let num = '01211523707';
  let go = () => {
    document.getElementById('copyPayTitle').textContent = 'تم نسخ الرقم 📋';
    let t = document.getElementById('copyPayToast');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(num).then(go).catch(go);
  } else {
    let ta = document.createElement('textarea');
    ta.value = num; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta); go();
  }
}

/* ========== TOAST ========== */
let toastT;
function showToast(msg) {
  let t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ========== SEARCH ========== */
function handleSearch(val) {
  document.getElementById('searchClear').classList.toggle('show', val.length > 0);
  if (val.trim().length === 0) { closeSearch(); return; }
  showSearchDropdown();
  let q = val.trim().toLowerCase();
  let results = getAllProducts().filter(p => p.name.toLowerCase().includes(q) || p.badge.includes(q));
  let list = document.getElementById('searchResults');
  if (!results.length) {
    list.innerHTML = '<div class="search-no-results">لا توجد نتائج لـ "' + val + '"</div>';
  } else {
    list.innerHTML = results.map(p => `
      <div class="search-result-item" onclick="location.href='detail.html?id=${p.id}';closeSearch()">
        <img class="search-result-img" src="${imgUrl(p.imgId,'w120')}" alt="${p.name}" onerror="this.style.background='var(--sand2)'">
        <div>
          <p class="search-result-name">${p.name}</p>
          <p class="search-result-price">${p.price} جنيه</p>
          <p class="search-result-badge">${p.badge}</p>
        </div>
      </div>`).join('');
  }
}
function showSearchDropdown() {
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

/* ========== MOBILE MENU ========== */
function toggleMobileMenu(e) {
  if (e) e.stopPropagation();
  let m   = document.getElementById('mobileMenu');
  let btn = document.getElementById('hamburgerBtn');
  let isOpen = m.classList.toggle('open');
  btn.innerHTML = isOpen
    ? '<i class="ti ti-x" aria-hidden="true"></i>'
    : '<i class="ti ti-menu-2" aria-hidden="true"></i>';
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburgerBtn').innerHTML = '<i class="ti ti-menu-2" aria-hidden="true"></i>';
}
document.addEventListener('click', function(e) {
  let menu = document.getElementById('mobileMenu');
  let btn  = document.getElementById('hamburgerBtn');
  if (menu && menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target))
    closeMobileMenu();
});

/* ========== SCROLL TO TOP ========== */
window.addEventListener('scroll', () => {
  let btn = document.getElementById('scrollTopBtn');
  if (btn) btn.classList.toggle('show', window.scrollY > 300);
});

/* ========== SHARED NAV HTML ========== */
function buildNav() {
  let currentPage = location.pathname.split('/').pop() || 'index.html';
  document.getElementById('navPlaceholder').innerHTML = `
  <nav id="navbar">
    <a class="nav-logo" href="index.html">
      <img src="https://drive.google.com/thumbnail?id=1NK3poi7l0jqFSfhk8sig490geYi3ak5J&sz=w60" alt="AML" style="height:36px;width:auto" onerror="this.style.display='none'">
      <span class="nav-logo-text">AML <span>Modest</span></span>
    </a>
    <div class="nav-search">
      <span class="nav-search-icon"><i class="ti ti-search" aria-hidden="true"></i></span>
      <input type="text" id="searchInput" placeholder="ابحثي عن منتج..." oninput="handleSearch(this.value)" onfocus="showSearchDropdown()" autocomplete="off">
      <button class="nav-search-clear" id="searchClear" onclick="clearSearch()">✕</button>
    </div>
    <div class="nav-links">
      <a class="nav-link" href="index.html">المتجر</a>
      <a class="nav-link" href="about.html">من نحن</a>
      <a class="nav-link" href="index.html#social">تواصلي معنا</a>
      <button class="nav-wish" onclick="openWishlist()">
        <i class="ti ti-heart" aria-hidden="true"></i> <span class="wish-label">المفضلة</span> <span class="wish-badge" id="wishCount">0</span>
      </button>
      <button class="nav-cart nav-link" onclick="openCart()">
        <i class="ti ti-shopping-bag" aria-hidden="true"></i> <span class="cart-label">السلة</span> <span class="cart-badge" id="cartCount">0</span>
      </button>
    </div>
    <button class="nav-hamburger" id="hamburgerBtn" onclick="toggleMobileMenu(event)" aria-label="القائمة">
      <i class="ti ti-menu-2" aria-hidden="true"></i>
    </button>
  </nav>
  <div class="mobile-menu" id="mobileMenu">
    <a class="mobile-menu-link" href="index.html" onclick="closeMobileMenu()">
      المتجر <i class="ti ti-home" aria-hidden="true"></i>
    </a>
    <a class="mobile-menu-link" href="about.html" onclick="closeMobileMenu()">
      من نحن <i class="ti ti-info-circle" aria-hidden="true"></i>
    </a>
    <a class="mobile-menu-link" href="index.html#social" onclick="closeMobileMenu()">
      تواصلي معنا <i class="ti ti-message-circle" aria-hidden="true"></i>
    </a>
    <div class="mobile-menu-divider"></div>
    <div style="padding:8px 16px 2px">
      <div style="display:flex;gap:10px">
        <button onclick="openWishlist();closeMobileMenu()" style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--sand);border:none;border-radius:14px;padding:12px;font-family:'Tajawal',sans-serif;font-size:.95rem;font-weight:600;color:var(--espresso);cursor:pointer;">
          <i class="ti ti-heart" style="color:var(--gold)" aria-hidden="true"></i> المفضلة
          <span style="background:var(--gold);color:white;width:20px;height:20px;border-radius:50%;font-size:.65rem;font-weight:700;display:flex;align-items:center;justify-content:center;" id="wishCountMobile">0</span>
        </button>
        <button onclick="openCart();closeMobileMenu()" style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--espresso);border:none;border-radius:14px;padding:12px;font-family:'Tajawal',sans-serif;font-size:.95rem;font-weight:600;color:white;cursor:pointer;">
          <i class="ti ti-shopping-bag" aria-hidden="true"></i> السلة
          <span style="background:var(--gold);color:white;width:20px;height:20px;border-radius:50%;font-size:.65rem;font-weight:700;display:flex;align-items:center;justify-content:center;" id="cartCountMobile">0</span>
        </button>
      </div>
    </div>
  </div>
  <div class="search-backdrop" id="searchBackdrop" onclick="closeSearch()"></div>
  <div class="search-dropdown" id="searchDropdown">
    <div class="search-results-list" id="searchResults"></div>
  </div>`;
}

/* ========== SHARED DRAWERS / MODALS HTML ========== */
function buildDrawers() {
  document.getElementById('drawersPlaceholder').innerHTML = `
  <!-- WISHLIST DRAWER -->
  <div class="wish-drawer" id="wishDrawer">
    <div class="wish-head">
      <span class="wish-head-title"><i class="ti ti-heart" aria-hidden="true"></i> المفضلة</span>
      <button class="close-x" onclick="closeWishlist()">✕</button>
    </div>
    <div class="wish-items-wrap" id="wishItems"></div>
  </div>
  <!-- CART DRAWER -->
  <div class="backdrop" id="backdrop" onclick="closeCart();closeWishlist()"></div>
  <div class="cart-drawer" id="cartDrawer">
    <div class="cart-head">
      <span class="cart-head-title"><i class="ti ti-shopping-bag" aria-hidden="true"></i> سلة المشتريات</span>
      <button class="close-x" onclick="closeCart()">✕</button>
    </div>
    <div class="cart-items-wrap" id="cartItems"></div>
    <div class="cart-foot" id="cartFoot" style="display:none">
      <div class="cart-total-row"><span>الإجمالي:</span><span id="cartTotal">0 جنيه</span></div>
      <button class="checkout-btn" onclick="openCheckout()">🛍️ إتمام الطلب</button>
    </div>
  </div>
  <!-- CHECKOUT MODAL -->
  <div class="modal-bg" id="checkoutModal">
    <div class="modal-box">
      <button class="modal-close-top" onclick="closeCheckout()" title="إغلاق">✕</button>
      <div id="step-ship">
        <p class="modal-title">بيانات الشحن</p>
        <p class="modal-sub">يرجى ملء البيانات لإتمام الطلب</p>
        <div class="field-group"><label class="field-label">الاسم ثلاثي <span class="req">*</span></label><input class="field-input" id="sh-name" type="text" placeholder="فاطمة محمد علي"><p class="field-err" id="err-name">يرجى كتابة الاسم ثلاثياً</p></div>
        <div class="field-group"><label class="field-label">موبايل 1 <span class="req">*</span></label><input class="field-input" id="sh-phone1" type="tel" placeholder="01xxxxxxxxx"><p class="field-err" id="err-phone1">أدخلي رقم موبايل صحيح</p></div>
        <div class="field-group"><label class="field-label">موبايل 2 <span class="opt">(اختياري)</span></label><input class="field-input" id="sh-phone2" type="tel" placeholder="01xxxxxxxxx"></div>
        <div class="field-group"><label class="field-label">المحافظة <span class="req">*</span></label>
          <select class="field-input" id="sh-gov">
            <option value="">اختاري المحافظة</option>
            <option>القاهرة</option><option>الجيزة</option><option>الاسكندرية</option>
            <option>الدقهلية</option><option>البحيرة</option><option>الفيوم</option>
            <option>الغربية</option><option>الاسماعيلية</option><option>المنوفية</option>
            <option>المنيا</option><option>القليوبية</option><option>الوادي الجديد</option>
            <option>السويس</option><option>اسوان</option><option>اسيوط</option>
            <option>بني سويف</option><option>بورسعيد</option><option>دمياط</option>
            <option>جنوب سيناء</option><option>شمال سيناء</option><option>الشرقية</option>
            <option>كفر الشيخ</option><option>مطروح</option><option>الاقصر</option>
            <option>قنا</option><option>سوهاج</option><option>البحر الاحمر</option>
          </select>
          <p class="field-err" id="err-gov">يرجى اختيار المحافظة</p>
        </div>
        <div class="field-group"><label class="field-label">العنوان <span class="req">*</span></label><textarea class="field-input field-textarea" id="sh-address" placeholder="الشارع، المنطقة، رقم المبنى..."></textarea><p class="field-err" id="err-address">يرجى كتابة العنوان</p></div>
        <div class="field-group"><label class="field-label">اللون المطلوب <span class="req">*</span></label><input class="field-input" id="sh-color" type="text" placeholder="اسود، بيج، كحلي..."><p class="field-err" id="err-color">يرجى كتابة اللون</p></div>
        <button class="next-btn" onclick="goStep2()">التالي ← اختاري طريقة الإرسال</button>
        <button class="cancel-btn" onclick="closeCheckout()">إلغاء</button>
        <div class="pay-info-box">
          <p class="pay-info-title">متاح الدفع عبر</p>
          <div class="pay-methods">
            <div class="pay-method-item">
              <img src="https://drive.google.com/thumbnail?id=1MZJ3dfE2Z4m4uGYLihmb1qbE0WgOtXPA&sz=w200" alt="انستا باي" onerror="this.style.display='none'">
              <span>انستا باي</span>
            </div>
            <div class="pay-method-item">
              <img src="https://drive.google.com/thumbnail?id=1pt9FyWnqEjXlwRPl7-HC_JtOJgyfKeeU&sz=w200" alt="اورانج كاش" onerror="this.style.display='none'">
              <span>اورانج كاش</span>
            </div>
          </div>
          <p class="pay-info-num">باستخدام رقم الهاتف الآتي<br>
            <span class="pay-num-row">
              <strong>01211523707</strong>
              <button class="copy-num-btn" onclick="copyPhoneNum()" title="نسخ الرقم">
                <i class="ti ti-copy" aria-hidden="true"></i>
              </button>
            </span>
          </p>
        </div>
      </div>
      <div id="step-platform" style="display:none">
        <button class="back-btn" onclick="goStep1()">← رجوع</button>
        <p class="modal-title">اختاري طريقة الطلب</p>
        <button class="platform-btn wa" onclick="doCheckout('whatsapp')">
          <img src="https://drive.google.com/thumbnail?id=1J-M5eYusdkO13sSjNn3l_cNwfzSMLOUF&sz=w60" alt="">
          <div><div class="platform-btn-label">الطلب عبر واتساب</div><div class="platform-btn-desc">سيتم تحويلك للواتساب بتفاصيل طلبك</div></div>
        </button>
        <button class="platform-btn ig" onclick="doCheckout('instagram')">
          <img src="https://drive.google.com/thumbnail?id=1TDVY3iGAIlqFErhMLyP5zKw4k94P54gx&sz=w60" alt="">
          <div><div class="platform-btn-label">الطلب عبر انستجرام</div><div class="platform-btn-desc">سيتم نسخ طلبك تلقائياً لإرساله عبر DM</div></div>
        </button>
        <button class="cancel-btn" onclick="closeCheckout()">إلغاء</button>
      </div>
    </div>
  </div>
  <!-- SIZE WARN MODAL -->
  <div class="modal-bg" id="sizeWarn" onclick="this.classList.remove('open')">
    <div class="modal-box size-warn-box" onclick="event.stopPropagation()">
      <div style="font-size:2.5rem;margin-bottom:12px">⚠️</div>
      <p style="font-family:'El Messiri',sans-serif;font-size:1.2rem;color:var(--espresso);margin-bottom:8px">يرجى اختيار المقاس أولاً</p>
      <p style="color:var(--muted);font-size:.87rem;margin-bottom:20px">اختاري مقاسك من الخيارات المتاحة</p>
      <button onclick="document.getElementById('sizeWarn').classList.remove('open')" style="padding:10px 28px;background:var(--espresso);color:white;border:none;border-radius:12px;font-family:'Tajawal',sans-serif;font-size:.95rem;font-weight:700;cursor:pointer">حسناً</button>
    </div>
  </div>
  <!-- WA SUCCESS -->
  <div class="success-screen" id="successWa">
    <div class="success-card">
      <h2>سيتم تحويلك للواتساب لتأكيد طلبك! شكراً لاختياركِ أمل</h2>
      <div class="success-prog"><div class="success-fill"></div></div>
    </div>
  </div>
  <!-- IG SUCCESS -->
  <div class="modal-bg" id="successIg" style="z-index:1500">
    <div class="modal-box ig-confirm">
      <div style="font-size:2rem;margin-bottom:10px">📋</div>
      <p style="font-family:'El Messiri',sans-serif;font-size:1.15rem;color:var(--espresso);margin-bottom:6px">تم نسخ طلبك تلقائياً!</p>
      <p style="color:var(--muted);font-size:.87rem;line-height:1.6;margin-bottom:20px">ابعتيلنا الطلب عبر رسائل الانستجرام وسنتواصل معكِ فوراً</p>
      <a class="ig-go-btn" href="https://www.instagram.com/byaml_eg" target="_blank" onclick="document.getElementById('successIg').classList.remove('open')">
        <img src="https://drive.google.com/thumbnail?id=1TDVY3iGAIlqFErhMLyP5zKw4k94P54gx&sz=w60" alt="">
        افتحي الرسائل وابعتيلنا الطلب
      </a>
      <button onclick="document.getElementById('successIg').classList.remove('open')" style="background:none;border:none;color:var(--muted);font-family:'Tajawal',sans-serif;font-size:.88rem;cursor:pointer;padding:6px">إغلاق</button>
    </div>
  </div>
  <!-- COPY PAY TOAST -->
  <div class="copy-pay-toast" id="copyPayToast">
    <div class="copy-pay-icon">✅</div>
    <div>
      <div class="copy-pay-title" id="copyPayTitle">تم نسخ الرقم للتحويل عبر انستاباي</div>
      <div class="copy-pay-sub">بعد إرسال الرسالة لنا برجاء إرسال سكرين شوت بالتحويل</div>
    </div>
  </div>
  <div class="toast" id="toast"></div>
  <button class="scroll-top" id="scrollTopBtn" onclick="window.scrollTo({top:0,behavior:'smooth'})" title="العودة للأعلى"><i class="ti ti-arrow-up" aria-hidden="true"></i></button>`;
}

/* ========== INIT ========== */
function initPage() {
  buildNav();
  buildDrawers();
  renderCart();
  renderWishlist();
}
