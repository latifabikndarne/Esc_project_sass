
  const menuBtn  = document.getElementById('menuButton');
const overlay  = document.getElementById('menuOverlay');
const closeBtn = overlay.querySelector('.overlay-close');

// Viktigt: overlay ska INTE vara display:none i CSS.
// Basen ska vara synlig men osynlig (opacity:0, pointer-events:none).
// Animationen triggas med klasserna .open och .closing.

function openMenu() {
  menuBtn.setAttribute('aria-expanded', 'true');

  // 1) gör den möjlig att visas (ta bort hidden om du använder det)
  overlay.hidden = false;

  // 2) trigga CSS @keyframes genom att lägga på .open
  //    requestAnimationFrame säkrar att browsern hinner registrera state
  requestAnimationFrame(() => {
    overlay.classList.remove('closing');
    overlay.classList.add('open');
  });

  document.body.classList.add('no-scroll');

  const firstItem = overlay.querySelector('[role="menuitem"] a');
  if (firstItem) firstItem.focus();
}

function closeMenu() {
  menuBtn.setAttribute('aria-expanded', 'false');

  // Kör ut-animationen
  overlay.classList.remove('open');
  overlay.classList.add('closing');

  // När ut-animationen är klar → göm, städa klasser
  const onAnimEnd = (e) => {
    if (e.target !== overlay) return;
    overlay.removeEventListener('animationend', onAnimEnd);
    overlay.classList.remove('closing');
    overlay.hidden = true;                 // nu får den “försvinna på riktigt”
    document.body.classList.remove('no-scroll');
    menuBtn.focus();
  };
  overlay.addEventListener('animationend', onAnimEnd);
}

function toggleMenu() {
  const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
  (isOpen ? closeMenu : openMenu)();
}

// Öppna
menuBtn.addEventListener('click', toggleMenu);
menuBtn.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
});

// Stäng
closeBtn.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !overlay.hidden) closeMenu();
});

// Klick på bakgrunden stänger
overlay.addEventListener('click', e => {
  if (e.target === overlay) closeMenu();
});
