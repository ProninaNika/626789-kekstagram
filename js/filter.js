'use strict';

(function () {
  var NEW_PREVIEWS_AMOUNT = 10;
  var filters = document.querySelector('.img-filters');
  var buttons = filters.querySelectorAll('.img-filters__button');
  var Filter = {
    'filter-popular': filterByPopularity,
    'filter-new': filterByNew,
    'filter-discussed': filterByDiscuss
  };
  var DEBOUNCE_INTERVAL = 500;
  var loadedPreviews = [];

  function addActiveClass(btn) {
    var activeClass = 'img-filters__button--active';
    filters.querySelector('.' + activeClass).classList.remove(activeClass);
    btn.classList.add(activeClass);
  }

  var onFilterChange = window.assets.debounce(function (btn, rebuildArr, callback) {
    var sortedPreviews = rebuildArr();
    addActiveClass(btn);
    callback(sortedPreviews);
  }, DEBOUNCE_INTERVAL);

  function showFilters(previews, callback) {
    if (!filters.classList.contains('img-filters--inactive')) {
      return false;
    }

    filters.classList.remove('img-filters--inactive');
    loadedPreviews = previews;

    buttons.forEach(function (el) {
      el.addEventListener('click', function () {
        var filter = el.id;
        onFilterChange(el, Filter[filter], callback);
      });
    });

    return false;
  }

  function filterByDiscuss() {
    var previews = loadedPreviews.slice().sort(function (a, b) {
      var aDiscussion = a.comments.length;
      var bDiscussion = b.comments.length;
      var discussionDiff = bDiscussion - aDiscussion;

      if (discussionDiff === 0) {
        discussionDiff = b.likes - a.likes;
      }
      return discussionDiff;
    });

    return previews;
  }

  function filterByPopularity() {
    return loadedPreviews;
  }

  function filterByNew() {
    var previews = loadedPreviews.slice().sort(function () {
      return 0.5 - Math.random();
    });

    return previews.slice(0, NEW_PREVIEWS_AMOUNT);
  }

  window.filter = {
    init: showFilters
  };
})();
