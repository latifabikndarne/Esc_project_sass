


const CH_API_URL = "https://exempel.se/api/challenges"; // byt till riktig

const CH_MOCK = [
  { titel:"Title of room (on-site)", beskrivning:"...", typ:"on-site", minDeltagare:2, maxDeltagare:6, rating:4.2, bildUrl:"images/image 2 (2).png", url:"#"},
  { titel:"Title of room (on-site)", beskrivning:"...", typ:"on-site", minDeltagare:2, maxDeltagare:6, rating:4.0, bildUrl:"images/image 2 (3).png", url:"#"},
  { titel:"Title of room (online)",  beskrivning:"...", typ:"online",  minDeltagare:1, maxDeltagare:4, rating:3.8, bildUrl:"images/image 2 (4).png", url:"#"}
];

// ---- samma helpers som du redan har ----
function norm(ch){ return {
  title: ch.title ?? ch.titel ?? "",
  description: ch.description ?? ch.beskrivning ?? "",
  type: (ch.type ?? ch.typ ?? "").toLowerCase(),
  minP: ch.minParticipants ?? ch.minDeltagare ?? 1,
  maxP: ch.maxParticipants ?? ch.maxDeltagare ?? 1,
  rating: Number(ch.rating ?? 0),
  image: ch.imageUrl ?? ch.bildUrl ?? "",
  labels: ch.labels ?? ch.etiketter ?? [],
  url: ch.url ?? "#"
};}
function renderStars(val){
  const r = Math.max(0, Math.min(5, Math.round(Number(val)||0)));
  return "★ ".repeat(r) + "☆ ".repeat(5-r);
}
function buildCard(ch){
  const t = document.getElementById("challenge-card-template");
  const node = t.content.firstElementChild.cloneNode(true);
  const n = norm(ch);

  const img = node.querySelector(".CardImage");
  img.src = n.image || "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='22' fill='%239ca3af'>No image</text></svg>";
  img.alt = n.title;

  const typeLabel = n.type === "online" ? "online" : "on-site";
  node.querySelector(".CardTitle").textContent = `${n.title} (${typeLabel})`;
  node.querySelector(".Stars").textContent = renderStars(n.rating);
  node.querySelector(".Participants").textContent = `${n.minP}–${n.maxP} participants`;
  node.querySelector(".CardDesc").textContent = n.description;

  const cta = node.querySelector(".CardCta");
  cta.textContent = n.type === "online" ? "Take challenge online" : "Book this room";
  cta.addEventListener("click", () => { if(n.url && n.url !== "#") window.open(n.url, "_blank", "noopener"); });

  return node;
}
function renderAll(list){
  const host = document.getElementById("allList");
  const status = document.getElementById("allStatus");
  host.innerHTML = "";
  if(!list || !list.length){ status.textContent = "Inga challenges hittades."; return; }
  status.textContent = "";
  const frag = document.createDocumentFragment();
  list.forEach(ch => frag.appendChild(buildCard(ch)));
  host.appendChild(frag);
}

async function loadAll(){
  const status = document.getElementById("allStatus");
  status.textContent = "Laddar…";

  // valfritt filter via ?type=online | on-site
  const typeParam = (new URLSearchParams(location.search).get("type") || "").toLowerCase();

  const prepare = (arr) => {
    // sortera 5→0
    let items = [...arr].sort((a,b) => (b.rating ?? 0) - (a.rating ?? 0));
    // filtrera om param finns
    if(typeParam) items = items.filter(x => ((x.type ?? x.typ ?? "").toLowerCase() === typeParam));
    return items;
  };

  try{
    const res = await fetch(CH_API_URL, { headers: { "Accept":"application/json" } });
    if(!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.items ?? []);
    renderAll(prepare(items));
  }catch(err){
    console.warn("API misslyckades, använder CH_MOCK.", err);
    renderAll(prepare(CH_MOCK));
  }
}

document.addEventListener("DOMContentLoaded", loadAll);

