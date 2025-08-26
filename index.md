---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

# Events 2

<div class="event-list">
  {% for event in site.data.events %}
    <div class="event-card">
      <div class="event-poster">
        <img src="assets/img/{{ event.image | default: 'logo.webp' }}" alt="Poster for {{ event.title }}">
      </div>
      <div class="event-details">
        <h2>{{ event.title }}</h2>
        <p><strong>Date:</strong> {{ event.date }}</p>
        <p><strong>Venue:</strong> {{ event.venue }}</p>
        <a class="event-link" href="{{ event.url }}">More info</a>
      </div>
    </div>
  {% endfor %}
</div>
