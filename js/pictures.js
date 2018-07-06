'use strict';

var NUMBER_OF_AVATARS = 6;
var NUMBER_OF_PHOTOS = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var IMG_PATH = 'photos/';
var IMG_EXT = 'jpg';
var AVA_PATH = 'img/avatar-';
var AVA_EXT = 'svg';
var AVA_WIDTH = 35;
var AVA_HEIGHT = 35;
var ESC_KEY = 27;
var RESIZE_STEP = 25;
var RESIZE_MIN = 25;
var RESIZE_MAX = 100;
var RESIZE_DEFAULT = 100;
var NUMBER_OF_HASHTAGS = 5;
var HASHTAG_MIN_LENGTH = 3;
var HASHTAG_MAX_LENGTH = 20;

var PHOTOS_COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var PHOTOS_DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var makeElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);

  if (text) {
    element.textContent = text;
  }

  return element;
};

var removeChildElements = function (element) {
  while (element.firstElementChild) {
    element.innerHTML = '';
  }
};

var getRandomNum = function (num) {
  return Math.round(Math.random() * num);
};

var getRandomArrElem = function (arr) {
  return arr[getRandomNum(arr.length - 1)];
};

var generateUrls = function (num, path, ext) {
  var urls = [];

  for (var i = 0; i < num; i += 1) {
    urls[i] = path + (i + 1) + '.' + ext;
  }

  return urls;
};

var getRandomUrl = function (url) {
  return url.splice(getRandomNum(url.length - 1), 1)[0];
};

var getRandomNumFromRange = function (min, max) {
  return max - getRandomNum(max - min);
};

var getRandomComments = function (comments, num) {
  var photoComments = [];

  for (var i = 0; i <= num; i += 1) {
    photoComments[i] = comments[getRandomNum(comments.length - 1)];
  }

  return photoComments;
};

var getPhoto = function (url, likes, comments, description) {
  var photo = {
    url: url,
    likes: likes,
    comments: comments,
    description: description
  };

  return photo;
};

var getRandomPhotosList = function (num) {
  var urls = generateUrls(num, IMG_PATH, IMG_EXT);
  var photosList = [];

  for (var i = 0; i < num; i += 1) {
    var url = getRandomUrl(urls);
    var likes = getRandomNumFromRange(MIN_LIKES, MAX_LIKES);
    var comments = getRandomComments(PHOTOS_COMMENTS, getRandomNum(1));
    var description = PHOTOS_DESCRIPTIONS[getRandomNum(PHOTOS_DESCRIPTIONS.length - 1)];

    photosList[i] = getPhoto(url, likes, comments, description);
  }

  return photosList;
};

var renderPhoto = function (photo, template) {
  var photoElement = template.cloneNode(true);

  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__stat--likes').textContent = photo.likes;
  photoElement.querySelector('.picture__stat--comments').textContent = photo.comments.length;
  photoElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    renderBigPhoto(photo);
  });

  return photoElement;
};

var renderPhotos = function (photos, template) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photos.length; i += 1) {
    fragment.appendChild(renderPhoto(photos[i], template));
  }

  return fragment;
};

var getRandomThumb = function (num) {
  var urls = generateUrls(num, AVA_PATH, AVA_EXT);

  return getRandomArrElem(urls);
};

var renderComment = function (text) {
  var commentElement = makeElement('li', 'social__comment');

  var commentAvatar = makeElement('img', 'social__picture');
  commentAvatar.src = getRandomThumb(NUMBER_OF_AVATARS);
  commentAvatar.alt = 'Аватар комментатора фотографии';
  commentAvatar.width = AVA_WIDTH;
  commentAvatar.height = AVA_HEIGHT;

  commentElement.appendChild(commentAvatar);

  var commentText = makeElement('p', 'social__text', text);

  commentElement.appendChild(commentText);

  return commentElement;
};

