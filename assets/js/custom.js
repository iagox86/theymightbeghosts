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
