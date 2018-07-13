'use strict';

(function () {

  function getRandomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }

  function pickRandomArrEl(array) {
    var EL_NUMBER = Math.floor(Math.random() * array.length);
    return array[EL_NUMBER];
  }

  function isEscEvent(e, callback) {
    if (e.keyCode === window.Keycode.ESC) {
      callback();
    }
  }

  function debounce(foo, interval) {
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        foo.apply(null, args);
      }, interval);
    };
  }

  window.assets = {
    isEscEvent: isEscEvent,
    getRandomInteger: getRandomInteger,
    pickRandomArrEl: pickRandomArrEl,
    debounce: debounce
  };
})();