var renderBigPhoto = function (photo) {
  bigPhotoElement.querySelector('.big-picture__img img').src = photo.url;
  bigPhotoElement.querySelector('.social__caption').textContent = photo.description;
  bigPhotoElement.querySelector('.likes-count').textContent = photo.likes;
  var authorAvatarElement = bigPhotoElement.querySelector('.social__header .social__picture');
  authorAvatarElement.src = getRandomThumb(NUMBER_OF_AVATARS);
  var commentsElement = bigPhotoElement.querySelector('.social__comments');

  removeChildElements(commentsElement);

  for (var i = 0; i < photo.comments.length; i += 1) {
    commentsElement.appendChild(renderComment(photo.comments[i]));
  }

  bigPhotoElement.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPhotoElement.querySelector('.social__loadmore').classList.add('visually-hidden');
  bigPhotoElement.classList.remove('hidden');

  document.addEventListener('keydown', bigPhotoEscKeydownHanlder);
  bigPhotoCancelElement.addEventListener('click', hideBigPhoto);
};

var hideBigPhoto = function () {
  bigPhotoElement.classList.add('hidden');
  document.removeEventListener('keydown', bigPhotoEscKeydownHanlder);
};

var bigPhotoEscKeydownHanlder = function (evt) {
  if (evt.keyCode === ESC_KEY) {
    hideBigPhoto();
  }
};

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
var picturesElement = document.querySelector('.pictures');
var photosList = getRandomPhotosList(NUMBER_OF_PHOTOS);
var photosElement = renderPhotos(photosList, pictureTemplate);
var bigPhotoElement = document.querySelector('.big-picture');
var bigPhotoCancelElement = document.querySelector('#picture-cancel');

picturesElement.appendChild(photosElement);

var uploadFileElement = document.querySelector('#upload-file');
var uploadOverlayElement = document.querySelector('.img-upload__overlay');
var uploadCancelElement = document.querySelector('#upload-cancel');

var uploadEscKeydownHanlder = function (evt) {
  if (evt.keyCode === ESC_KEY && evt.target !== hashTagsElement && evt.target !== textDescriptionElement) {
    hideUploadOverlay();
  }
};

var showUploadOverlay = function () {
  resizeControlValueElement.value = RESIZE_DEFAULT + '%';

  uploadOverlayElement.classList.remove('hidden');
  document.addEventListener('keydown', uploadEscKeydownHanlder);
  scaleValueElement.value = 100;
  assignEffectOnImagePreview();
};

var hideUploadOverlay = function () {
  uploadFileElement.value = null;
  uploadOverlayElement.classList.add('hidden');
  document.removeEventListener('keydown', uploadEscKeydownHanlder);
};

var uploadFileChangeHandler = function () {
  showUploadOverlay();
};

uploadFileElement.addEventListener('change', uploadFileChangeHandler);
uploadCancelElement.addEventListener('click', hideUploadOverlay);

var uploadPreviewElement = document.querySelector('.img-upload__preview');
var resizeControlValueElement = document.querySelector('.resize__control--value');
var resizeControlMinusElement = document.querySelector('.resize__control--minus');
var resizeControlPlusElement = document.querySelector('.resize__control--plus');

var decreaseImagePreviewSize = function () {
  var resizeValue = parseInt(resizeControlValueElement.value, 10);

  if (resizeValue > RESIZE_MIN) {
    resizeValue -= RESIZE_STEP;

    resizeControlValueElement.value = resizeValue + '%';
    uploadPreviewElement.style.transform = 'scale(' + resizeValue / 100 + ')';
  }
};

var increaseImagePreviewSize = function () {
  var resizeValue = parseInt(resizeControlValueElement.value, 10);

  if (resizeValue < RESIZE_MAX) {
    resizeValue += RESIZE_STEP;

    resizeControlValueElement.value = resizeValue + '%';
    uploadPreviewElement.style.transform = 'scale(' + resizeValue / 100 + ')';
  }
};

var resizeControlMinusClickHandler = function () {
  decreaseImagePreviewSize();
};

var resizeControlPlusClickHandler = function () {
  increaseImagePreviewSize();
};

resizeControlMinusElement.addEventListener('click', resizeControlMinusClickHandler);
resizeControlPlusElement.addEventListener('click', resizeControlPlusClickHandler);

var effectsElement = document.querySelectorAll('.effects__radio');
var effectPreviewElement = document.querySelector('.img-upload__preview img');
var scaleElement = document.querySelector('.scale');
var scaleValueElement = document.querySelector('.scale__value');
var scaleLineElement = document.querySelector('.scale__line');
var scalePinElement = document.querySelector('.scale__pin');
var scaleLevelElement = document.querySelector('.scale__level');

