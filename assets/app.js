(function () {
'use strict';

var BRANCH = 'main', CATALOG_PATH = 'data/catalog.json', MAX_IMG = 6;
var SIZE_PRESETS = {
  clothes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', 'فري سايز'],
  kids: ['1-2 سنة', '2-3 سنة', '3-4 سنة', '4-5 سنة', '5-6 سنة', '6-7 سنة', '7-8 سنة', '9-10 سنة', '11-12 سنة', '13-14 سنة'],
  shoes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
  none: ['مقاس واحد']
};
var KIND_LABELS = { clothes: 'ملابس', kids: 'أطفال', shoes: 'أحذية', none: 'بدون مقاس' };
var COLOR_PRESETS = [
  ['أسود', '#111111'], ['أبيض', '#F7F7F4'], ['أوف وايت', '#EFE9DC'], ['رمادي', '#9AA1AC'], ['فحمي', '#3B3F46'],
  ['كحلي', '#1E2A4A'], ['أزرق', '#2563EB'], ['سماوي', '#8CCBEF'], ['أخضر', '#15803D'], ['زيتوني', '#6B7A3A'],
  ['بيج', '#D8C6A8'], ['جملي', '#B98A5A'], ['بني', '#6F4527'], ['خمري', '#7C1F2E'], ['أحمر', '#D92D20'],
  ['وردي', '#F4A7C4'], ['بنفسجي', '#7C3AED'], ['ليلكي', '#C4B0E6'], ['أصفر', '#F5C518'], ['برتقالي', '#F07A1A'],
  ['ذهبي', '#C9A24A'], ['فضي', '#C3C7CC'], ['متعدد الألوان', 'multi']
];
var STATUS = { in: 'متوفر', order: 'حسب الطلب', out: 'نفد' };
var GOVS = ['بغداد', 'البصرة', 'نينوى', 'أربيل', 'السليمانية', 'دهوك', 'حلبجة', 'كركوك', 'الأنبار', 'ديالى', 'صلاح الدين', 'بابل', 'كربلاء', 'النجف', 'واسط', 'القادسية', 'ميسان', 'ذي قار', 'المثنى'];
var DEFAULT_SETTINGS = {
  whatsapp: '9647807790009', whatsappDisplay: '+964 780 779 0009', instagram: 'co.alaseel', currency: 'د.ع', logo: '', repo: '',
  orderNote: 'هذا المنتج يُستورد من الصين حسب الطلب. راسلنا على واتساب لمعرفة مدة الوصول.',
  cartNote: 'بعد استلام رسالتك على واتساب نتواصل معك لتأكيد الطلب والتوصيل.'
};
var DEFAULT_SECTIONS = [
  { id: 'men', name: 'رجالي', kind: 'clothes' }, { id: 'women', name: 'نسائي', kind: 'clothes' }, { id: 'kids', name: 'أطفال', kind: 'kids' },
  { id: 'shoes', name: 'أحذية', kind: 'shoes' }, { id: 'bags', name: 'حقائب', kind: 'none' }, { id: 'scarves', name: 'شالات', kind: 'none' },
  { id: 'accessories', name: 'إكسسوارات', kind: 'none' }
];

var P = {
  bag: '<path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  chat: '<path d="M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.1A8 8 0 1 1 20 11.5Z"/><path d="M9 10.5h6M9 13.5h4"/>',
  cam: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-9Z"/><circle cx="12" cy="13" r="3.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  hanger: '<path d="M12 8.2V7.6c0-1.2 2-1.6 2-2.9a2 2 0 1 0-4 0"/><path d="M12 8.2 3.7 13.8c-.9.6-.5 2.2.6 2.2h15.4c1.1 0 1.5-1.6.6-2.2L12 8.2Z"/>',
  img: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m20.5 16-5-5-8.5 8.5"/>',
  star: '<path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6L12 4Z"/>',
  up: '<path d="m6 14 6-6 6 6"/>',
  down: '<path d="m6 10 6 6 6-6"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l2 2"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>'
};
function ic(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + '</svg>'; }

/* ---------- helpers ---------- */
function $(s, r) { return (r || document).querySelector(s); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function arDigits(s) { return String(s || '').replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; }).replace(/[۰-۹]/g, function (d) { return d.charCodeAt(0) - 1776; }); }
function toNum(v) {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  var n = parseFloat(arDigits(v).replace(/[^\d.]/g, ''));
  return isFinite(n) ? Math.round(n * 100) / 100 : 0;
}
function fmt(n) { return (Number(n) || 0).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' ' + S.settings.currency; }
function hexOk(h) { return h === 'multi' || /^#[0-9a-fA-F]{3,8}$/.test(h || ''); }
function swatchAttr(hex) { return hex === 'multi' ? ' class="multi"' : ' style="--c:' + (hexOk(hex) ? hex : '#999999') + '"'; }
function igName() { var u = String(S.settings.instagram || '').replace(/^@/, '').trim(); return /^[A-Za-z0-9._]{1,30}$/.test(u) ? u : ''; }
function waDigits() { return String(S.settings.whatsapp || '').replace(/\D/g, '').replace(/^00/, ''); }
function waLink(text) { return 'https://wa.me/' + waDigits() + (text ? '?text=' + encodeURIComponent(text) : ''); }
function uid() { return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4); }
function srcOk(s) { return typeof s === 'string' && (/^data:image\/[a-z+.-]+;base64,[A-Za-z0-9+/=]+$/.test(s) || /^img\/[A-Za-z0-9._\/-]+$/.test(s)); }
function normImg(x) {
  if (typeof x === 'string') return srcOk(x) ? { f: x, t: x } : null;
  if (x && srcOk(x.f)) return { f: x.f, t: srcOk(x.t) ? x.t : x.f };
  return null;
}
var LOCAL = {};   /* just-published photos, shown from memory until the site finishes deploying them */
function full(im) { return im ? (LOCAL[im.f] || im.f) : ''; }
function thumb(im) { if (!im) return ''; var t = im.t || im.f; return LOCAL[t] || t; }

function normalize(d) {
  d = d && typeof d === 'object' ? d : {};
  var out = {
    rev: parseInt(d.rev, 10) || 1,
    seq: parseInt(d.seq, 10) || 1000,
    updatedAt: d.updatedAt || '',
    settings: Object.assign({}, DEFAULT_SETTINGS, d.settings || {}),
    sections: Array.isArray(d.sections) && d.sections.length ? d.sections.map(function (s) {
      return { id: String(s.id), name: String(s.name || ''), kind: SIZE_PRESETS[s.kind] ? s.kind : 'clothes' };
    }) : clone(DEFAULT_SECTIONS),
    products: []
  };
  if (!srcOk(out.settings.logo)) out.settings.logo = '';
  (Array.isArray(d.products) ? d.products : []).forEach(function (p) {
    if (!p || !p.id) return;
    out.products.push({
      id: String(p.id), code: String(p.code || ''), name: String(p.name || ''), section: String(p.section || ''),
      price: toNum(p.price), oldPrice: toNum(p.oldPrice), status: STATUS[p.status] ? p.status : 'in', desc: String(p.desc || ''),
      images: (Array.isArray(p.images) ? p.images : []).map(normImg).filter(Boolean),
      sizes: (Array.isArray(p.sizes) ? p.sizes : []).map(function (s) { return typeof s === 'string' ? { label: s, price: 0 } : { label: String(s.label), price: toNum(s.price) }; }),
      perSize: !!p.perSize,
      colors: (Array.isArray(p.colors) ? p.colors : []).map(function (c) { return { name: String(c.name || ''), hex: hexOk(c.hex) ? c.hex : '#999999', img: Number.isInteger(c.img) ? c.img : -1 }; }),
      sample: !!p.sample, createdAt: p.createdAt || 0
    });
  });
  return out;
}

/* ---------- state ---------- */
var PUB = normalize(null), S = clone(PUB), LOADED = false;
var GH = lsGet('alaseel-gh', null);   /* {token, repo} saved only on the owner's own devices */
var IS_ADMIN = false, ADMIN_ON = lsGet('alaseel-admin-on', true) !== false, CAT_SHA = '';
var PENDING = 0, STALE = null, PUBLISHING = false, ARMED = {};
var view = { sec: 'all', q: '' };
var cart = lsGet('alaseel-cart', []); if (!Array.isArray(cart)) cart = [];
var cust = lsGet('alaseel-cust', {}) || {};
var PV = null, ED = null, ST = null, SENT = false, LOGIN = null;
var stack = [];

function findP(id) { for (var i = 0; i < S.products.length; i++) if (S.products[i].id === id) return S.products[i]; return null; }
function secName(id) { var s = S.sections.find(function (x) { return x.id === id; }); return s ? s.name : ''; }
function kindFor(secId) { var s = S.sections.find(function (x) { return x.id === secId; }); return s ? s.kind : 'clothes'; }
function unitPrice(p, size) {
  if (p.perSize && size) { var s = p.sizes.find(function (x) { return x.label === size; }); if (s && s.price > 0) return s.price; }
  return p.price;
}
function priceRange(p) {
  if (!p.perSize || !p.sizes.length) return [p.price, p.price];
  var arr = p.sizes.map(function (s) { return s.price > 0 ? s.price : p.price; });
  return [Math.min.apply(null, arr), Math.max.apply(null, arr)];
}
function showAdmin() { return IS_ADMIN && ADMIN_ON; }

/* ---------- logo ---------- */
function logo(size) {
  if (S.settings.logo) return '<img class="logo-img" src="' + esc(LOCAL[S.settings.logo] || S.settings.logo) + '" width="' + size + '" height="' + size + '" alt="ALASEEL">';
  return '<svg class="logo" viewBox="0 0 100 100" width="' + size + '" height="' + size + '" role="img" aria-label="ALASEEL"><circle cx="50" cy="50" r="50" fill="#0E1A38"/><circle cx="50" cy="50" r="45" fill="none" stroke="#FFFFFF" stroke-opacity=".28" stroke-width="1.2"/><text x="50" y="55.5" text-anchor="middle" font-family="Georgia,\'Times New Roman\',serif" font-size="15.5" font-weight="700" letter-spacing=".6" fill="#FFFFFF">ALASEEL</text></svg>';
}

/* ---------- shell renders ---------- */
function renderHeader() {
  var n = cartCount();
  $('#hdr').innerHTML =
    '<div class="wrap top-in">' +
      '<button type="button" class="brand" data-act="home" aria-label="عين الأصيل — الصفحة الرئيسية">' + logo(42) +
        '<span class="brand-t"><b>عين الأصيل</b><small>ALASEEL TRADING CO</small></span></button>' +
      '<div class="top-actions">' +
        (IS_ADMIN ? '<button type="button" class="pill' + (ADMIN_ON ? ' on' : '') + '" data-act="admin-toggle" aria-pressed="' + ADMIN_ON + '">' + (ADMIN_ON ? 'وضع الإدارة' : 'عرض الزبون') + '</button>' : '') +
        '<button type="button" class="cart-btn" data-act="cart">' + ic('bag') + '<span class="lbl">السلة</span><span class="badge" id="cart-badge"' + (n ? '' : ' hidden') + '>' + n + '</span></button>' +
      '</div>' +
    '</div>' +
    '<nav class="wrap rail" id="rail" aria-label="الأقسام"></nav>';
  renderRail();
}
function renderRail() {
  var counts = {};
  S.products.forEach(function (p) { counts[p.section] = (counts[p.section] || 0) + 1; });
  var items = [{ id: 'all', name: 'الكل', n: S.products.length }].concat(S.sections.map(function (s) { return { id: s.id, name: s.name, n: counts[s.id] || 0 }; }));
  if (view.sec !== 'all' && !S.sections.some(function (s) { return s.id === view.sec; })) view.sec = 'all';
  $('#rail').innerHTML = items.map(function (it) {
    var on = view.sec === it.id;
    return '<button type="button" data-act="sec" data-id="' + esc(it.id) + '" class="' + (on ? 'on' : '') + '" aria-pressed="' + on + '">' + esc(it.name) + (LOADED ? '<small>' + it.n + '</small>' : '') + '</button>';
  }).join('');
}
function renderHero() {
  var ig = igName();
  $('#hero').innerHTML =
    '<div class="wrap hero-in">' +
      '<div>' +
        '<p class="eyebrow">شركة عين الأصيل · <span class="ltr">ALASEEL TRADING CO</span></p>' +
        '<h1>عين الأصيل</h1>' +
        '<p class="lead">استيراد وتجهيز دولي من الصين إلى العراق. ملابس رجالية ونسائية وأطفال، أحذية، حقائب، شالات وإكسسوارات.</p>' +
        '<div class="route" aria-label="من قوانغتشو إلى بغداد والأنبار">' +
          '<svg viewBox="0 0 400 58" aria-hidden="true"><path d="M376 44 C 290 2, 110 2, 24 44" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="1.5" stroke-dasharray="3 7" stroke-linecap="round"/>' +
          '<circle class="rt-ring" cx="376" cy="44" r="11"/><circle class="rt-a" cx="376" cy="44" r="5.5"/><circle cx="24" cy="44" r="5.5" fill="currentColor"/>' +
          '<circle class="rt-dot rt-a" r="3.5"><animateMotion dur="6s" repeatCount="indefinite" path="M376 44 C 290 2, 110 2, 24 44"/></circle></svg>' +
          '<div class="route-l"><div><b>قوانغتشو</b>الصين</div><div><b>بغداد · الأنبار</b>العراق</div></div>' +
        '</div>' +
        '<div class="hero-cta">' +
          '<a class="btn btn-wa" href="' + esc(waLink('')) + '" target="_blank" rel="noopener">' + ic('chat') + 'واتساب الطلبات</a>' +
          (ig ? '<a class="btn btn-hero" href="https://instagram.com/' + esc(ig) + '" target="_blank" rel="noopener">' + ic('cam') + '<span class="ltr">@' + esc(ig) + '</span></a>' : '') +
        '</div>' +
      '</div>' +
      '<ol class="steps" aria-label="طريقة الطلب">' +
        '<li><b>اختر المنتج</b><span>حدّد المقاس واللون والكمية.</span></li>' +
        '<li><b>أضفه إلى السلة</b><span>يمكنك جمع أكثر من منتج في طلب واحد.</span></li>' +
        '<li><b>أرسل الطلب عبر واتساب</b><span>تصلنا رسالة جاهزة بكل التفاصيل.</span></li>' +
      '</ol>' +
    '</div>';
}
function renderCatalogShell() {
  $('#catalog').innerHTML =
    '<div class="cat-head">' +
      '<div class="cat-title"><h2 id="cat-title">كل المنتجات</h2><span id="cat-count"></span></div>' +
      '<div class="cat-tools">' +
        '<label class="search">' + ic('search') + '<span class="vh">بحث</span><input id="q" type="search" placeholder="ابحث باسم المنتج أو الرمز" data-in="q" autocomplete="off"></label>' +
        '<button type="button" class="linkish" data-act="guide">جدول المقاسات</button>' +
      '</div>' +
    '</div>' +
    '<div class="grid" id="grid"></div>';
}
function visible() {
  var q = view.q.trim().toLowerCase();
  return S.products.filter(function (p) {
    if (view.sec !== 'all' && p.section !== view.sec) return false;
    if (!q) return true;
    return (p.name + ' ' + p.code + ' ' + p.desc + ' ' + secName(p.section)).toLowerCase().indexOf(q) !== -1;
  });
}
function card(p) {
  var r = priceRange(p), off = p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  var img = thumb(p.images[0]);
  var tags = (p.sample ? '<span class="tag tag-sample">مثال</span>' : '') +
    (p.status === 'order' ? '<span class="tag tag-order">حسب الطلب</span>' : '') +
    (p.status === 'out' ? '<span class="tag tag-out">نفد</span>' : '') +
    (off && p.status !== 'out' ? '<span class="tag tag-off">−' + off + '%</span>' : '');
  var dots = p.colors.slice(0, 5).map(function (c) { return '<i' + swatchAttr(c.hex) + ' title="' + esc(c.name) + '"></i>'; }).join('') + (p.colors.length > 5 ? '<em>+' + (p.colors.length - 5) + '</em>' : '');
  return '<article class="card' + (p.status === 'out' ? ' is-out' : '') + '">' +
    '<button type="button" class="card-hit" data-act="open" data-id="' + esc(p.id) + '">' +
      '<span class="card-img">' + (img ? '<img src="' + esc(img) + '" alt="" loading="lazy" decoding="async">' : '<span class="noimg">' + ic('hanger') + '</span>') +
        (tags ? '<span class="tags">' + tags + '</span>' : '') + '</span>' +
      '<span class="card-body">' +
        '<span class="card-name">' + esc(p.name) + '</span>' +
        '<span class="card-price"><b>' + (r[0] !== r[1] ? 'من ' : '') + fmt(r[0]) + '</b>' + (off ? '<s>' + fmt(p.oldPrice) + '</s>' : '') + '</span>' +
        '<span class="card-meta"><span class="dots">' + dots + '</span><span class="code">' + esc(p.code) + '</span></span>' +
      '</span>' +
    '</button>' +
    (showAdmin() ? '<button type="button" class="card-edit" data-act="edit" data-id="' + esc(p.id) + '">' + ic('edit') + 'تعديل</button>' : '') +
  '</article>';
}
function renderGrid() {
  if (!LOADED) {
    $('#cat-count').textContent = '';
    $('#grid').innerHTML = LOAD_ERR ?
      '<div class="empty"><p>تعذّر تحميل المنتجات. تأكد من اتصال الإنترنت ثم أعد المحاولة.</p><button type="button" class="btn btn-ghost sm" data-act="reload">' + ic('refresh') + 'إعادة المحاولة</button></div>' :
      new Array(8).join('<div class="card sk"><span class="card-hit"><span class="card-img"></span><span class="card-body"><span class="sk-line"></span><span class="sk-line short"></span></span></span></div>');
    return;
  }
  var list = visible();
  var name = view.sec === 'all' ? 'كل المنتجات' : secName(view.sec);
  $('#cat-title').textContent = view.q.trim() ? 'نتائج البحث' : name;
  $('#cat-count').textContent = list.length === 1 ? 'منتج واحد' : (list.length === 2 ? 'منتجان' : list.length + (list.length >= 3 && list.length <= 10 ? ' منتجات' : ' منتج'));
  var empty;
  if (view.q.trim()) empty = '<div class="empty"><p>لا توجد نتائج تطابق «' + esc(view.q.trim()) + '».</p><button type="button" class="btn btn-ghost sm" data-act="clear-q">مسح البحث</button></div>';
  else if (showAdmin()) empty = '<div class="empty"><p>لا توجد منتجات في «' + esc(name) + '» بعد. أضف أول منتج بالصور والمقاسات والألوان والسعر.</p><button type="button" class="btn btn-primary sm" data-act="new">' + ic('plus') + 'إضافة منتج</button></div>';
  else empty = '<div class="empty"><p>تتم إضافة موديلات جديدة إلى هذا القسم قريباً. اسألنا عن المتوفر الآن.</p><a class="btn btn-wa sm" href="' + esc(waLink('السلام عليكم، أود السؤال عن الموديلات المتوفرة في قسم ' + name)) + '" target="_blank" rel="noopener">' + ic('chat') + 'اسألنا على واتساب</a></div>';
  $('#grid').innerHTML = list.length ? list.map(card).join('') : empty;
}
function renderFoot() {
  var ig = igName();
  $('#foot').innerHTML =
    '<div class="wrap">' +
      '<div class="foot-in">' +
        '<div class="foot-brand">' + logo(54) + '<div><b class="foot-name">شركة عين الأصيل</b><p class="muted"><span class="ltr">ALASEEL Trading Co</span> — استيراد وتجهيز دولي من الصين إلى العراق.</p></div></div>' +
        '<div><h3>مكاتبنا</h3><ul class="offices"><li><b>بغداد</b><span>العراق</span></li><li><b>الأنبار</b><span>العراق</span></li><li><b>قوانغتشو</b><span>الصين</span></li></ul></div>' +
        '<div class="contact"><h3>الطلبات والتواصل</h3>' +
          '<p>واتساب: <span class="ltr" style="font-weight:700">' + esc(S.settings.whatsappDisplay) + '</span></p>' +
          '<p><a href="' + esc(waLink('')) + '" target="_blank" rel="noopener">مراسلتنا على واتساب</a></p>' +
          (ig ? '<p><a href="https://instagram.com/' + esc(ig) + '" target="_blank" rel="noopener">إنستغرام <span class="ltr">@' + esc(ig) + '</span></a></p>' : '') +
        '</div>' +
      '</div>' +
      '<div class="foot-bottom"><span>© ' + new Date().getFullYear() + ' شركة عين الأصيل</span><span>الأسعار بـ' + esc(S.settings.currency) + '</span>' +
        (IS_ADMIN ? '' : '<button type="button" class="linkish subtle" data-act="login">إدارة الموقع</button>') + '</div>' +
    '</div>';
}
function renderAll() { renderHeader(); renderHero(); renderGrid(); renderFoot(); renderAdminBar(); }

/* ---------- layers ---------- */
function pushLayer(cls, onclose, kind) {
  var el = document.createElement('div');
  el.className = 'layer';
  el.innerHTML = '<div class="sheet ' + (cls || '') + '" role="dialog" aria-modal="true" data-kind="' + (kind || '') + '"></div>';
  el.addEventListener('mousedown', function (e) { if (e.target === el && !el._sticky) closeLayer(); });
  $('#layers').appendChild(el);
  stack.push({ el: el, onclose: onclose });
  document.body.style.overflow = 'hidden';
  return el.firstChild;
}
function topSheet(kind) { var sh = stack.length ? stack[stack.length - 1].el.firstChild : null; return sh && (!kind || sh.dataset.kind === kind) ? sh : null; }
function closeLayer() {
  var it = stack.pop(); if (!it) return;
  it.el.remove();
  if (it.onclose) it.onclose();
  if (!stack.length) document.body.style.overflow = '';
}
function focusSheet(sheet) { var b = sheet.querySelector('[data-autofocus]') || sheet.querySelector('.sheet-head button'); if (b) try { b.focus({ preventScroll: true }); } catch (e) {} }

/* ---------- product view ---------- */
function openProduct(id) {
  var p = findP(id); if (!p) return;
  PV = { id: id, img: 0, size: p.sizes.length === 1 ? p.sizes[0].label : '', color: p.colors.length === 1 ? p.colors[0].name : '', qty: 1, err: '' };
  if (PV.color) { var c = p.colors[0]; if (c.img >= 0 && c.img < p.images.length) PV.img = c.img; }
  var sh = pushLayer('', function () { PV = null; }, 'product');
  renderProduct();
  focusSheet(sh);
}
function pvText() {
  var p = findP(PV.id);
  return orderText([{ id: p.id, size: PV.size, color: PV.color, qty: PV.qty }], null);
}
function renderProduct() {
  if (!PV) return;
  var p = findP(PV.id), sh = topSheet('product'); if (!p || !sh) return;
  var unit = unitPrice(p, PV.size), r = priceRange(p);
  var priceLabel = (!PV.size && r[0] !== r[1]) ? 'من ' + fmt(r[0]) : fmt(unit);
  var off = p.oldPrice > unit;
  var gal = p.images.length ? '<img src="' + esc(full(p.images[Math.min(PV.img, p.images.length - 1)])) + '" alt="' + esc(p.name) + '">' : '<span class="noimg">' + ic('hanger') + '</span>';
  var thumbs = p.images.length > 1 ? '<div class="pd-thumbs">' + p.images.map(function (im, i) {
    return '<button type="button" class="' + (i === PV.img ? 'on' : '') + '" data-act="thumb" data-i="' + i + '" aria-label="صورة ' + (i + 1) + '"><img src="' + esc(thumb(im)) + '" alt=""></button>';
  }).join('') + '</div>' : '';
  var out = p.status === 'out';
  sh.innerHTML =
    '<div class="sheet-head"><div class="crumb"><span class="code">' + esc(p.code) + '</span>' + (secName(p.section) ? '<span>' + esc(secName(p.section)) + '</span>' : '') + '</div>' +
      '<button type="button" class="icon-btn" data-act="close" aria-label="إغلاق">' + ic('x') + '</button></div>' +
    '<div class="pd">' +
      '<div class="pd-gal"><div class="pd-main">' + gal + '</div>' + thumbs + '</div>' +
      '<div class="pd-info">' +
        '<div class="pd-top">' + (p.sample ? '<span class="tag tag-sample">مثال</span>' : '') +
          '<span class="tag ' + (p.status === 'in' ? 'tag-in' : p.status === 'order' ? 'tag-order' : 'tag-out') + '">' + STATUS[p.status] + '</span></div>' +
        '<h2 class="pd-name">' + esc(p.name) + '</h2>' +
        '<div class="pd-price"><b>' + priceLabel + '</b>' + (off ? '<s>' + fmt(p.oldPrice) + '</s>' : '') + '</div>' +
        (p.desc ? '<p class="pd-desc">' + esc(p.desc) + '</p>' : '') +
        (p.sizes.length ? '<div class="opt' + (PV.err === 'size' ? ' opt-err' : '') + '"><div class="opt-h"><span>المقاس' + (PV.size ? ': <b>' + esc(PV.size) + '</b>' : '') + '</span>' +
          '<button type="button" class="linkish" data-act="guide">جدول المقاسات</button></div><div class="chips" role="group" aria-label="المقاس">' +
          p.sizes.map(function (s) {
            var on = PV.size === s.label, sp = p.perSize && s.price > 0 && s.price !== p.price;
            return '<button type="button" class="chip-opt' + (on ? ' on' : '') + '" data-act="size" data-v="' + esc(s.label) + '" aria-pressed="' + on + '">' + esc(s.label) + (sp ? '<small>' + (s.price).toLocaleString('en-US') + '</small>' : '') + '</button>';
          }).join('') + '</div>' + (PV.err === 'size' ? '<p class="err">اختر المقاس أولاً</p>' : '') + '</div>' : '') +
        (p.colors.length ? '<div class="opt' + (PV.err === 'color' ? ' opt-err' : '') + '"><div class="opt-h"><span>اللون' + (PV.color ? ': <b>' + esc(PV.color) + '</b>' : '') + '</span></div><div class="chips" role="group" aria-label="اللون">' +
          p.colors.map(function (c) {
            var on = PV.color === c.name;
            return '<button type="button" class="sw' + (on ? ' on' : '') + (c.hex === 'multi' ? ' multi' : '') + '"' + (c.hex === 'multi' ? '' : ' style="--c:' + (hexOk(c.hex) ? c.hex : '#999') + '"') + ' data-act="color" data-v="' + esc(c.name) + '" aria-pressed="' + on + '" aria-label="' + esc(c.name) + '" title="' + esc(c.name) + '"></button>';
          }).join('') + '</div>' + (PV.err === 'color' ? '<p class="err">اختر اللون أولاً</p>' : '') + '</div>' : '') +
        (!out ? '<div class="opt"><div class="opt-h"><span>الكمية</span></div><div class="stepper"><button type="button" data-act="qty" data-d="1" aria-label="زيادة">' + ic('plus') + '</button><output>' + PV.qty + '</output><button type="button" data-act="qty" data-d="-1" aria-label="إنقاص">' + ic('minus') + '</button></div></div>' : '') +
        '<div class="pd-actions">' +
          (out ? '<button type="button" class="btn btn-ghost" disabled>غير متوفر حالياً</button>' +
                 '<a class="btn btn-wa" href="' + esc(waLink('السلام عليكم، هل سيتوفر المنتج ' + p.name + ' (' + p.code + ') مرة أخرى؟')) + '" target="_blank" rel="noopener">' + ic('chat') + 'اسأل عن توفره</a>'
               : '<button type="button" class="btn btn-primary" data-act="add" data-autofocus>' + ic('bag') + 'أضف إلى السلة</button>' +
                 '<a class="btn btn-wa" data-act="pd-wa" href="' + esc(waLink(pvText())) + '" target="_blank" rel="noopener">' + ic('chat') + 'اطلب الآن عبر واتساب</a>') +
        '</div>' +
        (p.status === 'order' && S.settings.orderNote ? '<p class="note">' + esc(S.settings.orderNote) + '</p>' : '') +
        (showAdmin() ? '<button type="button" class="btn btn-ghost sm" data-act="edit" data-id="' + esc(p.id) + '" style="justify-self:start;width:max-content">' + ic('edit') + 'تعديل هذا المنتج</button>' : '') +
      '</div>' +
    '</div>';
}
function pvValid() {
  var p = findP(PV.id);
  if (p.sizes.length && !PV.size) { PV.err = 'size'; renderProduct(); return false; }
  if (p.colors.length && !PV.color) { PV.err = 'color'; renderProduct(); return false; }
  return true;
}
function addToCart() {
  if (!pvValid()) return;
  var p = findP(PV.id), key = [p.id, PV.size, PV.color].join('|');
  var line = cart.find(function (l) { return l.key === key; });
  if (line) line.qty = Math.min(99, line.qty + PV.qty); else cart.push({ key: key, id: p.id, size: PV.size, color: PV.color, qty: PV.qty });
  saveCart(); closeLayer();
  toast('أُضيف «' + p.name + '» إلى السلة', '', { act: 'cart', label: 'عرض السلة' });
}

/* ---------- cart ---------- */
function cartCount() { return cart.reduce(function (a, l) { var p = findP(l.id); return a + (p && p.status !== 'out' ? l.qty : 0); }, 0); }
function saveCart() { lsSet('alaseel-cart', cart); var b = $('#cart-badge'); if (b) { var n = cartCount(); b.textContent = n; b.hidden = !n; } }
function orderText(lines, c) {
  var out = ['السلام عليكم، أرغب بطلب المنتجات التالية من موقع عين الأصيل:', ''];
  var total = 0, n = 0;
  lines.forEach(function (l) {
    var p = findP(l.id); if (!p || p.status === 'out') return;
    n++;
    var u = unitPrice(p, l.size), sub = u * l.qty; total += sub;
    out.push(n + ') ' + p.name + ' — ' + p.code);
    if (l.size) out.push('   المقاس: ' + l.size);
    if (l.color) out.push('   اللون: ' + l.color);
    out.push('   الكمية: ' + l.qty + ' × ' + fmt(u) + ' = ' + fmt(sub));
  });
  out.push('', 'المجموع: ' + fmt(total));
  if (c) {
    var info = [];
    if (c.name) info.push('الاسم: ' + c.name);
    if (c.phone) info.push('الهاتف: ' + c.phone);
    if (c.gov) info.push('المحافظة: ' + c.gov);
    if (c.addr) info.push('العنوان: ' + c.addr);
    if (c.notes) info.push('ملاحظات: ' + c.notes);
    if (info.length) { out.push(''); out = out.concat(info); }
  }
  return out.join('\n');
}
function openCart() {
  SENT = false;
  var sh = pushLayer('narrow', null, 'cart');
  renderCart(); focusSheet(sh);
}
function renderCart() {
  var sh = topSheet('cart'); if (!sh) return;
  var total = 0, count = 0;
  var rows = cart.map(function (l, i) {
    var p = findP(l.id), ok = p && p.status !== 'out';
    if (ok) { total += unitPrice(p, l.size) * l.qty; count += l.qty; }
    var meta = [l.size ? 'المقاس: ' + esc(l.size) : '', l.color ? 'اللون: ' + esc(l.color) : ''].filter(Boolean).join(' · ');
    return '<div class="line' + (ok ? '' : ' gone') + '">' +
      '<div class="line-img">' + (p && p.images[0] ? '<img src="' + esc(thumb(p.images[0])) + '" alt="">' : '<span class="noimg">' + ic('hanger') + '</span>') + '</div>' +
      '<div class="line-t"><b>' + (p ? esc(p.name) : 'منتج لم يعد متوفراً') + '</b>' + (meta ? '<span>' + meta + '</span>' : '') +
        (p ? '<span class="code">' + esc(p.code) + '</span>' : '') +
        '<div class="line-row">' +
          (ok ? '<div class="stepper sm"><button type="button" data-act="line-qty" data-i="' + i + '" data-d="1" aria-label="زيادة">' + ic('plus') + '</button><output>' + l.qty + '</output><button type="button" data-act="line-qty" data-i="' + i + '" data-d="-1" aria-label="إنقاص">' + ic('minus') + '</button></div><strong>' + fmt(unitPrice(p, l.size) * l.qty) + '</strong>'
              : '<span class="err">غير متوفر — لن يُرسل مع الطلب</span>') +
          '<button type="button" class="x-btn" data-act="line-del" data-i="' + i + '" aria-label="حذف من السلة">' + ic('trash') + '</button>' +
        '</div>' +
      '</div></div>';
  }).join('');
  var head = '<div class="sheet-head"><h2>سلة الطلب' + (count ? ' <span class="muted" style="font-weight:500;font-size:14px">(' + count + ')</span>' : '') + '</h2><button type="button" class="icon-btn" data-act="close" aria-label="إغلاق">' + ic('x') + '</button></div>';
  if (!cart.length) {
    sh.innerHTML = head + '<div class="empty"><p>السلة فارغة. اختر منتجاً وحدد المقاس واللون ثم اضغط «أضف إلى السلة».</p><button type="button" class="btn btn-primary sm" data-act="close">تصفح المنتجات</button></div>';
    return;
  }
  var govs = '<option value="">اختر المحافظة</option>' + GOVS.map(function (g) { return '<option' + (cust.gov === g ? ' selected' : '') + '>' + g + '</option>'; }).join('');
  sh.innerHTML = head +
    '<div class="lines">' + rows + '</div>' +
    '<div class="total"><span>المجموع</span><b>' + fmt(total) + '</b></div>' +
    (S.settings.cartNote ? '<p class="help">' + esc(S.settings.cartNote) + '</p>' : '') +
    '<div class="block"><h3>معلوماتك</h3><div class="form">' +
      '<label class="field"><span>الاسم *</span><input class="inp" id="c-name" data-in="cust" data-k="name" autocomplete="name" value="' + esc(cust.name || '') + '"></label>' +
      '<label class="field"><span>رقم الهاتف</span><input class="inp ltr" id="c-phone" data-in="cust" data-k="phone" inputmode="tel" autocomplete="tel" placeholder="07xx xxx xxxx" value="' + esc(cust.phone || '') + '"></label>' +
      '<label class="field"><span>المحافظة</span><select class="inp" id="c-gov" data-in="cust" data-k="gov">' + govs + '</select></label>' +
      '<label class="field"><span>العنوان (المنطقة وأقرب نقطة دالة)</span><input class="inp" id="c-addr" data-in="cust" data-k="addr" autocomplete="street-address" value="' + esc(cust.addr || '') + '"></label>' +
      '<label class="field span2"><span>ملاحظات</span><textarea class="inp" id="c-notes" data-in="cust" data-k="notes" rows="2">' + esc(cust.notes || '') + '</textarea></label>' +
    '</div>' +
    (count ? '<a class="btn btn-wa btn-block" id="send-link" data-act="send" href="' + esc(waLink(orderText(cart, cust))) + '" target="_blank" rel="noopener">' + ic('chat') + 'إرسال الطلب عبر واتساب</a>' : '<p class="err">لا توجد منتجات متوفرة في السلة.</p>') +
    '<p class="err" id="send-err" hidden>اكتب اسمك حتى يصلنا الطلب باسمك.</p>' +
    (SENT ? '<p class="sent">فُتح واتساب برسالة الطلب. اضغط «إرسال» داخل واتساب لإتمام الطلب، ثم يمكنك تفريغ السلة.</p>' : '') +
    '<div class="numbox"><span>إذا لم يفتح واتساب، انسخ الطلب وأرسله إلى <span class="ltr">' + esc(S.settings.whatsappDisplay) + '</span></span>' +
      '<span style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn btn-ghost sm" data-act="copy-order">نسخ نص الطلب</button><button type="button" class="btn btn-ghost sm" data-act="copy-num">نسخ الرقم</button></span></div>' +
    '<details class="raw"><summary>عرض نص الطلب</summary><textarea class="inp" id="order-raw" readonly>' + esc(orderText(cart, cust)) + '</textarea></details>' +
    '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><button type="button" class="linkish" data-act="close">متابعة التسوق</button>' +
      '<button type="button" class="linkish danger" data-act="clear-cart">' + (ARMED.clear ? 'اضغط مجدداً لتأكيد التفريغ' : 'تفريغ السلة') + '</button></div>' +
    '</div>';
}
function refreshSend() {
  var a = $('#send-link'); if (a) a.href = waLink(orderText(cart, cust));
  var r = $('#order-raw'); if (r) r.value = orderText(cart, cust);
}

/* ---------- size guide ---------- */
function table(head, rows) {
  return '<div class="tbl-wrap"><table><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
    rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
}
function openGuide() {
  var sh = pushLayer('mid', null, 'guide');
  sh.innerHTML = '<div class="sheet-head"><h2>جدول المقاسات</h2><button type="button" class="icon-btn" data-act="close" aria-label="إغلاق">' + ic('x') + '</button></div>' +
    '<div class="guide">' +
      '<p class="note">القياسات تقريبية بالسنتيمتر وقد تختلف حسب الموديل. المقاسات الصينية تكون غالباً أصغر من الأوروبية، لذلك قارن قياسك بالجدول أو راسلنا قبل الطلب.</p>' +
      '<section><h3>رجالي</h3>' + table(['المقاس', 'الصدر', 'الخصر', 'الطول'], [['S', '88–92', '74–78', '165–170'], ['M', '92–98', '78–84', '170–175'], ['L', '98–104', '84–90', '175–180'], ['XL', '104–110', '90–96', '178–183'], ['2XL', '110–116', '96–102', '180–185'], ['3XL', '116–122', '102–108', '182–188']]) + '</section>' +
      '<section><h3>نسائي</h3>' + table(['المقاس', 'الصدر', 'الخصر', 'الورك'], [['XS', '78–82', '60–64', '84–88'], ['S', '82–86', '64–68', '88–92'], ['M', '86–90', '68–72', '92–96'], ['L', '90–96', '72–78', '96–102'], ['XL', '96–102', '78–84', '102–108'], ['2XL', '102–108', '84–90', '108–114']]) + '</section>' +
      '<section><h3>أطفال</h3>' + table(['العمر', 'الطول', 'الصدر'], [['1-2 سنة', '80–92', '50–52'], ['2-3 سنة', '92–98', '52–54'], ['3-4 سنة', '98–104', '54–56'], ['4-5 سنة', '104–110', '56–58'], ['5-6 سنة', '110–116', '58–60'], ['6-7 سنة', '116–122', '60–62'], ['7-8 سنة', '122–128', '62–64'], ['9-10 سنة', '134–140', '66–70'], ['11-12 سنة', '146–152', '72–76'], ['13-14 سنة', '158–164', '78–82']]) + '</section>' +
      '<section><h3>أحذية</h3>' + table(['المقاس (EU)', 'طول القدم'], [['36', '23.0'], ['37', '23.5'], ['38', '24.0'], ['39', '24.5'], ['40', '25.0'], ['41', '25.5–26.0'], ['42', '26.5'], ['43', '27.0'], ['44', '27.5–28.0'], ['45', '28.5'], ['46', '29.0']]) +
        '<p class="help" style="margin-top:8px">لقياس القدم: قف على ورقة، علّم أطول نقطة من الكعب إلى الإصبع، ثم قس المسافة بالسنتيمتر.</p></section>' +
    '</div>';
  focusSheet(sh);
}

/* ---------- toast & copy ---------- */
var toastT = 0;
function toast(msg, kind, action) {
  var t = $('#toast'); if (!t) return;
  t.innerHTML = '<span>' + esc(msg) + '</span>' + (action ? '<button type="button" data-act="' + action.act + '">' + esc(action.label) + '</button>' : '');
  t.className = 'toast show' + (kind ? ' ' + kind : '');
  clearTimeout(toastT);
  toastT = setTimeout(function () { t.className = 'toast'; }, kind === 'err' ? 8000 : 4000);
}
function copyText(text, ok) {
  function fallback() {
    var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); var done = false; try { done = document.execCommand('copy'); } catch (e) {} ta.remove();
    toast(done ? ok : 'تعذّر النسخ تلقائياً. افتح «عرض نص الطلب» وانسخه يدوياً.', done ? '' : 'err');
  }
  try { navigator.clipboard.writeText(text).then(function () { toast(ok); }, fallback); } catch (e) { fallback(); }
}

