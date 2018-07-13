'use strict';

(function () {
  var HASHTAG_LENGTH = 20;
  var HASHTAG_AMOUNT = 5;
  var MAX_COMMENT_LENGTH = 140;
  var ErrorMessage = {
    START_WITH: 'Хэштег должен начинаться с символа "#"',
    IS_EMPTY: 'Хэштег должен содержать текст',
    SEPARATION: 'Хэштеги должны разделяться пробелом',
    HASHTAG_LENGTH: 'Длина хэштегов не должна превышать 20-и символов',
    HASHTAG_QUANTITY: 'Нельзя использовать больше 5-и хэштегов',
    REPEAT: 'Хэштеги не должны повторяться',
    COMMENT_LENGTH: 'Длина комментария не должна превышать 140 символов'
  };

  var imgUploadForm = document.querySelector('.img-upload__form');
  var hashtagInp = imgUploadForm.querySelector('.text__hashtags');
  var commentInp = imgUploadForm.querySelector('.text__description');

  function hasExtraSymbol(hashtag) {
    for (var k = 1; k < hashtag.length; k++) {
      if (hashtag.charAt(k) === '#') {
        return true;
      }
    }
    return false;
  }

  function validateHashtags() {
    var hashtagArr = hashtagInp.value.trim().split(' ');

    if (hashtagArr[0].length > 0) {
      for (var j = 0; j < hashtagArr.length; j++) {
        var nonUnique = hashtagArr.some(function (el, index) {
          return index !== j ? el.toLowerCase() === hashtagArr[j].toLowerCase() : false;
        });

        if (hashtagArr[j].charAt(0) !== '#') {
          hashtagInp.setCustomValidity(ErrorMessage.START_WITH);
          break;
        } else if (hashtagArr[j].length === 1) {
          hashtagInp.setCustomValidity(ErrorMessage.IS_EMPTY);
          break;
        } else if (hasExtraSymbol(hashtagArr[j])) {
          hashtagInp.setCustomValidity(ErrorMessage.SEPARATION);
          break;
        } else if (hashtagArr[j].length > HASHTAG_LENGTH) {
          hashtagInp.setCustomValidity(ErrorMessage.HASHTAG_LENGTH);
          break;
        } else if (hashtagArr.length > HASHTAG_AMOUNT) {
          hashtagInp.setCustomValidity(ErrorMessage.HASHTAG_QUANTITY);
          break;
        } else if (nonUnique) {
          hashtagInp.setCustomValidity(ErrorMessage.REPEAT);
          break;
        } else {
          hashtagInp.setCustomValidity('');
        }
      }
    }
  }

  function validateText() {
    var value = commentInp.value;

    if (value.length > MAX_COMMENT_LENGTH) {
      commentInp.setCustomValidity(ErrorMessage.COMMENT_LENGTH);
    } else {
      commentInp.setCustomValidity('');
    }
  }

  function hashtagChangeHandler() {
    hashtagInp.setCustomValidity('');
  }

  function imgSubmitHandler(callback) {
    validateHashtags();
    validateText();
    if (!imgUploadForm.checkValidity()) {
      imgUploadForm.reportValidity();
    } else {
      callback();
    }
  }

  function uploadEscPressHandler(evt) {
    window.assets.isEscEvent(evt, function () {
      evt.stopPropagation();
    });
  }

  hashtagInp.addEventListener('keydown', uploadEscPressHandler);
  commentInp.addEventListener('keydown', uploadEscPressHandler);
  hashtagInp.addEventListener('input', hashtagChangeHandler);

  window.validateUploadForm = imgSubmitHandler;
})();
