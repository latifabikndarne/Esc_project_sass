// Öppna "alla challenges"-sidan i ny flik, med filter via querystring
document.querySelector('.OnlineButton')?.addEventListener('click', () => {
  window.open('all-challenges.html?type=online', '_blank', 'noopener');
});
document.querySelector('.OnsiteButton')?.addEventListener('click', () => {
  window.open('all-challenges.html?type=on-site', '_blank', 'noopener');
});