var getEffectScaleValue = function () {
  var current = scaleLevelElement.offsetWidth;
  var max = scaleLineElement.offsetWidth;

  return Math.round(current / max * 100);
};

var getFilterValue = function (effect, value) {
  var effectValue = value / 100;

  if (effect === 'chrome') {
    return 'grayscale(' + effectValue + ')';
  } else if (effect === 'sepia') {
    return 'sepia(' + effectValue + ')';
  } else if (effect === 'marvin') {
    return 'invert(' + value + '%)';
  } else if (effect === 'phobos') {
    return 'blur(' + effectValue * 3 + 'px)';
  } else if (effect === 'heat') {
    return 'brightness(' + (1 + effectValue * 2) + ')';
  }

  return null;
};

var assignEffectOnImagePreview = function () {
  var checkedEffect = document.querySelector('.effects__radio:checked');

  effectPreviewElement.className = 'effects__preview--' + checkedEffect.value;
  effectPreviewElement.style.filter = getFilterValue(checkedEffect.value, scaleValueElement.value);

  scaleElement.classList.toggle('hidden', checkedEffect.value === 'none');
  assignEffectsEventListener();
};

var imagePreviewChangeHanlder = function () {
  scaleValueElement.value = 100;
  assignEffectOnImagePreview();
};

var assignEffectsEventListener = function () {
  for (var i = 0; i < effectsElement.length; i += 1) {
    effectsElement[i].addEventListener('change', imagePreviewChangeHanlder);
  }
};

var scalePinMouseupHandler = function () {
  scaleValueElement.value = getEffectScaleValue();
  assignEffectOnImagePreview();
};

scalePinElement.addEventListener('mouseup', scalePinMouseupHandler);

var hashTagsElement = document.querySelector('.text__hashtags');
var textDescriptionElement = document.querySelector('.text__description');
var uploadImageFormElement = document.querySelector('#upload-select-image');

var getTagsErrorMessage = function (inputTags) {
  var hashTags = inputTags.toLowerCase().trim().split(/\s+/);

  for (var i = 0; i < hashTags.length; i += 1) {
    var hashTag = hashTags[i];

    if (hashTag === '') {
      return '';
    }

    if (hashTag.indexOf('#')) {
      return 'Хеш-тег должен начинаться с символа решетки "#"';
    }

    if (hashTag.length < HASHTAG_MIN_LENGTH) {
      return 'Длина хеш-тега должна быть не менее 3-ех символов';
    }

    if (hashTag.length > HASHTAG_MAX_LENGTH) {
      return 'Длина хеш-тега должна быть не более 20 символов';
    }

    if (hashTag.includes('#', 1)) {
      return 'Названиe хеш-тега не должно содержать символа решетки "#"';
    }

    if (hashTags.includes(hashTag, i + 1)) {
      return 'Названия хеш-тегов не должны повторяться (Хеш-теги не чувствительны к регистру: #хеш-тег и #Хеш-Тег - равнозначны).';
    }
  }

  if (hashTags.length > NUMBER_OF_HASHTAGS) {
    return 'Количество хеш-тегов не должно превышать пяти';
  }

  return '';
};

var renderTagsErrorMessage = function () {
  var errorStyle = '6px solid rgb(249, 75, 80)';
  var errorMessage = getTagsErrorMessage(hashTagsElement.value);

  if (errorMessage) {
    hashTagsElement.style.border = errorStyle;
    hashTagsElement.setCustomValidity(errorMessage);
  } else {
    hashTagsElement.style.border = null;
    hashTagsElement.setCustomValidity('');
  }
};

var hashTagsInputHanlder = function () {
  renderTagsErrorMessage();
};

var uploadImageFormSubmitHandler = function (evt) {
  if (!uploadImageFormElement.reportValidity()) {
    evt.preventDefault();
  }
};

hashTagsElement.addEventListener('input', hashTagsInputHanlder);
uploadImageFormElement.addEventListener('submit', uploadImageFormSubmitHandler);
