---
layout: page
title: About
permalink: /about/
keywords:
- Seattle
- Indie
- Improv
- They Might Be Ghosts
- About

description: About
---

Formed in Summer, 2025: "improvisors celebrating life, here and in the hereafter"

<h2 class="event-section-title">Members</h2>

<div class="event-list">
  {% for member in site.data.members %}
    <div class="event-card">
      <div class="event-poster">
        <img
          src="/assets/img/{{ member.image | default: 'logo.webp' }}"
          alt="Headshot of {{ member.name }}"
          class="event-poster-img"
          data-full="/assets/img/{{ member.image | default: 'logo.webp' }}"
        >
      </div>
      <div class="event-details">
        <h2>{{ member.name }}</h2>

        {% if member.bio %}
          {{ member.bio }}
        {% endif %}
      </div>
    </div>
  {% endfor %}
</div>
