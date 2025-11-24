---
layout: page
title: Photo Gallery
permalink: /gallery/
---

<script>
document.addEventListener("DOMContentLoaded", function() {
  var overlay = document.getElementById('gallery-lightbox');
  var fullImg = document.getElementById('lightbox-img');

  var all_images = [];
  var max_index = 0;
  var image_offset = 0;

  const load_image = (i) => {
    fullImg.src = all_images[i];
    overlay.style.display = 'flex';
    image_offset = i;
  };

  document.querySelectorAll('.gallery-thumb').forEach(function(link, i) {
    var full_img = link.href.replace(/\/tn-/, '/');
    max_index = i;
    all_images[i] = full_img;
    link.addEventListener('click', function(e) {
      e.preventDefault();
      load_image(i);
    });
  });

  overlay.addEventListener('click', function() {
    overlay.style.display = 'none';
    fullImg.src = '';
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      overlay.style.display = 'none';
      fullImg.src = '';
    } else if (event.key === "ArrowLeft") {
      // handle left
      console.log("Left arrow");

      if(image_offset > 0) {
        load_image(image_offset - 1);
      }
    } else if (event.key === "ArrowRight") {
      // handle right
      console.log("Right arrow");

      if(image_offset < max_index) {
        load_image(image_offset + 1);
      }
    }
  });
});
</script>

<div id="gallery-lightbox" class="lightbox-overlay" style="display:none;">
  <img id="lightbox-img" src="" alt="Full gallery image">
</div>

<div class="image-gallery">
  {% for file in site.static_files %}
    {% if file.path contains 'assets/img/gallery/' %}
      {% if file.path contains 'tn-' %}
        <a href="{{ file.path }}" class="gallery-thumb" target="_blank">
          <img src="{{ file.path }}" alt="Gallery image">
        </a>
      {% endif %}
    {% endif %}
  {% endfor %}
</div>
