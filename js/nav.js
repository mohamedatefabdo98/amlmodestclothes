// This file injects the shared nav, drawers, modals, and overlays into every page.
// Called once after DOM is ready.

function injectSharedUI() {
  document.body.insertAdjacentHTML('afterbegin', `
<!-- NAV -->
<nav id="navbar">
  <a class="nav-logo" onclick="goHome()" style="cursor:pointer">
    <img src="https://drive.google.com/thumbnail?id=1NK3poi7l0jqFSfhk8sig490geYi3ak5J&sz=w60" alt="AML" style="height:36px;width:auto" onerror="this.style.display='none'">
    <span class="nav-logo-text">AML <span>Modest</span></span>
  </a>
  <div class="nav-search">
    <span class="nav-search-icon"><i class="ti ti-search" aria-hidden="true"></i></span>
    <input type="text" id="searchInput" placeholder="ابحثي عن منتج..." oninput="handleSearch(this.value)" onfocus="showDropdown()" autocomplete="off">
    <button class="nav-search-clear" id="searchClear" onclick="clearSearch()">✕</button>
  </div>
  <div class="nav-links">
    <button class="nav-link" onclick="goHome()">المتجر</button>
    <button class="nav-link" onclick="showAbout()">من نحن</button>
    <button class="nav-link" onclick="goHome();setTimeout(()=>document.getElementById('social').scrollIntoView({behavior:'smooth'}),120)">تواصلي معنا</button>
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

<!-- MOBILE MENU -->
<div class="mobile-menu" id="mobileMenu">
  <button class="mobile-menu-link" onclick="goHome();closeMobileMenu()">المتجر <i class="ti ti-home" aria-hidden="true"></i></button>
  <button class="mobile-menu-link" onclick="showAbout();closeMobileMenu()">من نحن <i class="ti ti-info-circle" aria-hidden="true"></i></button>
  <button class="mobile-menu-link" onclick="goHome();closeMobileMenu();setTimeout(()=>document.getElementById('social').scrollIntoView({behavior:'smooth'}),120)">تواصلي معنا <i class="ti ti-message-circle" aria-hidden="true"></i></button>
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

<!-- SEARCH DROPDOWN -->
<div class="search-backdrop" id="searchBackdrop" onclick="closeSearch()"></div>
<div class="search-dropdown" id="searchDropdown">
  <div class="search-results-list" id="searchResults"></div>
</div>

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
            <button class="copy-num-btn" onclick="copyPhoneNum(this)" title="نسخ الرقم"><i class="ti ti-copy" aria-hidden="true"></i></button>
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
<div class="modal-bg" id="sizeWarn" onclick="document.getElementById('sizeWarn').classList.remove('open')">
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
<button class="scroll-top" id="scrollTopBtn" onclick="window.scrollTo({top:0,behavior:'smooth'})" title="العودة للأعلى"><i class="ti ti-arrow-up" aria-hidden="true"></i></button>
`);
}
