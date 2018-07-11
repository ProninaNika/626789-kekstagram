'use strict';

(function () {
  var COMMENTS_TO_LOAD = 5;
  var loadedCommentsCount = 0;
  var commentNode = document.querySelector('.social__comment');
  var moreCommentsBtn = document.querySelector('.social__loadmore');
  var commentsCount = document.querySelector('.social__comment-count');

  function renderLoadedCommentsNum(number) {
    commentsCount.childNodes[0].data = number + ' из ';
  }

  function renderCommentsFragment(comments) {
    var fragment = document.createDocumentFragment();

    comments.forEach(function (comment) {
      var node = commentNode.cloneNode(true);
      node.querySelector('.social__picture').src = 'img/avatar-' + window.assets.getRandomInteger(1, 6) + '.svg';
      node.querySelector('.social__text').textContent = comment;
      fragment.appendChild(node);
    });
    loadedCommentsCount += comments.length;

    return fragment;
  }

  function loadNextComments(comments) {
    var commentsList = document.querySelector('.social__comments');
    if (loadedCommentsCount < comments.length) {
      var nextComments = comments.slice(loadedCommentsCount, loadedCommentsCount + COMMENTS_TO_LOAD);
      var commentsFragment = renderCommentsFragment(nextComments);

      commentsList.appendChild(commentsFragment);
      renderLoadedCommentsNum(loadedCommentsCount);
      if (loadedCommentsCount === comments.length) {
        moreCommentsBtn.classList.add('visually-hidden');
      }
    }
  }

  function renderPost(postData) {
    var post = document.querySelector('.big-picture');
    var postNode = post.cloneNode(true);
    postNode.classList.remove('hidden');
    postNode.querySelector('.big-picture__img img').src = postData.url;
    postNode.querySelector('.likes-count').textContent = postData.likes;
    postNode.querySelector('.comments-count').textContent = postData.comments.length;
    postNode.querySelector('.social__caption').textContent = postData.description;
    postNode.querySelector('.social__loadmore').classList.remove('visually-hidden');

    loadedCommentsCount = 0;
    var commentsArr = postData.comments.slice(0, COMMENTS_TO_LOAD);

    var commentsList = postNode.querySelector('.social__comments');
    var closeBtn = postNode.querySelector('.big-picture__cancel');
    var comments = renderCommentsFragment(commentsArr);
    moreCommentsBtn = postNode.querySelector('.social__loadmore');
    commentsCount = postNode.querySelector('.social__comment-count');

    commentsList.innerHTML = '';
    commentsList.appendChild(comments);
    renderLoadedCommentsNum(loadedCommentsCount);
    if (loadedCommentsCount === postData.comments.length) {
      moreCommentsBtn.classList.add('visually-hidden');
    }

    closeBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      closeBigPicture();
    });

    moreCommentsBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      loadNextComments(postData.comments);
    });
    document.addEventListener('keydown', bigPictureEscPressHandler);

    post.parentNode.replaceChild(postNode, post);
  }

  function closeBigPicture() {
    var post = document.querySelector('.big-picture');
    post.classList.add('hidden');
    document.removeEventListener('keydown', bigPictureEscPressHandler);
  }

  function bigPictureEscPressHandler(evt) {
    window.assets.isEscEvent(evt, closeBigPicture);
  }

  window.renderPost = renderPost;

})();
