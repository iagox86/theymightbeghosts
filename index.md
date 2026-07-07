---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
permalink: /
keywords:
- Seattle
- Indie
- Improv
- They Might Be Ghosts

description: Upcoming events
---

<div class="home-layout">
  <div class="home-main">
    <div class="cta-banner">
      <p>Interested in performing at one of our shows?</p>
      <a class="cta-button" href="https://forms.gle/DPf2o3YCnerusMyw8" target="_blank" rel="noopener">Fill out this form!</a>
    </div>

    <div id="all-events" hidden>
      {% for event in site.data.events.shows %}
        <div class="event-card" data-datetime="{{ event.date | date_to_xmlschema }}" data-doors="{{ event.doors }}">
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
            <p><strong>Date:</strong> <span class="event-date"></span></p>

            {% if event.venue_url %}
              <p><strong>Venue:</strong> <a href="{{ event.venue_url }}">{{ event.venue }}</a></p>
            {% else %}
              <p><strong>Venue:</strong> {{ event.venue }}</p>
            {% endif %}

            {% if event.details %}
              <p><strong>Details:</strong> {{ event.details }}</p>
            {% endif %}

            {% if event.url %}
                <a class="event-link" href="{{ event.url }}">More info</a>
            {% endif %}
          </div>
        </div>
      {% endfor %}
    </div>

    <h2 class="event-section-title">Upcoming events</h2>

    <div class="event-list" id="upcoming-events"></div>

    <h2 class="event-section-title">Past events</h2>

    <div class="event-list" id="past-events"></div>
  </div>

  {% include community-shows.html %}
</div>
