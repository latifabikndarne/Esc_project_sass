
  const menuBtn  = document.getElementById('menuButton');
const overlay  = document.getElementById('menuOverlay');
const closeBtn = overlay.querySelector('.overlay-close');



function openMenu() {
  menuBtn.setAttribute('aria-expanded', 'true');

  overlay.classList.add('open');
  overlay.hidden = false;

  
  requestAnimationFrame(() => {
    overlay.classList.remove('closing');
    overlay.classList.add('open');
  });

  document.body.classList.add('no-scroll');
  document.body.classList.add('blurred');

  const firstItem = overlay.querySelector('[role="menuitem"] a');
  if (firstItem) firstItem.focus();
}

function closeMenu() {
  menuBtn.setAttribute('aria-expanded', 'false');

  document.body.classList.remove('blurred', 'no-scroll');
  overlay.classList.remove('open');
  overlay.classList.add('closing');


  const onAnimEnd = (e) => {
    if (e.target !== overlay) return;
    overlay.removeEventListener('animationend', onAnimEnd);
    overlay.classList.remove('closing');
    overlay.hidden = true;                 
    document.body.classList.remove('no-scroll');
    menuBtn.focus();
  };
  overlay.addEventListener('animationend', onAnimEnd);
}

function toggleMenu() {
  const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
  (isOpen ? closeMenu : openMenu)();
}


menuBtn.addEventListener('click', toggleMenu);
menuBtn.addEventListener('keydown', e=> {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
});


closeBtn.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !overlay.hidden) closeMenu();
});


overlay.addEventListener('click', e => {
  if (e.target === overlay) closeMenu();
});
