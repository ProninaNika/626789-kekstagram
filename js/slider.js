'use strict';

(function () {
  var DEFAULT_VALUE = 100;

  var leftLimit = null;
  var rightLimit = null;
  var initialised = false;

  var scaleWrapper = document.querySelector('.scale');
  var effectScaleLine = scaleWrapper.querySelector('.scale__line');
  var effectScalePin = scaleWrapper.querySelector('.scale__pin');
  var effectScaleLevel = scaleWrapper.querySelector('.scale__level');
  var effectValueInp = document.querySelector('.scale__value');

  function getValueInPercent(val, max) {
    return val * 100 / max;
  }

  function getEffectPercent() {
    var effectPinOffsetLeft = effectScalePin.offsetLeft;
    var effectMaxVal = effectScaleLine.offsetWidth;
    return Math.ceil(getValueInPercent(effectPinOffsetLeft, effectMaxVal));
  }

  function resetSlider() {
    effectValueInp.value = DEFAULT_VALUE;
    effectScalePin.style.left = DEFAULT_VALUE + '%';
    effectScaleLevel.style.width = DEFAULT_VALUE + '%';
  }

  function initSlider(callback) {
    if (!initialised) {
      initialised = true;
      effectScalePin.addEventListener('mousedown', function (mouseDownEvt) {
        mouseDownEvt.preventDefault();

        var xCoord = mouseDownEvt.clientX;
        var lineWidth = effectScaleLine.offsetWidth;
        leftLimit = effectScaleLine.getBoundingClientRect().left;
        rightLimit = leftLimit + effectScaleLine.offsetWidth;

        var mouseMoveHandler = function (mouseMoveEvt) {

          var shift = xCoord - mouseMoveEvt.clientX;

          xCoord = mouseMoveEvt.clientX;

          if (xCoord > leftLimit && xCoord < rightLimit) {
            var move = effectScalePin.offsetLeft - shift;

            if (move >= 0 && move <= lineWidth) {
              effectScalePin.style.left = move + 'px';
              effectScaleLevel.style.width = move + 'px';
              var effectPercent = getEffectPercent();
              effectValueInp.value = effectPercent;
              callback();
            }
          }
        };

        var mouseUpHandler = function (mouseUpEvt) {
          mouseUpEvt.preventDefault();

          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      });
    }
  }

  window.slider = {
    getState: function () {
      return effectValueInp.value;
    },
    reset: resetSlider,
    init: initSlider
  };
})();
