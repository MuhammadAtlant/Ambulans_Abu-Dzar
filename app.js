'use strict';
const config = window.SITE_CONFIG || {};
const $ = (selector) => document.querySelector(selector);
document.querySelectorAll('[data-brand]').forEach(el => { el.textContent = config.name || 'Ambulans Abu Dzar'; });
document.title = `${config.name || 'Ambulans Abu Dzar'} — Melayani Dengan Sepenuh Hati`;
$('#year').textContent = new Date().getFullYear();

const menuButton = $('.menu-button');
const mobileNav = $('#mobile-nav');
function closeMenu(){ mobileNav.hidden = true; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Buka menu'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; mobileNav.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu'); });
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if(e.key==='Escape') closeMenu(); });
document.addEventListener('click', e => { if(!e.target.closest('.site-header')) closeMenu(); });
matchMedia('(min-width:901px)').addEventListener('change', e => { if(e.matches) closeMenu(); });
const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const observedSections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const observer = new IntersectionObserver(entries => { const visible = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0]; if(!visible) return; navLinks.forEach(a => { const active = a.hash === `#${visible.target.id}`; a.classList.toggle('active',active); if(active) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); }); }, {rootMargin:'-20% 0px -55% 0px',threshold:0});
observedSections.forEach(section => observer.observe(section));

const whatsapp = String(config.whatsapp || '').replace(/\D/g,'');
if(/^\d{10,15}$/.test(whatsapp)){
  if ($('#contact-number')) $('#contact-number').textContent = config.whatsappDisplay || `+${whatsapp}`;
  const contact = $('#whatsapp-contact');
  contact.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent('Halo, saya ingin menanyakan informasi layanan ambulans gratis.')}`;
  contact.target = '_blank'; contact.rel = 'noopener noreferrer'; contact.hidden = false;
  if ($('#contact-note')) $('#contact-note').textContent = 'Ketersediaan armada dan jadwal dikonfirmasi melalui relawan.';
}
if(config.address) $('#location-address').textContent = config.address;
const mapsQuery = encodeURIComponent(config.mapsQuery || config.address || 'Tangerang Selatan');
$('#maps-link').href = config.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
$('#location-map').src = `https://maps.google.com/maps?q=${mapsQuery}&z=${config.mapIsExample ? 12 : 17}&output=embed`;
$('#location-map').title = config.mapIsExample ? 'Google Maps — lokasi contoh' : `Google Maps — ${config.name || 'Posko ambulans'}`;
if(!config.mapIsExample) $('#location-note').textContent = 'Lihat titik lokasi dan rute perjalanan melalui Google Maps.';

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if(e.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close(); });
  dialog.addEventListener('close', () => { document.body.style.overflow=''; });
});
function openDialog(dialog){ dialog.showModal(); document.body.style.overflow='hidden'; }
const galleries = Array.isArray(config.galleries) ? config.galleries : [];
const galleryDialog = $('#gallery-dialog');
const galleryImage = $('#gallery-dialog-image');
let activeGallery = null;
let galleryIndex = 0;
function galleryCount(items) {
  const illustrations = items.filter(item => item.type === 'illustration').length;
  const photos = items.length - illustrations;
  return [photos ? `${photos} foto` : '', illustrations ? `${illustrations} ilustrasi sementara` : ''].filter(Boolean).join(' · ') || 'Belum ada foto';
}
function renderGallery() {
  const items = activeGallery.items;
  const item = items[galleryIndex];
  $('#gallery-dialog-title').textContent = activeGallery.title;
  galleryImage.hidden = !item;
  $('#gallery-empty').hidden = Boolean(item);
  $('#gallery-controls').hidden = items.length === 0;
  $('#gallery-prev').disabled = items.length < 2;
  $('#gallery-next').disabled = items.length < 2;
  $('#gallery-position').textContent = item ? `${galleryIndex + 1} / ${items.length}` : '';
  if (!item) {
    galleryImage.removeAttribute('src');
    galleryImage.alt = '';
    $('#gallery-dialog-description').textContent = 'Dokumentasi kegiatan ini belum tersedia.';
    return;
  }
  galleryImage.src = item.image;
  galleryImage.alt = item.alt || activeGallery.title;
  $('#gallery-dialog-description').textContent = [item.type === 'illustration' ? 'Ilustrasi sementara' : '', item.caption].filter(Boolean).join(' · ');
}
document.querySelectorAll('[data-gallery]').forEach(button => {
  const album = galleries.find(item => item.id === button.dataset.gallery);
  if (!album) { button.disabled = true; return; }
  const cover = album.items[0];
  const preview = button.querySelector('[data-gallery-cover]');
  button.querySelector('[data-gallery-name]').textContent = album.title;
  button.querySelector('[data-gallery-count]').textContent = galleryCount(album.items);
  button.querySelector('[data-gallery-placeholder]').hidden = Boolean(cover);
  button.querySelector('[data-gallery-sample]').hidden = cover?.type !== 'illustration';
  preview.hidden = !cover;
  if (cover) { preview.src = cover.image; preview.alt = cover.alt || album.title; }
  else { preview.removeAttribute('src'); preview.alt = ''; }
  button.setAttribute('aria-label', `Buka galeri ${album.title}, ${galleryCount(album.items)}`);
  button.addEventListener('click', () => {
    activeGallery = album;
    galleryIndex = 0;
    renderGallery();
    openDialog(galleryDialog);
  });
});
function stepGallery(direction) {
  const count = activeGallery?.items.length || 0;
  if (count < 2) return;
  galleryIndex = (galleryIndex + direction + count) % count;
  renderGallery();
}
$('#gallery-prev').addEventListener('click', () => stepGallery(-1));
$('#gallery-next').addEventListener('click', () => stepGallery(1));
galleryDialog.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
    stepGallery(e.key === 'ArrowLeft' ? -1 : 1);
  }
});
let galleryTouch = null;
galleryImage.addEventListener('touchstart', e => {
  galleryTouch = e.touches.length === 1 ? {x:e.touches[0].clientX, y:e.touches[0].clientY} : null;
}, {passive:true});
galleryImage.addEventListener('touchend', e => {
  if (!galleryTouch || e.touches.length) { galleryTouch = null; return; }
  const deltaX = e.changedTouches[0].clientX - galleryTouch.x;
  const deltaY = e.changedTouches[0].clientY - galleryTouch.y;
  galleryTouch = null;
  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) stepGallery(deltaX < 0 ? 1 : -1);
}, {passive:true});
galleryImage.addEventListener('touchcancel', () => { galleryTouch = null; });
galleryDialog.addEventListener('close', () => { galleryTouch = null; });

