---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
title: Events
permalink: /
---

<div class="event-list">
  {% for event in site.data.events %}
    <div class="event-card">
      <div class="event-poster">
        <img
          src="assets/img/{{ event.image | default: 'logo.webp' }}"
          alt="Poster for {{ event.title }}"
          class="event-poster-img"
          data-full="/assets/img/{{ event.image | default: 'logo.webp' }}"
        >
      </div>
      <div class="event-details">
        <h2>{{ event.title }}</h2>
        <p><strong>Date:</strong> {{ event.date }}</p>
        <p><strong>Venue:</strong> {{ event.venue }}</p>

        {% if event.url %}
            <a class="event-link" href="{{ event.url }}">More info</a>
        {% endif %}
      </div>
    </div>
  {% endfor %}
</div>
