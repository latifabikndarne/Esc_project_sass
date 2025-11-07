
const menuBtn = document.getElementById('menuButton');
const overlay = document.getElementById('menuOverlay');
const closeBtn = overlay ? overlay.querySelector('.overlay-close') : null;

let justOpened = false; // skydd mot att öppningsklicket stänger direkt

function openMenu() {
  menuBtn.setAttribute('aria-expanded', 'true');
  overlay.hidden = false;
  document.body.classList.add('no-scroll', 'blurred');

  // nollställ ev. tidigare tillstånd
  overlay.classList.remove('closing', 'open');

  // tvinga reflow så att öppningsanimation kan starta om
  void overlay.offsetWidth;

  // lägg på open i nästa frame
  requestAnimationFrame(() => {
    overlay.classList.add('open');
  });

  // ignorera första klicket på overlay precis efter öppning
  justOpened = true;
  setTimeout(() => { justOpened = false; }, 200);

  const firstItem = overlay.querySelector('[role="menuitem"] a');
  if (firstItem) firstItem.focus();
}

function closeMenu() {
  menuBtn.setAttribute('aria-expanded', 'false');

  // stäng direkt (vi förlitar oss inte på animationend)
  overlay.classList.remove('open', 'closing');
  overlay.hidden = true;

  document.body.classList.remove('no-scroll', 'blurred');
  menuBtn.focus();
}

function toggleMenu() {
  const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
  (isOpen ? closeMenu : openMenu)();
}

// ==== events ====
menuBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // extra säkerhet mot bubbla
  toggleMenu();
});
menuBtn.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
});

if (closeBtn) closeBtn.addEventListener('click', closeMenu);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !overlay.hidden) closeMenu();
});

// Stäng på klick i bakgrunden – men låt första klicket efter öppning passera
overlay.addEventListener('click', e => {
  if (justOpened) return;
  if (e.target === overlay) closeMenu();
});