// Rekening mengikuti site-config.js jika diisi; jika kosong, gunakan teks HTML.
const bank = config.donation || {};
const configuredAccount = String(bank.account || '').replace(/\D/g, '');
if (configuredAccount) {
  const display = String(bank.accountDisplay || '').trim();
  const accountText = display.replace(/\D/g, '') === configuredAccount ? display : configuredAccount;
  document.querySelectorAll('[data-bank-account]').forEach(el => { el.textContent = accountText; });
}
if (typeof bank.holder === 'string' && bank.holder.trim()) {
  document.querySelectorAll('[data-bank-holder]').forEach(el => { el.textContent = bank.holder.trim(); });
}

// QRIS harus menggunakan gambar pembayaran resmi milik pengelola ambulans.
const qrisImage = $('#donation-qris-image');
const qrisFigure = $('#donation-qris-figure');
const qrisStatus = $('#donation-qris-status');
if (qrisImage && qrisFigure && qrisStatus) {
  const showQris = () => {
    qrisFigure.hidden = false;
    qrisStatus.hidden = true;
  };
  const hideQris = () => {
    qrisFigure.hidden = true;
    qrisStatus.hidden = false;
    qrisStatus.textContent = 'QRIS belum tersedia. Anda dapat transfer ke rekening di atas.';
  };
  qrisImage.addEventListener('load', showQris);
  qrisImage.addEventListener('error', hideQris);
  const configuredQr = typeof bank.qrImage === 'string' ? bank.qrImage.trim() : '';
  qrisStatus.textContent = 'Memuat QRIS…';
  qrisImage.src = configuredQr || qrisImage.getAttribute('src') || 'assets/qris-ambulans.png';
  if (qrisImage.complete) {
    if (qrisImage.naturalWidth > 0) showQris();
    else hideQris();
  }
}

function copyWithSelection(text) {
  const previousFocus = document.activeElement;
  const selection = window.getSelection();
  const previousRanges = [];
  if (selection) {
    for (let i = 0; i < selection.rangeCount; i++) previousRanges.push(selection.getRangeAt(i).cloneRange());
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.readOnly = true;
  textarea.style.cssText = 'position:fixed;left:-9999px;top:0;font-size:16px;opacity:0';
  document.body.appendChild(textarea);
  let copied = false;
  try {
    textarea.focus({ preventScroll: true });
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    copied = document.execCommand('copy');
  } catch (_) {
    copied = false;
  } finally {
    textarea.remove();
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus({ preventScroll: true });
    if (selection) {
      selection.removeAllRanges();
      previousRanges.forEach(range => selection.addRange(range));
    }
  }
  return copied;
}

async function copyText(text) {
  if (window.isSecureContext && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      // Browser dapat menolak clipboard; coba penyalinan melalui seleksi teks.
    }
  }
  return copyWithSelection(text);
}

document.querySelectorAll('[data-copy-account]').forEach(button => {
  const label = button.querySelector('[data-copy-label]');
  const originalLabel = label ? label.textContent : '';
  let resetLabel;
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copyTarget || 'donation-account-number');
    const status = document.getElementById(button.dataset.copyStatus || 'donation-copy-status');
    // Salin rekening yang tampil, tanpa spasi agar mudah ditempel di aplikasi bank.
    const text = target ? target.textContent.replace(/\D/g, '') : '';
    if (!text) {
      if (status) status.textContent = 'Nomor rekening belum tersedia.';
      return;
    }
    clearTimeout(resetLabel);
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    if (status) status.textContent = '';
    const copied = await copyText(text);
    button.disabled = false;
    button.removeAttribute('aria-busy');
    if (copied) {
      if (label) label.textContent = 'Tersalin';
      if (status) status.textContent = `Nomor rekening ${text} berhasil disalin.`;
      resetLabel = setTimeout(() => { if (label) label.textContent = originalLabel; }, 2000);
    } else {
      if (label) label.textContent = originalLabel;
      if (status) status.textContent = 'Penyalinan otomatis diblokir browser. Pilih nomor rekening di atas, lalu salin secara manual.';
    }
  });
});
