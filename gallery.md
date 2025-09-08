---
layout: page
title: Photo Gallery
permalink: /gallery/
---

<script>
document.addEventListener("DOMContentLoaded", function() {
  var overlay = document.getElementById('gallery-lightbox');
  var fullImg = document.getElementById('lightbox-img');
  document.querySelectorAll('.gallery-thumb').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      fullImg.src = link.href;
      overlay.style.display = 'flex';
    });
  });
  overlay.addEventListener('click', function() {
    overlay.style.display = 'none';
    fullImg.src = '';
  });
});
</script>

<div id="gallery-lightbox" class="lightbox-overlay" style="display:none;">
  <img id="lightbox-img" src="" alt="Full gallery image">
</div>

<div class="image-gallery">
  {% for file in site.static_files %}
    {% if file.path contains 'assets/img/gallery/' %}
      <a href="{{ file.path }}" class="gallery-thumb" target="_blank">
        <img src="{{ file.path }}" alt="Gallery image">
      </a>
    {% endif %}
  {% endfor %}
</div>
