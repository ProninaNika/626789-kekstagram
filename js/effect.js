'use strict';

(function () {
  var effectListMap = {
    chrome: {
      filter: 'grayscale',
      min: 0,
      max: 1,
      unit: ''
    },
    sepia: {
      filter: 'sepia',
      min: 0,
      max: 1,
      unit: ''
    },
    marvin: {
      filter: 'invert',
      min: 0,
      max: 100,
      unit: '%'
    },
    phobos: {
      filter: 'blur',
      min: 0,
      max: 3,
      unit: 'px'
    },
    heat: {
      filter: 'brightness',
      min: 1,
      max: 3,
      unit: ''
    }
  };

  function refreshImgClassEffect(node) {
    var effect = window.effect.current();

    node.className = '';
    node.classList.add('effects__preview--' + effect);
  }

  function generateCssProp(currentPerc) {
    var MAX_PERCENT = 100;
    var effectObj = effectListMap[window.effect.current()];
    var val = currentPerc / MAX_PERCENT * effectObj.max + (1 - currentPerc / MAX_PERCENT) * effectObj.min;
    return effectObj.filter + '(' + val + effectObj.unit + ')';
  }

  window.effect = {
    current: function () {
      return document.querySelector('.effects__radio:checked').value;
    },
    cssProp: generateCssProp,
    changeImgClass: refreshImgClassEffect
  };
})();
