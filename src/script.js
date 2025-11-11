
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

/*************** CHALLENGES – Ladda från API och rendera ***************/
const CH_API_URL = "https://exempel.se/api/challenges"; // <-- byt till er riktiga endpoint

// Fallback så du kan testa direkt innan API:t är klart:
const CH_MOCK = [
  {
    titel: "Title of room (on-site)",
    beskrivning: "Praeterea, ex culpa non invenies unum aut non accusatis unum...",
    typ: "on-site",
    minDeltagare: 2,
    maxDeltagare: 6,
    rating: 4.2,
    bildUrl: "images/image 2 (2).png",
    etiketter: ["team", "puzzle"],
    url: "#"
  },
  {
    titel: "Title of room (on-site)",
    beskrivning: "Praeterea, ex culpa non invenies unum aut non accusatis unum...",
    typ: "on-site",
    minDeltagare: 2,
    maxDeltagare: 6,
    rating: 4.0,
    bildUrl: "images/image 2 (3).png",
    etiketter: ["adventure"],
    url: "#"
  },
  {
    titel: "Title of room (online)",
    beskrivning: "Praeterea, ex culpa non invenies unum aut non accusatis unum...",
    typ: "online",
    minDeltagare: 1,
    maxDeltagare: 4,
    rating: 3.8,
    bildUrl: "images/image 2 (4).png",
    etiketter: ["online"],
    url: "#"
  }
];

// Hjälpare: acceptera både svenska/engelska fältnamn om API:t ändras
function norm(ch) {
  return {
    title: ch.title ?? ch.titel ?? "",
    description: ch.description ?? ch.beskrivning ?? "",
    type: (ch.type ?? ch.typ ?? "").toLowerCase(),                // "online" | "on-site"
    minP: ch.minParticipants ?? ch.minDeltagare ?? 1,
    maxP: ch.maxParticipants ?? ch.maxDeltagare ?? 1,
    rating: Number(ch.rating ?? 0),
    image: ch.imageUrl ?? ch.bildUrl ?? "",
    labels: ch.labels ?? ch.etiketter ?? [],
    url: ch.url ?? "#"
  };
}

// Stjärnor (0–5)
function renderStars(val) {
  const r = Math.max(0, Math.min(5, Math.round(Number(val) || 0)));
  return "★ ".repeat(r) + "☆ ".repeat(5 - r);
}

// Bygg ett kort från template
function buildCard(ch) {
  const t = document.getElementById("challenge-card-template");
  const node = t.content.firstElementChild.cloneNode(true);

  const n = norm(ch);

  // Bild
  const img = node.querySelector(".CardImage");
  img.src = n.image || "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='22' fill='%239ca3af'>No image</text></svg>";
  img.alt = n.title;

  // Titel + typ i parentes enligt din design
  const title = node.querySelector(".CardTitle");
  const typeLabel = n.type === "online" ? "online" : "on-site";
  title.textContent = `${n.title} (${typeLabel})`;

  // Stjärnor + deltagare
  node.querySelector(".Stars").textContent = renderStars(n.rating);
  node.querySelector(".Participants").textContent = `${n.minP}–${n.maxP} participants`;

  // Beskrivning
  node.querySelector(".CardDesc").textContent = n.description;

  // CTA – text beroende på typ
  const cta = node.querySelector(".CardCta");
  cta.textContent = n.type === "online" ? "Take challenge online" : "Book this room";
  cta.addEventListener("click", () => {
    if (n.url && n.url !== "#") window.open(n.url, "_blank", "noopener");
  });

  return node;
}

// Rendera listan
function renderChallenges(list) {
  const host = document.getElementById("chList");
  const status = document.getElementById("chStatus");
  host.innerHTML = "";
  if (!list || !list.length) {
    status.textContent = "Inga challenges hittades.";
    return;
  }
  status.textContent = "";
  const frag = document.createDocumentFragment();
  list.forEach(ch => frag.appendChild(buildCard(ch)));
  host.appendChild(frag);
}

// Hämta från API – fall tillbaka till MOCK om det misslyckas
async function loadChallenges() {
  const status = document.getElementById("chStatus");
  status.textContent = "Laddar…";
  try {
    const res = await fetch(CH_API_URL, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.items ?? []);

    //Sortera listan efter rating (5 → 0)
    items.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    
    //Hitta första "online" och flytta till index 0
    const idx = items.findIndex(ch => (ch.type ?? ch.typ ?? "").toLowerCase() === "online");
    if (idx > 0) {
      items.unshift(items.splice(idx, 1)[0]);
    }


    //Om du bara vill visa de tre högsta på startsidan:
    const topThree = items.slice(0, 3);

    renderChallenges(topThree);

  } catch (err) {
    console.warn("Kunde inte hämta API, använder CH_MOCK. Orsak:", err);
    CH_MOCK.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    const idx = CH_MOCK.findIndex(ch => (ch.type ?? ch.typ ?? "").toLowerCase() === "online");
    if (idx > 0) {
      CH_MOCK.unshift(CH_MOCK.splice(idx, 1)[0]);
    }
    renderChallenges(CH_MOCK.slice(0, 3));
  }
}

document.addEventListener("DOMContentLoaded", loadChallenges);
// Öppna "alla challenges"-sidan i ny flik
document.querySelector('.OnlineButton')?.addEventListener('click', () => {
  window.open('all-challenges.html?type=online', '_blank', 'noopener');
});
document.querySelector('.OnsiteButton')?.addEventListener('click', () => {
  window.open('all-challenges.html?type=on-site', '_blank', 'noopener');
});
