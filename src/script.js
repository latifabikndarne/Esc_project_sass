
  const menuBtn  = document.getElementById('menuButton');
  const overlay  = document.getElementById('menuOverlay');
  const closeBtn = overlay.querySelector('.overlay-close');

  function openMenu() {
    menuBtn.setAttribute('aria-expanded', 'true');
    overlay.hidden = false;
    document.body.classList.add('no-scroll');
    const firstItem = overlay.querySelector('[role="menuitem"] a');
    firstItem && firstItem.focus();
  }

  function closeMenu() {
    menuBtn.setAttribute('aria-expanded', 'false');
    overlay.hidden = true;
    document.body.classList.remove('no-scroll');
    menuBtn.focus();
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) closeMenu(); });

  // Klick på bakgrunden stänger
  overlay.addEventListener('click', e => { if (e.target === overlay) closeMenu();   

  });


