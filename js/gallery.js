'use strict';

(function () {
  var picturesList = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture__link');

  function generatePreviewNode(obj) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.href = obj.url;
    pictureElement.querySelector('.picture__img').src = obj.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = obj.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = obj.comments.length;

    return pictureElement;
  }

  function addPreviewClickListener(link, post) {
    link.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.renderPost(post);
    });
  }

  function removePrevPreviews() {
    var prevImgList = document.querySelectorAll('.picture__link');

    [].forEach.call(prevImgList, function (el) {
      el.remove();
    });
  }

  function renderPreviews(previewList) {
    var fragment = document.createDocumentFragment();
    window.previews.list = previewList;

    previewList.forEach(function (el) {
      var postPreviewNode = generatePreviewNode(el);

      addPreviewClickListener(postPreviewNode, el);
      fragment.appendChild(postPreviewNode);
    });

    removePrevPreviews();
    picturesList.appendChild(fragment);
    window.filter.init(window.previews.list, window.previews.render);
  }

  window.previews = {
    render: renderPreviews,
    list: []
  };
})();
