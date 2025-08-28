document.addEventListener("DOMContentLoaded", function() {
  var overlay = document.getElementById('lightbox-overlay');
  var fullImg = document.getElementById('lightbox-img');

  document.querySelectorAll('.event-poster-img').forEach(function(img) {
    console.log(img);
    img.addEventListener('click', function() {
      fullImg.src = img.getAttribute('data-full');
      overlay.style.display = 'flex';
    });
  });
  overlay.addEventListener('click', function() {
    overlay.style.display = 'none';
    fullImg.src = '';
  });
});
