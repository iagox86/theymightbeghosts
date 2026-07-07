document.addEventListener("DOMContentLoaded", function() {
  var allEvents = document.getElementById('all-events');

  if (allEvents) {
    var upcomingList = document.getElementById('upcoming-events');
    var pastList = document.getElementById('past-events');
    var now = new Date();

    var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Los_Angeles' };
    var timeOptions = { hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles' };

    var cards = Array.prototype.slice.call(allEvents.querySelectorAll('.event-card'));

    cards.forEach(function(card) {
      var showDate = new Date(card.getAttribute('data-datetime'));
      var doors = card.getAttribute('data-doors');
      var text = showDate.toLocaleDateString('en-US', dateOptions) + ' @ ' + showDate.toLocaleTimeString('en-US', timeOptions);

      if (doors) {
        text += ' (doors @ ' + doors + ')';
      }

      card.querySelector('.event-date').textContent = text;
    });

    var upcomingCards = cards
      .filter(function(card) { return new Date(card.getAttribute('data-datetime')) >= now; })
      .sort(function(a, b) { return new Date(a.getAttribute('data-datetime')) - new Date(b.getAttribute('data-datetime')); });

    var pastCards = cards
      .filter(function(card) { return new Date(card.getAttribute('data-datetime')) < now; })
      .sort(function(a, b) { return new Date(b.getAttribute('data-datetime')) - new Date(a.getAttribute('data-datetime')); });

    upcomingCards.forEach(function(card) { upcomingList.appendChild(card); });
    pastCards.forEach(function(card) { pastList.appendChild(card); });

    allEvents.remove();
  }

  var communityList = document.getElementById('community-events');

  if (communityList) {
    fetch('https://rolodex.lol/api/events')
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Request failed: ' + response.status);
        }
        return response.json();
      })
      .then(function(shows) {
        renderCommunityShows(communityList, shows);
      })
      .catch(function(err) {
        console.error('Failed to load community shows', err);
        communityList.innerHTML = '<p class="community-status">Couldn’t load other shows right now.</p>';
      });
  }

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

function isValidCommunityDate(dateStr) {
  return typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

function isValidCommunityTime(timeStr) {
  return typeof timeStr === 'string' && /^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr);
}

function formatCommunityTime(timeStr) {
  if (!isValidCommunityTime(timeStr)) {
    return '';
  }

  var parts = timeStr.split(':');
  var hour = parseInt(parts[0], 10);
  var minute = parts[1];
  var ampm = hour >= 12 ? 'PM' : 'AM';
  var hour12 = hour % 12 || 12;

  return hour12 + ':' + minute + ' ' + ampm;
}

function formatCommunityDate(dateStr) {
  if (!isValidCommunityDate(dateStr)) {
    return '';
  }

  // Build the date in UTC and format in UTC so the calendar day shown
  // matches the API's date string regardless of the viewer's timezone.
  var parts = dateStr.split('-');
  var utcDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

  if (isNaN(utcDate.getTime())) {
    return '';
  }

  var options = { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' };

  return utcDate.toLocaleDateString('en-US', options);
}

// Builds one show's DOM node, or returns null if the record is missing
// what it needs to render (the API is new and its shape may drift).
function buildCommunityEventNode(show) {
  if (!show || typeof show.show_name !== 'string' || !show.show_name.trim()) {
    return null;
  }

  var dateText = formatCommunityDate(show.date);
  if (!dateText) {
    return null;
  }

  var item = document.createElement('div');
  item.className = 'community-event';

  var title = document.createElement('p');
  title.className = 'community-event-title';

  if (typeof show.ticket_link === 'string' && /^https?:\/\//i.test(show.ticket_link)) {
    var link = document.createElement('a');
    link.href = show.ticket_link;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = show.show_name;
    title.appendChild(link);
  } else {
    title.textContent = show.show_name;
  }
  item.appendChild(title);

  var meta = document.createElement('p');
  meta.className = 'community-event-meta';
  var metaText = dateText;
  var timeText = formatCommunityTime(show.time);

  if (timeText) {
    metaText += ' @ ' + timeText;
  }
  if (typeof show.venue === 'string' && show.venue.trim()) {
    metaText += ' – ' + show.venue;
  }
  if (show.troupe && typeof show.troupe.name === 'string' && show.troupe.name.trim()) {
    metaText += ' (' + show.troupe.name + ')';
  }

  meta.textContent = metaText;
  item.appendChild(meta);

  return item;
}

function renderCommunityShows(container, shows) {
  if (!Array.isArray(shows)) {
    console.error('Unexpected community events response shape', shows);
    container.innerHTML = '<p class="community-status">Couldn’t load other shows right now.</p>';
    return;
  }

  var today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });

  var upcoming = shows
    .filter(function(show) { return show && isValidCommunityDate(show.date) && show.date >= today; })
    .sort(function(a, b) {
      if (a.date !== b.date) {
        return a.date < b.date ? -1 : 1;
      }
      return (a.time || '') < (b.time || '') ? -1 : 1;
    });

  container.innerHTML = '';

  var rendered = 0;

  upcoming.forEach(function(show) {
    var node;
    try {
      node = buildCommunityEventNode(show);
    } catch (err) {
      console.error('Skipping malformed community show', show, err);
      node = null;
    }

    if (node) {
      container.appendChild(node);
      rendered++;
    }
  });

  if (rendered === 0) {
    container.innerHTML = '<p class="community-status">No upcoming shows found.</p>';
  }
}
