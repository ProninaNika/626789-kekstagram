'use strict';

(function () {

  var Url = {
    UPLOAD_IMG: 'https://js.dump.academy/kekstagram',
    GALLERY_IMGS: 'https://js.dump.academy/kekstagram/data'
  };

  function errorHandler(onError) {
    onError('Произошла ошибка соединения');
  }

  function timeoutHandler(onError, time) {
    onError('Запрос не успел выполниться за ' + time / 1000 + ' сек.');
  }

  function renderErrorNode(message) {
    var TIME_TO_SHOW = 6000;
    var existingError = document.querySelector('.error');

    var node = document.createElement('div');
    node.classList = 'error';
    node.style = 'position: fixed; right: 20px; bottom: 20px; max-width: 400px; padding: 10px; font-size: 16px; text-transform: none; color: #000; background: #fff; border-right: 4px solid #ff4d4d; z-index: 3;';
    node.textContent = message;

    if (existingError) {
      existingError.remove();
    }
    document.body.insertAdjacentElement('beforeend', node);

    setTimeout(function () {
      node.remove();
    }, TIME_TO_SHOW);
  }

  function request(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler(onError);
    });

    xhr.addEventListener('timeout', function () {
      timeoutHandler(onError, xhr.timeout);
    });

    xhr.timeout = 10000;

    return xhr;
  }

  function load(onLoad, onError) {
    var xhr = request(onLoad, onError);

    xhr.open('GET', Url.GALLERY_IMGS);
    xhr.send();
  }

  function upload(data, onLoad, onError) {
    var xhr = request(onLoad, onError);

    xhr.open('POST', Url.UPLOAD_IMG);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    upload: upload,
    showError: renderErrorNode
  };
})();
