// simple client-side enhancement
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      // just highlight clicked product
      card.style.background = '#f0fbff';
      setTimeout(()=> card.style.background = '', 400);
    });
  });
});
