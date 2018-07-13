'use strict';

(function () {
  var MIN_SCALE = 25;
  var MAX_SCALE = 100;
  var SCALE_STEP = 25;

  var imgScaleInp = document.querySelector('.resize__control--value');

  function makeNumber(number) {
    return +number.replace(/\% ?/, '');
  }

  function increaseImgScale(callback) {
    var imgScale = makeNumber(imgScaleInp.value);

    if (imgScale < MAX_SCALE) {
      imgScale += SCALE_STEP;
      setScale(imgScale);
      if (typeof callback === 'function') {
        callback();
      }
    }
  }

  function decreaseImgScale(callback) {
    var imgScale = makeNumber(imgScaleInp.value);

    if (imgScale > MIN_SCALE) {
      imgScale -= SCALE_STEP;
      setScale(imgScale);
      if (typeof callback === 'function') {
        callback();
      }
    }
  }

  function setScale(number) {
    imgScaleInp.value = number + '%';
  }

  window.scale = {
    setState: setScale,
    decrease: decreaseImgScale,
    increase: increaseImgScale
  };
})();