/* ---------- images ---------- */
function loadImage(file) {
  return new Promise(function (res, rej) {
    var url = URL.createObjectURL(file), im = new Image();
    im.onload = function () { res({ im: im, url: url }); };
    im.onerror = function () { URL.revokeObjectURL(url); rej(new Error('decode')); };
    im.src = url;
  });
}
function encode(im, max, q, cap) {
  var w = im.naturalWidth, h = im.naturalHeight, k = Math.min(1, max / Math.max(w, h));
  var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
  var g = c.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height);
  var type = 'image/webp', out = c.toDataURL(type, q);
  if (out.indexOf('data:image/webp') !== 0) { type = 'image/jpeg'; out = c.toDataURL(type, q); }
  if (out.length > cap) out = c.toDataURL(type, q - 0.14);
  if (out.length > cap * 1.5) out = c.toDataURL(type, q - 0.28);
  return out;
}
function extOf(dataUrl) { return dataUrl.indexOf('data:image/webp') === 0 ? 'webp' : 'jpg'; }
function processPhoto(file) {
  return loadImage(file).then(function (o) {
    var f = encode(o.im, 1100, 0.8, 240000), t = encode(o.im, 440, 0.74, 60000);
    URL.revokeObjectURL(o.url);
    return { f: f, t: t, _new: true };
  });
}
function processLogo(file) {
  return loadImage(file).then(function (o) { var d = encode(o.im, 320, 0.85, 80000); URL.revokeObjectURL(o.url); return d; });
}

/* ---------- editor (owner) ---------- */
function openEditor(id) {
  var src = id ? findP(id) : null;
  ED = src ? clone(src) : { id: '', code: '', name: '', section: view.sec !== 'all' ? view.sec : S.sections[0].id, price: '', oldPrice: '', status: 'in', desc: '', images: [], sizes: [], perSize: false, colors: [], sample: false };
  if (ED.oldPrice === 0) ED.oldPrice = '';
  ED._kind = kindFor(ED.section); ED._busy = 0; ED._del = false;
  while (stack.length) closeLayer();
  var sh = pushLayer('mid', function () { ED = null; }, 'editor');
  sh.parentNode._sticky = true;
  var secOpts = S.sections.map(function (s) { return '<option value="' + esc(s.id) + '"' + (s.id === ED.section ? ' selected' : '') + '>' + esc(s.name) + '</option>'; }).join('');
  sh.innerHTML =
    '<div class="sheet-head"><h2>' + (src ? 'تعديل المنتج <span class="code">' + esc(src.code) + '</span>' : 'منتج جديد') + '</h2><button type="button" class="icon-btn" data-act="ed-cancel" aria-label="إغلاق">' + ic('x') + '</button></div>' +
    '<div class="ed">' +
      '<section class="ed-sec"><h3>الصور <small>الصورة الأولى تظهر في الواجهة · حتى ' + MAX_IMG + ' صور</small></h3><div id="ed-photos"></div></section>' +
      '<section class="ed-sec grid2">' +
        '<label class="field span2"><span>اسم المنتج *</span><input class="inp" id="ed-name" data-in="ed" data-k="name" value="' + esc(ED.name) + '" placeholder="مثال: بيجامة قطن نسائية بأكمام طويلة"></label>' +
        '<label class="field"><span>القسم</span><select class="inp" id="ed-section" data-in="ed" data-k="section">' + secOpts + '</select></label>' +
        '<div class="field"><span>الحالة</span><div class="seg" id="ed-status"></div></div>' +
        '<label class="field"><span>السعر (' + esc(S.settings.currency) + ') *</span><input class="inp ltr" id="ed-price" data-in="ed" data-k="price" inputmode="decimal" value="' + esc(ED.price) + '" placeholder="25000"></label>' +
        '<label class="field"><span>السعر قبل الخصم <small>(اختياري)</small></span><input class="inp ltr" id="ed-old" data-in="ed" data-k="oldPrice" inputmode="decimal" value="' + esc(ED.oldPrice) + '" placeholder="30000"></label>' +
      '</section>' +
      '<section class="ed-sec"><h3>المقاسات <small>اضغط على المقاسات المتوفرة</small></h3><div id="ed-sizes" class="ed-sec"></div></section>' +
      '<section class="ed-sec"><h3>الألوان <small>اختر من القائمة أو أضف لوناً باسمك</small></h3><div id="ed-colors" class="ed-sec"></div></section>' +
      '<section class="ed-sec"><label class="field"><span>الوصف <small>(القماش، القصّة، ملاحظات المقاس…)</small></span><textarea class="inp" id="ed-desc" data-in="ed" data-k="desc" rows="3">' + esc(ED.desc) + '</textarea></label></section>' +
      '<div class="ed-foot" id="ed-foot"></div>' +
    '</div>';
  renderEdPhotos(); renderEdStatus(); renderEdSizes(); renderEdColors(); renderEdFoot();
  var n = $('#ed-name'); if (n && !src) try { n.focus({ preventScroll: true }); } catch (e) {}
}
function renderEdPhotos() {
  var el = $('#ed-photos'); if (!el || !ED) return;
  el.innerHTML = '<div class="ph-grid">' + ED.images.map(function (im, i) {
    return '<div class="ph"><img src="' + esc(thumb(im)) + '" alt=""><span class="ph-n">' + (i === 0 ? 'الرئيسية' : i + 1) + '</span><div class="ph-act">' +
      (i > 0 ? '<button type="button" data-act="ed-img-main" data-i="' + i + '" title="اجعلها الصورة الرئيسية" aria-label="اجعلها الصورة الرئيسية">' + ic('star') + '</button>' : '') +
      '<button type="button" class="del" data-act="ed-img-del" data-i="' + i + '" title="حذف الصورة" aria-label="حذف الصورة">' + ic('trash') + '</button></div></div>';
  }).join('') +
  (ED.images.length < MAX_IMG ? '<label class="ph-add" id="ph-drop">' + ic('img') + '<span>' + (ED._busy ? 'جاري تجهيز الصور…' : 'إضافة صور') + '</span><small>اختر من جهازك، أو اسحبها هنا، أو الصقها</small><input class="vh" type="file" id="ed-files" accept="image/*" multiple data-in="ed-files"></label>' : '') +
  '</div>';
}
function renderEdStatus() {
  var el = $('#ed-status'); if (!el) return;
  el.innerHTML = ['in', 'order', 'out'].map(function (k) { return '<button type="button" data-act="ed-status" data-v="' + k + '" class="' + (ED.status === k ? 'on' : '') + '" aria-pressed="' + (ED.status === k) + '">' + STATUS[k] + '</button>'; }).join('');
}
var ALL_PRESETS = [].concat(SIZE_PRESETS.clothes, SIZE_PRESETS.kids, SIZE_PRESETS.shoes, SIZE_PRESETS.none);
function sortSizes() {
  ED.sizes.forEach(function (s, i) { s._o = i; });
  ED.sizes.sort(function (a, b) {
    var ra = ALL_PRESETS.indexOf(a.label), rb = ALL_PRESETS.indexOf(b.label);
    if (ra < 0) ra = 1000 + a._o; if (rb < 0) rb = 1000 + b._o;
    return ra - rb;
  });
  ED.sizes.forEach(function (s) { delete s._o; });
}
function renderEdSizes() {
  var el = $('#ed-sizes'); if (!el || !ED) return;
  var has = {}; ED.sizes.forEach(function (s) { has[s.label] = 1; });
  el.innerHTML =
    '<div class="seg" role="group" aria-label="نوع المقاسات">' + Object.keys(SIZE_PRESETS).map(function (k) { return '<button type="button" data-act="ed-kind" data-v="' + k + '" class="' + (ED._kind === k ? 'on' : '') + '">' + KIND_LABELS[k] + '</button>'; }).join('') + '</div>' +
    (ED._kind === 'none' ? '<p class="help">هذا النوع لا يحتاج مقاسات عادةً. اترك المقاسات فارغة، أو أضف مقاساً خاصاً بالأسفل.</p>' :
      '<div class="chips">' + SIZE_PRESETS[ED._kind].map(function (s) { return '<button type="button" class="chip-opt' + (has[s] ? ' on' : '') + '" data-act="ed-size" data-v="' + esc(s) + '" aria-pressed="' + !!has[s] + '">' + esc(s) + '</button>'; }).join('') + '</div>') +
    '<div class="inline-add"><input class="inp" id="ed-size-new" placeholder="مقاس آخر، مثل: 32 أو 110 سم أو 38-42"><button type="button" class="btn btn-ghost sm" data-act="ed-size-add">إضافة مقاس</button></div>' +
    (ED.sizes.length ? '<div class="sel-sizes" aria-label="المقاسات المختارة">' + ED.sizes.map(function (s, i) { return '<span>' + esc(s.label) + '<button type="button" class="x-btn" data-act="ed-size-del" data-i="' + i + '" aria-label="إزالة ' + esc(s.label) + '">' + ic('x') + '</button></span>'; }).join('') + '</div>' +
      '<label class="check"><input type="checkbox" id="ed-persize" data-in="ed-persize"' + (ED.perSize ? ' checked' : '') + '>سعر مختلف لبعض المقاسات</label>' +
      (ED.perSize ? '<div class="ps">' + ED.sizes.map(function (s, i) { return '<label><span>' + esc(s.label) + '</span><input class="inp ltr" id="ed-sp-' + i + '" data-in="ed-sp" data-i="' + i + '" inputmode="decimal" value="' + esc(s.price || '') + '" placeholder="' + esc(toNum(ED.price) ? toNum(ED.price).toLocaleString('en-US') : 'نفس السعر') + '"></label>'; }).join('') + '</div><p class="help">اترك الخانة فارغة ليأخذ المقاس السعر الأساسي.</p>' : '')
      : '<p class="help">لم تُحدَّد مقاسات. سيطلب الزبون المنتج بدون اختيار مقاس.</p>');
}
function renderEdColors() {
  var el = $('#ed-colors'); if (!el || !ED) return;
  var has = {}; ED.colors.forEach(function (c) { has[c.name] = 1; });
  el.innerHTML =
    '<div class="pal">' + COLOR_PRESETS.map(function (c) { return '<button type="button" data-act="ed-color" data-v="' + esc(c[0]) + '" class="' + (has[c[0]] ? 'on' : '') + '" aria-pressed="' + !!has[c[0]] + '"><i' + swatchAttr(c[1]) + '></i>' + esc(c[0]) + '</button>'; }).join('') + '</div>' +
    '<div class="inline-add"><input class="inp" id="ed-color-name" placeholder="اسم لون آخر، مثل: موف"><input type="color" id="ed-color-hex" value="#8a6d5a" aria-label="درجة اللون"><button type="button" class="btn btn-ghost sm" data-act="ed-color-add">إضافة لون</button></div>' +
    (ED.colors.length ? '<div class="clist">' + ED.colors.map(function (c, i) {
      return '<div class="crow"><i' + swatchAttr(c.hex) + '></i><b>' + esc(c.name) + '</b>' +
        (ED.images.length ? '<label>صورة اللون <select class="inp" id="ed-cimg-' + i + '" data-in="ed-cimg" data-i="' + i + '"><option value="-1">بدون</option>' + ED.images.map(function (_, j) { return '<option value="' + j + '"' + (c.img === j ? ' selected' : '') + '>صورة ' + (j + 1) + '</option>'; }).join('') + '</select></label>' : '') +
        '<button type="button" class="x-btn" data-act="ed-color-del" data-i="' + i + '" aria-label="إزالة ' + esc(c.name) + '">' + ic('x') + '</button></div>';
    }).join('') + '</div>' + (ED.images.length > 1 ? '<p class="help">اربط كل لون بصورته ليتغيّر العرض عندما يختار الزبون اللون.</p>' : '') : '');
}
function renderEdFoot() {
  var el = $('#ed-foot'); if (!el || !ED) return;
  el.innerHTML =
    (ED.id ? (ED._del ? '<span class="err">حذف هذا المنتج نهائياً؟</span><button type="button" class="btn btn-danger sm" data-act="ed-del-yes">نعم، احذف</button><button type="button" class="btn btn-ghost sm" data-act="ed-del-no">لا</button>'
                      : '<button type="button" class="btn btn-danger sm" data-act="ed-del">' + ic('trash') + 'حذف المنتج</button>') : '') +
    '<span class="grow"></span>' +
    '<button type="button" class="btn btn-ghost sm" data-act="ed-cancel">إلغاء</button>' +
    '<button type="button" class="btn btn-primary sm" data-act="ed-save">حفظ المنتج</button>';
}
function addImages(files) {
  if (!ED) return;
  var list = Array.prototype.filter.call(files || [], function (f) { return /^image\//.test(f.type) || /\.(jpe?g|png|webp|gif|avif|bmp|heic|heif)$/i.test(f.name || ''); });
  if (!list.length) return;
  var room = MAX_IMG - ED.images.length - ED._busy;
  if (room <= 0) { toast('الحد الأقصى ' + MAX_IMG + ' صور لكل منتج.', 'err'); return; }
  if (list.length > room) { toast('أُضيفت أول ' + room + ' صور فقط (الحد ' + MAX_IMG + ' صور).'); list = list.slice(0, room); }
  var target = ED;
  target._busy += list.length; renderEdPhotos();
  list.reduce(function (pr, f) {
    return pr.then(function () {
      return processPhoto(f).then(function (d) { target.images.push(d); }, function () {
        toast('تعذّر فتح الصورة «' + (f.name || '') + '». جرّب صيغة JPG أو PNG.', 'err');
      }).then(function () { target._busy--; if (ED === target) { renderEdPhotos(); renderEdColors(); } });
    });
  }, Promise.resolve());
}
function saveEditor() {
  if (!ED) return;
  if (ED._busy) { toast('انتظر حتى تنتهي الصور من التجهيز.', 'err'); return; }
  var name = String(ED.name || '').trim(), price = toNum(ED.price), old = toNum(ED.oldPrice);
  $('#ed-name').classList.toggle('bad', !name);
  $('#ed-price').classList.toggle('bad', !(price > 0));
  if (!name) { toast('اكتب اسم المنتج.', 'err'); $('#ed-name').focus(); return; }
  if (!(price > 0)) { toast('اكتب السعر بالأرقام، مثل 25000.', 'err'); $('#ed-price').focus(); return; }
  var p = {
    id: ED.id, code: ED.code, name: name, section: ED.section, price: price, oldPrice: old > price ? old : 0, status: ED.status,
    desc: String(ED.desc || '').trim(), images: ED.images.slice(),
    sizes: ED.sizes.map(function (s) { return { label: s.label, price: ED.perSize ? toNum(s.price) : 0 }; }),
    perSize: !!ED.perSize && ED.sizes.length > 0,
    colors: ED.colors.map(function (c) { return { name: c.name, hex: c.hex, img: c.img < ED.images.length ? c.img : -1 }; }),
    sample: false, createdAt: ED.createdAt || Date.now()
  };
  if (p.perSize && !p.sizes.some(function (s) { return s.price > 0 && s.price !== price; })) p.perSize = false;
  var isNew = !p.id;
  if (isNew) { S.seq = (S.seq || 1000) + 1; p.id = 'p' + S.seq; p.code = 'AS-' + S.seq; S.products.unshift(p); }
  else { var i = S.products.findIndex(function (x) { return x.id === p.id; }); if (i >= 0) S.products[i] = p; else S.products.unshift(p); }
  closeLayer();
  changed(isNew ? 'أُضيف المنتج ' + p.code + '. اضغط «نشر على الموقع» ليظهر للزبائن.' : 'حُفظ التعديل. اضغط «نشر على الموقع» ليظهر للزبائن.');
}

/* ---------- settings (owner) ---------- */
function openSettings() {
  while (stack.length) closeLayer();
  ST = { settings: clone(S.settings), sections: clone(S.sections) };
  var sh = pushLayer('mid', function () { ST = null; }, 'settings');
  sh.parentNode._sticky = true;
  renderSettings();
}
function logoDefault(size) { var l = S.settings.logo; S.settings.logo = ''; var h = logo(size); S.settings.logo = l; return h; }
function renderSettings() {
  var sh = topSheet('settings'); if (!sh || !ST) return;
  var s = ST.settings, counts = {};
  S.products.forEach(function (p) { counts[p.section] = (counts[p.section] || 0) + 1; });
  sh.innerHTML =
    '<div class="sheet-head"><h2>إعدادات الموقع</h2><button type="button" class="icon-btn" data-act="st-cancel" aria-label="إغلاق">' + ic('x') + '</button></div>' +
    '<div class="ed">' +
      '<section class="ed-sec grid2">' +
        '<label class="field"><span>رقم واتساب لاستلام الطلبات</span><input class="inp ltr" id="st-wa" data-in="st" data-k="whatsappDisplay" inputmode="tel" value="' + esc(s.whatsappDisplay) + '"><small>بالصيغة الدولية، مثل ‎+964 780 779 0009</small></label>' +
        '<label class="field"><span>حساب إنستغرام</span><input class="inp ltr" id="st-ig" data-in="st" data-k="instagram" value="' + esc(s.instagram) + '"></label>' +
        '<label class="field"><span>العملة</span><input class="inp" id="st-cur" data-in="st" data-k="currency" value="' + esc(s.currency) + '"><small>تظهر بجانب كل سعر، مثل: د.ع أو $</small></label>' +
        '<div class="field"><span>الشعار</span><div class="logo-row">' + (s.logo ? '<img class="logo-img" src="' + esc(s.logo) + '" width="52" height="52" alt="">' : logoDefault(52)) +
          '<label class="btn btn-ghost sm">رفع شعار<input class="vh" type="file" id="st-logo" accept="image/*" data-in="st-logo"></label>' +
          (s.logo ? '<button type="button" class="linkish danger" data-act="st-logo-del">إرجاع الشعار الافتراضي</button>' : '') + '</div></div>' +
        '<label class="field span2"><span>ملاحظة المنتجات «حسب الطلب»</span><textarea class="inp" id="st-note" data-in="st" data-k="orderNote" rows="2">' + esc(s.orderNote) + '</textarea></label>' +
        '<label class="field span2"><span>ملاحظة أسفل السلة</span><textarea class="inp" id="st-cnote" data-in="st" data-k="cartNote" rows="2">' + esc(s.cartNote) + '</textarea></label>' +
      '</section>' +
      '<section class="ed-sec"><h3>الأقسام <small>الترتيب هنا هو ترتيبها في الموقع</small></h3><div class="sec-list">' +
        ST.sections.map(function (x, i) {
          var n = counts[x.id] || 0;
          return '<div class="sec-row"><input class="inp" id="st-sec-' + i + '" data-in="st-sec-name" data-i="' + i + '" value="' + esc(x.name) + '" aria-label="اسم القسم">' +
            '<select class="inp" id="st-kind-' + i + '" data-in="st-sec-kind" data-i="' + i + '" aria-label="نوع المقاسات">' + Object.keys(SIZE_PRESETS).map(function (k) { return '<option value="' + k + '"' + (x.kind === k ? ' selected' : '') + '>مقاسات ' + KIND_LABELS[k] + '</option>'; }).join('') + '</select>' +
            '<span class="cnt">' + n + ' منتج</span>' +
            '<span class="btns"><button type="button" class="x-btn" data-act="st-sec-move" data-i="' + i + '" data-d="-1" aria-label="تحريك للأعلى"' + (i === 0 ? ' disabled' : '') + '>' + ic('up') + '</button>' +
              '<button type="button" class="x-btn" data-act="st-sec-move" data-i="' + i + '" data-d="1" aria-label="تحريك للأسفل"' + (i === ST.sections.length - 1 ? ' disabled' : '') + '>' + ic('down') + '</button>' +
              '<button type="button" class="x-btn" data-act="st-sec-del" data-i="' + i + '" aria-label="حذف القسم"' + (n ? ' disabled title="انقل أو احذف منتجات هذا القسم أولاً"' : '') + '>' + ic('trash') + '</button></span></div>';
        }).join('') + '</div>' +
        '<div class="inline-add"><input class="inp" id="st-sec-new" placeholder="اسم قسم جديد، مثل: بيجامات"><button type="button" class="btn btn-ghost sm" data-act="st-sec-add">' + ic('plus') + 'إضافة قسم</button></div>' +
      '</section>' +
      '<section class="ed-sec"><h3>مفتاح النشر</h3><p class="help">هذا الجهاز مربوط بالمستودع <span class="ltr">' + esc(GH ? GH.repo : '') + '</span>. لإيقاف الإدارة على هذا الجهاز (مثلاً جهاز مشترك) اضغط «تسجيل الخروج».</p>' +
        '<button type="button" class="btn btn-ghost sm" data-act="logout" style="width:max-content">تسجيل الخروج من الإدارة</button></section>' +
      '<div class="ed-foot"><span class="grow"></span><button type="button" class="btn btn-ghost sm" data-act="st-cancel">إلغاء</button><button type="button" class="btn btn-primary sm" data-act="st-save">حفظ الإعدادات</button></div>' +
    '</div>';
}
function saveSettings() {
  var s = ST.settings, digits = arDigits(s.whatsappDisplay).replace(/\D/g, '').replace(/^00/, '');
  if (digits.length < 8) { toast('اكتب رقم واتساب صحيحاً بالصيغة الدولية.', 'err'); $('#st-wa').classList.add('bad'); return; }
  if (ST.sections.some(function (x) { return !String(x.name).trim(); })) { toast('يجب أن يكون لكل قسم اسم.', 'err'); return; }
  s.whatsapp = digits; s.instagram = String(s.instagram || '').replace(/^@/, '').trim(); s.currency = String(s.currency || '').trim() || 'د.ع';
  ST.sections.forEach(function (x) { x.name = String(x.name).trim(); });
  S.settings = s; S.sections = ST.sections;
  closeLayer();
  changed('حُفظت الإعدادات. اضغط «نشر على الموقع» لتطبيقها.');
  renderHero(); renderFoot(); renderHeader();
}

/* ---------- GitHub (owner publishing) ---------- */
function gh(method, path, body, accept) {
  var h = { Authorization: 'Bearer ' + GH.token, Accept: accept || 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  if (body) h['Content-Type'] = 'application/json';
  return fetch('https://api.github.com/repos/' + GH.repo + path, { method: method, headers: h, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) { var e = new Error('github ' + r.status); e.status = r.status; return r.text().then(function (t) { e.body = t; throw e; }); }
      return r.status === 204 ? null : r.json();
    });
}
function b64ToText(b64) {
  var bin = atob(String(b64).replace(/\s/g, '')), bytes = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder('utf-8').decode(bytes);
}
function ghErrText(e) {
  if (!e || !e.status) return 'تعذّر الاتصال بـ GitHub. تأكد من الإنترنت وحاول مجدداً.';
  if (e.status === 401) return 'مفتاح النشر غير صحيح أو انتهت صلاحيته. أنشئ مفتاحاً جديداً من GitHub ثم سجّل الدخول به.';
  if (e.status === 403) return 'المفتاح لا يملك صلاحية الكتابة على المستودع. تأكد أن صلاحية Contents مضبوطة على Read and write.';
  if (e.status === 404) return 'المستودع غير موجود أو المفتاح لا يملك صلاحية عليه. تأكد من اسم المستودع.';
  if (e.status === 409 || e.status === 422) return 'تغيّر الموقع أثناء النشر. أعد تحميل الصفحة ثم انشر مرة أخرى؛ تغييراتك محفوظة.';
  return 'حدث خطأ من GitHub (' + e.status + '). حاول مرة أخرى بعد قليل.';
}
function loadFromGitHub() {
  return gh('GET', '/contents/' + CATALOG_PATH + '?ref=' + BRANCH).then(function (meta) {
    CAT_SHA = meta.sha;
    return gh('GET', '/git/blobs/' + meta.sha);
  }).then(function (blob) { return normalize(JSON.parse(b64ToText(blob.content))); });
}
function imgPaths(data) {
  var out = {};
  data.products.forEach(function (p) { p.images.forEach(function (im) { [im.f, im.t].forEach(function (s) { if (/^img\/u\//.test(s)) out[s] = 1; }); }); });
  if (/^img\/u\//.test(data.settings.logo || '')) out[data.settings.logo] = 1;
  return out;
}
function publish() {
  if (!IS_ADMIN || PUBLISHING || !PENDING) return;
  PUBLISHING = true; renderAdminBar();
  var files = [], next = clone(S);
  next.rev = (PUB.rev || 1) + 1; next.updatedAt = new Date().toISOString();
  next.products.forEach(function (p) {
    p.images = p.images.map(function (im) {
      if (!im._new) return { f: im.f, t: im.t };
      var base = 'img/u/' + p.id + '-' + uid();
      var fp = base + '.' + extOf(im.f), tp = base + '-t.' + extOf(im.t);
      files.push({ path: fp, b64: im.f.slice(im.f.indexOf(',') + 1) }, { path: tp, b64: im.t.slice(im.t.indexOf(',') + 1) });
      LOCAL[fp] = im.f; LOCAL[tp] = im.t;
      return { f: fp, t: tp };
    });
  });
  if (/^data:/.test(next.settings.logo || '')) {
    var lp = 'img/u/logo-' + uid() + '.' + extOf(next.settings.logo);
    files.push({ path: lp, b64: next.settings.logo.slice(next.settings.logo.indexOf(',') + 1) });
    LOCAL[lp] = next.settings.logo;
    next.settings.logo = lp;
  }
  var had = imgPaths(PUB), keep = imgPaths(next), gone = Object.keys(had).filter(function (k) { return !keep[k]; });
  var headSha, baseTree, newCommit;
  gh('GET', '/git/ref/heads/' + BRANCH).then(function (ref) {
    headSha = ref.object.sha;
    return gh('GET', '/contents/' + CATALOG_PATH + '?ref=' + headSha);
  }).then(function (meta) {
    if (CAT_SHA && meta.sha !== CAT_SHA) { var e = new Error('moved'); e.status = 409; throw e; }
    return gh('GET', '/git/commits/' + headSha);
  }).then(function (c) {
    baseTree = c.tree.sha;
    return files.reduce(function (pr, f) {
      return pr.then(function (acc) { return gh('POST', '/git/blobs', { content: f.b64, encoding: 'base64' }).then(function (b) { acc.push({ path: f.path, mode: '100644', type: 'blob', sha: b.sha }); return acc; }); });
    }, Promise.resolve([]));
  }).then(function (tree) {
    tree.push({ path: CATALOG_PATH, mode: '100644', type: 'blob', content: JSON.stringify(next, null, 1) });
    var withDel = tree.concat(gone.map(function (p) { return { path: p, mode: '100644', type: 'blob', sha: null }; }));
    return gh('POST', '/git/trees', { base_tree: baseTree, tree: withDel }).catch(function (e) {
      if (gone.length && e.status === 422) return gh('POST', '/git/trees', { base_tree: baseTree, tree: tree });
      throw e;
    });
  }).then(function (t) {
    return gh('POST', '/git/commits', { message: 'تحديث الموقع: ' + PENDING + ' تغيير', tree: t.sha, parents: [headSha] });
  }).then(function (c) {
    newCommit = c.sha;
    return gh('PATCH', '/git/refs/heads/' + BRANCH, { sha: newCommit });
  }).then(function () {
    return gh('GET', '/contents/' + CATALOG_PATH + '?ref=' + newCommit).then(function (m) { CAT_SHA = m.sha; }, function () { CAT_SHA = ''; });
  }).then(function () {
    PUB = normalize(next); S = clone(PUB);
    PENDING = 0; PUBLISHING = false; draftClear();
    renderAll();
    toast('تم النشر. سيظهر التحديث على الموقع خلال دقيقة تقريباً.');
  }).catch(function (e) {
    PUBLISHING = false;
    renderAdminBar(); toast(ghErrText(e), 'err');
  });
}

/* ---------- admin login & drafts ---------- */
var dbP = null;
function idb() {
  if (!dbP) dbP = new Promise(function (res) {
    try { var r = indexedDB.open('alaseel-admin', 1); r.onupgradeneeded = function () { r.result.createObjectStore('kv'); }; r.onsuccess = function () { res(r.result); }; r.onerror = function () { res(null); }; r.onblocked = function () { res(null); }; }
    catch (e) { res(null); }
  });
  return dbP;
}
function idbDo(mode, fn) {
  return idb().then(function (db) {
    if (!db) return null;
    return new Promise(function (res) {
      try { var tx = db.transaction('kv', mode), req = fn(tx.objectStore('kv')); tx.oncomplete = function () { res(req ? req.result : null); }; tx.onerror = tx.onabort = function () { res(null); }; }
      catch (e) { res(null); }
    });
  });
}
function draftSave() { return idbDo('readwrite', function (st) { return st.put({ base: CAT_SHA, count: PENDING, data: S, at: Date.now() }, 'draft'); }); }
function draftLoad() { return idbDo('readonly', function (st) { return st.get('draft'); }); }
function draftClear() { return idbDo('readwrite', function (st) { return st.delete('draft'); }); }
function restoreData(d) {
  var n = normalize(d);
  /* keep unpublished photos (data URLs) marked as new */
  n.products.forEach(function (p, i) {
    var src = (d.products || [])[i];
    p.images.forEach(function (im, j) { var o = src && src.images && src.images[j]; if (o && o._new) im._new = true; });
  });
  return n;
}

function changed(msg) {
  PENDING++;
  draftSave();
  renderRail(); renderGrid(); renderAdminBar();
  if (msg) toast(msg);
}
function renderAdminBar() {
  var bar = $('#adminbar'), app = $('#app');
  if (!bar) return;
  var on = showAdmin();
  bar.hidden = !on; app.classList.toggle('has-admin', on);
  if (!on) { bar.innerHTML = ''; app.style.paddingBottom = ''; return; }
  var samples = S.products.some(function (p) { return p.sample; });
  bar.innerHTML = '<div class="wrap ab-in">' +
    '<div class="ab-status"><span class="ab-label">إدارة</span>' +
      (PUBLISHING ? '<span class="dot pend"></span><b>جاري النشر…</b>' : PENDING ? '<span class="dot pend"></span><b>' + PENDING + (PENDING === 1 ? ' تغيير غير منشور' : ' تغييرات غير منشورة') + '</b>' : '<span class="dot"></span><span>كل التغييرات منشورة</span>') +
    '</div>' +
    '<div class="ab-actions">' +
      '<button type="button" class="btn btn-ghost sm" data-act="settings">الإعدادات</button>' +
      '<button type="button" class="btn btn-ghost sm" data-act="new">' + ic('plus') + 'منتج جديد</button>' +
      (PENDING && !PUBLISHING ? '<button type="button" class="btn btn-ghost sm" data-act="discard">' + (ARMED.discard ? 'تأكيد التراجع؟' : 'تراجع') + '</button>' : '') +
      '<button type="button" class="btn btn-primary sm" data-act="publish"' + (!PENDING || PUBLISHING ? ' disabled' : '') + '>' + (PUBLISHING ? 'جاري النشر…' : 'نشر على الموقع') + '</button>' +
    '</div>' +
    (STALE ? '<p class="ab-note">وُجدت تغييرات غير منشورة محفوظة من جلسة سابقة. <button type="button" class="linkish" data-act="stale-restore">استعادتها</button><button type="button" class="linkish danger" data-act="stale-drop">تجاهلها</button></p>' : '') +
    (samples ? '<p class="ab-note">المنتجات المعلّمة «مثال» للعرض فقط. بعد إضافة منتجاتك: <button type="button" class="linkish danger" data-act="del-samples">' + (ARMED.samples ? 'اضغط مجدداً لتأكيد حذف الأمثلة' : 'احذف الأمثلة') + '</button></p>' : '') +
  '</div>';
  var h = bar.offsetHeight || 128;
  app.style.paddingBottom = (h + 24) + 'px'; app.style.setProperty('--ab-h', h + 'px');
}
function busyPub() { if (PUBLISHING) { toast('انتظر حتى ينتهي النشر.', 'err'); return true; } return false; }
function arm(key, render) {
  if (ARMED[key]) { clearTimeout(ARMED[key]); ARMED[key] = 0; return true; }
  ARMED[key] = setTimeout(function () { ARMED[key] = 0; render(); }, 4000);
  render(); return false;
}
function enterAdmin() {
  return loadFromGitHub().then(function (data) {
    PUB = data; S = clone(PUB); IS_ADMIN = true; LOADED = true; LOAD_ERR = false;
    return draftLoad().then(function (d) {
      if (d && d.data && d.count) {
        if (d.base === CAT_SHA) { S = restoreData(d.data); PENDING = d.count; }
        else STALE = d;
      }
      renderAll();
    });
  });
}
function openLogin() {
  while (stack.length) closeLayer();
  LOGIN = { repo: (GH && GH.repo) || S.settings.repo || '', token: '', busy: false, err: '' };
  pushLayer('narrow', function () { LOGIN = null; }, 'login');
  renderLogin();
}
function renderLogin() {
  var sh = topSheet('login'); if (!sh || !LOGIN) return;
  sh.innerHTML = '<div class="sheet-head"><h2>إدارة الموقع</h2><button type="button" class="icon-btn" data-act="close" aria-label="إغلاق">' + ic('x') + '</button></div>' +
    '<div class="ed">' +
      '<p class="help">هذه الصفحة لصاحب الموقع فقط. الصق «مفتاح النشر» من GitHub مرة واحدة على هذا الجهاز، ويبقى محفوظاً فيه.</p>' +
      '<label class="field"><span>المستودع</span><input class="inp ltr" id="lg-repo" data-in="login" data-k="repo" value="' + esc(LOGIN.repo) + '" placeholder="username/ain-alaseel" autocomplete="off"></label>' +
      '<label class="field"><span>مفتاح النشر</span><input class="inp ltr" id="lg-token" data-in="login" data-k="token" type="password" value="' + esc(LOGIN.token) + '" placeholder="github_pat_…" autocomplete="off"></label>' +
      (LOGIN.err ? '<p class="err">' + esc(LOGIN.err) + '</p>' : '') +
      '<button type="button" class="btn btn-primary" data-act="login-go"' + (LOGIN.busy ? ' disabled' : '') + '>' + ic('key') + (LOGIN.busy ? 'جاري التحقق…' : 'دخول') + '</button>' +
    '</div>';
}
function doLogin() {
  var repo = String(LOGIN.repo || '').trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').replace(/\/$/, '');
  var token = String(LOGIN.token || '').trim();
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) { LOGIN.err = 'اكتب اسم المستودع بالشكل username/ain-alaseel.'; renderLogin(); return; }
  if (token.length < 20) { LOGIN.err = 'الصق مفتاح النشر كاملاً.'; renderLogin(); return; }
  LOGIN.busy = true; LOGIN.err = ''; renderLogin();
  GH = { repo: repo, token: token };
  fetch('https://api.github.com/repos/' + repo, { headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' }, cache: 'no-store' })
    .then(function (r) { if (!r.ok) { var e = new Error('x'); e.status = r.status; throw e; } return r.json(); })
    .then(function (info) {
      if (!info.permissions || !info.permissions.push) { var e = new Error('x'); e.status = 403; throw e; }
      lsSet('alaseel-gh', GH);
      return enterAdmin();
    })
    .then(function () { closeLayer(); ADMIN_ON = true; lsSet('alaseel-admin-on', true); renderAll(); toast('تم الدخول. يمكنك الآن إضافة المنتجات ونشرها.'); })
    .catch(function (e) { GH = null; if (LOGIN) { LOGIN.busy = false; LOGIN.err = ghErrText(e); renderLogin(); } });
}

/* ---------- loading ---------- */
var LOAD_ERR = false;
function loadPublic() {
  return fetch(CATALOG_PATH, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
    .then(function (d) { PUB = normalize(d); S = clone(PUB); LOADED = true; LOAD_ERR = false; });
}

/* ---------- events ---------- */
var ACT = {
  home: function () { while (stack.length) closeLayer(); view.sec = 'all'; view.q = ''; var q = $('#q'); if (q) q.value = ''; renderRail(); renderGrid(); window.scrollTo({ top: 0, behavior: 'smooth' }); },
  sec: function (t) {
    view.sec = t.dataset.id; renderRail(); renderGrid();
    var c = $('#catalog'); if (c && c.getBoundingClientRect().top > window.innerHeight * 0.45) c.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },
  reload: function () { LOAD_ERR = false; renderGrid(); start(); },
  'clear-q': function () { view.q = ''; var q = $('#q'); if (q) q.value = ''; renderGrid(); },
  open: function (t) { openProduct(t.dataset.id); },
  close: function () { closeLayer(); },
  cart: function () { while (stack.length) closeLayer(); openCart(); },
  guide: function () { openGuide(); },
  thumb: function (t) { PV.img = +t.dataset.i; renderProduct(); },
  size: function (t) { PV.size = PV.size === t.dataset.v && findP(PV.id).sizes.length > 1 ? '' : t.dataset.v; if (PV.err === 'size') PV.err = ''; renderProduct(); },
  color: function (t) {
    var p = findP(PV.id), c = p.colors.find(function (x) { return x.name === t.dataset.v; });
    PV.color = t.dataset.v; if (PV.err === 'color') PV.err = '';
    if (c && c.img >= 0 && c.img < p.images.length) PV.img = c.img;
    renderProduct();
  },
  qty: function (t) { PV.qty = Math.max(1, Math.min(99, PV.qty + (+t.dataset.d))); renderProduct(); },
  add: function () { addToCart(); },
  'pd-wa': function (t, e) { if (!pvValid()) { e.preventDefault(); return; } t.href = waLink(pvText()); },
  'line-qty': function (t) { var l = cart[+t.dataset.i]; if (!l) return; l.qty = Math.max(1, Math.min(99, l.qty + (+t.dataset.d))); saveCart(); renderCart(); },
  'line-del': function (t) { cart.splice(+t.dataset.i, 1); saveCart(); renderCart(); },
  send: function (t, e) {
    if (!String(cust.name || '').trim()) { e.preventDefault(); var n = $('#c-name'); n.classList.add('bad'); n.focus(); $('#send-err').hidden = false; return; }
    t.href = waLink(orderText(cart, cust));
    SENT = true; setTimeout(function () { var sh = topSheet('cart'); if (sh) { var y = sh.scrollTop; renderCart(); sh.scrollTop = y; } }, 400);
  },
  'copy-order': function () { copyText(orderText(cart, cust), 'نُسخ نص الطلب. الصقه في محادثة واتساب.'); },
  'copy-num': function () { copyText(S.settings.whatsappDisplay, 'نُسخ رقم واتساب.'); },
  'clear-cart': function () { if (arm('clear', renderCart)) { cart = []; saveCart(); renderCart(); toast('تم تفريغ السلة.'); } },
  login: function () { openLogin(); },
  'login-go': function () { doLogin(); },
  logout: function () { lsDel('alaseel-gh'); GH = null; IS_ADMIN = false; PENDING = 0; draftClear(); while (stack.length) closeLayer(); S = clone(PUB); renderAll(); toast('تم تسجيل الخروج من الإدارة على هذا الجهاز.'); },
  'admin-toggle': function () { ADMIN_ON = !ADMIN_ON; lsSet('alaseel-admin-on', ADMIN_ON); renderAll(); },
  new: function () { if (busyPub()) return; openEditor(null); },
  edit: function (t) { if (busyPub()) return; openEditor(t.dataset.id); },
  settings: function () { if (busyPub()) return; openSettings(); },
  publish: function () { publish(); },
  discard: function () { if (arm('discard', renderAdminBar)) { S = clone(PUB); PENDING = 0; draftClear(); renderAll(); toast('أُلغيت التغييرات غير المنشورة.'); } },
  'del-samples': function () { if (arm('samples', renderAdminBar)) { S.products = S.products.filter(function (p) { return !p.sample; }); changed('حُذفت المنتجات التجريبية.'); } },
  'stale-restore': function () { S = restoreData(STALE.data); PENDING = STALE.count || 1; STALE = null; draftSave(); renderAll(); toast('استُعيدت التغييرات. راجعها ثم اضغط «نشر».'); },
  'stale-drop': function () { STALE = null; draftClear(); renderAdminBar(); },
  /* editor */
  'ed-cancel': function () { closeLayer(); },
  'ed-status': function (t) { ED.status = t.dataset.v; renderEdStatus(); },
  'ed-img-main': function (t) {
    var i = +t.dataset.i, img = ED.images.splice(i, 1)[0]; ED.images.unshift(img);
    ED.colors.forEach(function (c) { if (c.img === i) c.img = 0; else if (c.img >= 0 && c.img < i) c.img++; });
    renderEdPhotos(); renderEdColors();
  },
  'ed-img-del': function (t) {
    var i = +t.dataset.i; ED.images.splice(i, 1);
    ED.colors.forEach(function (c) { if (c.img === i) c.img = -1; else if (c.img > i) c.img--; });
    renderEdPhotos(); renderEdColors();
  },
  'ed-kind': function (t) { ED._kind = t.dataset.v; renderEdSizes(); },
  'ed-size': function (t) {
    var v = t.dataset.v, i = ED.sizes.findIndex(function (s) { return s.label === v; });
    if (i >= 0) ED.sizes.splice(i, 1); else { ED.sizes.push({ label: v, price: '' }); sortSizes(); }
    renderEdSizes();
  },
  'ed-size-add': function () {
    var inp = $('#ed-size-new'), raw = String(inp.value || '').trim(); if (!raw) { inp.focus(); return; }
    var parts = [];
    raw.split(/[,،]+/).forEach(function (x) {
      x = x.trim(); if (!x) return;
      var m = arDigits(x).match(/^(\d{2,3})\s*[-–]\s*(\d{2,3})$/);
      if (m && +m[1] >= 20 && +m[2] > +m[1] && +m[2] - +m[1] <= 30) { for (var n = +m[1]; n <= +m[2]; n++) parts.push(String(n)); }
      else parts.push(x);
    });
    parts.forEach(function (v) { if (!ED.sizes.some(function (s) { return s.label === v; })) ED.sizes.push({ label: v, price: '' }); });
    sortSizes(); renderEdSizes(); var n2 = $('#ed-size-new'); if (n2) n2.focus();
  },
  'ed-size-del': function (t) { ED.sizes.splice(+t.dataset.i, 1); renderEdSizes(); },
  'ed-color': function (t) {
    var v = t.dataset.v, i = ED.colors.findIndex(function (c) { return c.name === v; });
    if (i >= 0) ED.colors.splice(i, 1);
    else { var pr = COLOR_PRESETS.find(function (c) { return c[0] === v; }); ED.colors.push({ name: v, hex: pr ? pr[1] : '#999999', img: -1 }); }
    renderEdColors();
  },
  'ed-color-add': function () {
    var n = $('#ed-color-name'), name = String(n.value || '').trim(), hex = $('#ed-color-hex').value;
    if (!name) { toast('اكتب اسم اللون أولاً.', 'err'); n.focus(); return; }
    if (ED.colors.some(function (c) { return c.name === name; })) { toast('هذا اللون مضاف مسبقاً.', 'err'); return; }
    ED.colors.push({ name: name, hex: hexOk(hex) ? hex : '#999999', img: -1 }); renderEdColors();
  },
  'ed-color-del': function (t) { ED.colors.splice(+t.dataset.i, 1); renderEdColors(); },
  'ed-save': function () { saveEditor(); },
  'ed-del': function () { ED._del = true; renderEdFoot(); },
  'ed-del-no': function () { ED._del = false; renderEdFoot(); },
  'ed-del-yes': function () { var id = ED.id; S.products = S.products.filter(function (p) { return p.id !== id; }); closeLayer(); changed('حُذف المنتج. اضغط «نشر على الموقع» لتطبيق الحذف.'); },
  /* settings */
  'st-cancel': function () { closeLayer(); },
  'st-save': function () { saveSettings(); },
  'st-logo-del': function () { ST.settings.logo = ''; renderSettings(); },
  'st-sec-add': function () {
    var inp = $('#st-sec-new'), name = String(inp.value || '').trim(); if (!name) { inp.focus(); return; }
    ST.sections.push({ id: 's' + Date.now().toString(36), name: name, kind: 'clothes' }); renderSettings();
  },
  'st-sec-del': function (t) { ST.sections.splice(+t.dataset.i, 1); renderSettings(); },
  'st-sec-move': function (t) {
    var i = +t.dataset.i, j = i + (+t.dataset.d); if (j < 0 || j >= ST.sections.length) return;
    var x = ST.sections[i]; ST.sections[i] = ST.sections[j]; ST.sections[j] = x; renderSettings();
  }
};
var INPUT = {
  q: function (t) { view.q = t.value; renderGrid(); },
  cust: function (t) { cust[t.dataset.k] = t.value; lsSet('alaseel-cust', cust); if (t.dataset.k === 'name' && t.value.trim()) { t.classList.remove('bad'); var e = $('#send-err'); if (e) e.hidden = true; } refreshSend(); },
  login: function (t) { if (LOGIN) LOGIN[t.dataset.k] = t.value; },
  ed: function (t) {
    if (!ED) return; ED[t.dataset.k] = t.value;
    if (t.dataset.k === 'section') { ED._kind = kindFor(t.value); renderEdSizes(); }
    if (t.classList.contains('bad') && t.value.trim()) t.classList.remove('bad');
  },
  'ed-sp': function (t) { if (ED && ED.sizes[+t.dataset.i]) ED.sizes[+t.dataset.i].price = t.value; },
  'ed-cimg': function (t) { if (ED && ED.colors[+t.dataset.i]) ED.colors[+t.dataset.i].img = +t.value; },
  st: function (t) { if (ST) ST.settings[t.dataset.k] = t.value; },
  'st-sec-name': function (t) { if (ST) ST.sections[+t.dataset.i].name = t.value; },
  'st-sec-kind': function (t) { if (ST) ST.sections[+t.dataset.i].kind = t.value; }
};
var CHANGE = {
  'ed-files': function (t) { addImages(t.files); t.value = ''; },
  'ed-persize': function (t) { if (ED) { ED.perSize = t.checked; renderEdSizes(); } },
  'st-logo': function (t) {
    var f = t.files && t.files[0]; if (!f || !ST) return;
    processLogo(f).then(function (d) { if (ST) { ST.settings.logo = d; renderSettings(); } }, function () { toast('تعذّر فتح صورة الشعار. جرّب JPG أو PNG.', 'err'); });
  }
};

function start() {
  var h = String(location.hash || '').slice(1);
  var go = GH && GH.token && GH.repo ? enterAdmin().catch(function (e) {
    if (e && (e.status === 401 || e.status === 404)) { lsDel('alaseel-gh'); GH = null; toast(ghErrText(e), 'err'); }
    return loadPublic();
  }) : loadPublic();
  go.then(function () {
    if (h && S.sections.some(function (s) { return s.id === h; })) view.sec = h;
    renderAll();
    if (h && findP(h)) openProduct(h);
    if (h === 'admin' && !IS_ADMIN) openLogin();
  }, function () { LOAD_ERR = true; renderGrid(); });
}
function boot() {
  var app = document.getElementById('app');
  app.innerHTML = '<header class="top" id="hdr"></header><section class="hero" id="hero"></section><main class="wrap cat" id="catalog"></main><footer class="foot" id="foot"></footer><div id="layers"></div><div class="toast" id="toast" role="status" aria-live="polite"></div><div class="adminbar" id="adminbar" hidden></div>';
  renderCatalogShell(); renderAll();

  app.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t || !app.contains(t) || t.disabled) return;
    var f = ACT[t.dataset.act]; if (f) f(t, e);
  });
  app.addEventListener('input', function (e) {
    var t = e.target, k = t.dataset && t.dataset.in; if (!k || t.type === 'file' || t.type === 'checkbox') return;
    var f = INPUT[k]; if (f) f(t, e);
  });
  app.addEventListener('change', function (e) {
    var t = e.target, k = t.dataset && t.dataset.in; if (!k) return;
    if (CHANGE[k]) CHANGE[k](t, e);
    else if (t.tagName === 'SELECT' && INPUT[k]) INPUT[k](t, e);
  });
  app.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && stack.length && !stack[stack.length - 1].el._sticky) closeLayer();
    if (e.key === 'Enter' && e.target.id === 'ed-size-new') { e.preventDefault(); ACT['ed-size-add'](); }
    if (e.key === 'Enter' && e.target.id === 'ed-color-name') { e.preventDefault(); ACT['ed-color-add'](); }
    if (e.key === 'Enter' && e.target.id === 'st-sec-new') { e.preventDefault(); ACT['st-sec-add'](); }
    if (e.key === 'Enter' && (e.target.id === 'lg-token' || e.target.id === 'lg-repo')) { e.preventDefault(); doLogin(); }
  });
  document.addEventListener('paste', function (e) {
    if (!ED) return;
    var items = (e.clipboardData && e.clipboardData.items) || [], files = [];
    for (var i = 0; i < items.length; i++) if (items[i].kind === 'file' && /^image\//.test(items[i].type)) { var f = items[i].getAsFile(); if (f) files.push(f); }
    if (files.length) { e.preventDefault(); addImages(files); }
  });
  app.addEventListener('dragover', function (e) { var z = e.target.closest && e.target.closest('#ph-drop'); if (!z) return; e.preventDefault(); z.classList.add('drag'); });
  app.addEventListener('dragleave', function (e) { var z = e.target.closest && e.target.closest('#ph-drop'); if (z) z.classList.remove('drag'); });
  app.addEventListener('drop', function (e) { var z = e.target.closest && e.target.closest('#ph-drop'); if (!z) return; e.preventDefault(); z.classList.remove('drag'); addImages(e.dataTransfer && e.dataTransfer.files); });
  window.addEventListener('hashchange', function () { if (location.hash === '#admin' && !IS_ADMIN) openLogin(); });

  start();
}
boot();
})();
