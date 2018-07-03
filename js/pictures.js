'use strict';

var photoComments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var photoDescriptions = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];

var getRandomNumber = function (num1, num2) {
  var number = Math.floor(num1 + ((Math.random() * (num2 - num1))));
  return number;
};

var getRandomArrElement = function (arr) {
  var number = Math.floor(Math.random() * arr.length);
  return arr[number];
};

var createComments = function (numberOfComments, listOfComments) {
  var commentsArray = [];
  for (var i = 0; i < numberOfComments; i++) {
    var comment = getRandomArrElement(listOfComments);
    if ((Math.random() - 0.5) > 0) {
      comment += getRandomArrElement(listOfComments);
    }
    commentsArray.push(comment);
  }
  return commentsArray;
};

var createRandomPhoto = function (photoNumber, photoComment, photoDescription) {
  var url = 'photos/' + photoNumber + '.jpg';
  var likes = getRandomNumber(15, 200);
  var commentsNumber = getRandomNumber(1, 5);
  var comments = createComments(commentsNumber, photoComment);
  var description = getRandomArrElement(photoDescription);
  var randomPhoto = {
    url: url,
    likes: likes,
    comments: comments.length,
    commentsContent: comments,
    description: description
  };
  return randomPhoto;
};

var photosArray = [];

for (var i = 0; i < 25; i++) {
  var newPhoto = createRandomPhoto(i + 1, photoComments, photoDescriptions);
  photosArray.push(newPhoto);
}

var picturesList = document.querySelector('.pictures');
var similarPhotoTemplate = document.querySelector('#picture').content.querySelector('.picture__link');

var renderPhoto = function (photo) {
  var photoElement = similarPhotoTemplate.cloneNode(true);
  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__stat--likes').textContent = photo.likes;
  photoElement.querySelector('.picture__stat--comments').textContent = photo.comments;
  photoElement.addEventListener('click', function () {
    renderBigPicture(photo);
  });
  return photoElement;
};

var fragment = document.createDocumentFragment();

var renderPhotos = function (arr) {
  for (var j = 0; j < arr.length; j++) {
    fragment.appendChild(renderPhoto(arr[j]));
  }
  return fragment;
};

picturesList.appendChild(renderPhotos(photosArray));

var bigPicture = document.querySelector('.big-picture');
var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');

var renderBigPicture = function (data) {
  bigPicture.querySelector('.big-picture__img > img').src = data.url;
  bigPicture.querySelector('.likes-count').textContent = data.likes;
  bigPicture.querySelector('.comments-count').textContent = data.comments;
  var socialComments = bigPicture.querySelector('.social__comments');

  for (var index = 0; index < data.comments; index++) {
    var comment = '<li class="social__comment social__comment--text"><img class="social__picture" src="img/avatar-' + getRandomNumber(1, 6) + '.svg" alt="Аватар комментатора фотографии" width="35" height="35"><p class="social__text">' + data.commentsContent[index] + '</p></li>';
    socialComments.insertAdjacentHTML('beforeend', comment);
  }

  bigPicture.querySelector('.social__caption').textContent = data.description;
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');
  bigPicture.classList.remove('hidden');
};

var closePicture = function () {
  bigPicture.classList.add('hidden');
};

var onPictureEscPress = function (evt) {
  if (evt.keyCode === 27) {
    closePicture();
  }
};

var onPictureCloseEnterPress = function (evt) {
  if (evt.keyCode === 13) {
    closePicture();
  }
};

bigPicture.addEventListener('click', closePicture);
bigPictureClose.addEventListener('keydown', onPictureCloseEnterPress);

document.addEventListener('keydown', onPictureEscPress);

var uploadOpen = document.querySelector('#upload-file');
var upload = document.querySelector('.img-upload__overlay');
var uploadClose = upload.querySelector('.img-upload__cancel');
var resizeMinus = document.querySelector('.resize__control--minus');
var resizePlus = document.querySelector('.resize__control--plus');
var resizeValue = document.querySelector('.resize__control--value');
var sizeStep = 25;
var minSize = 25;
var maxSize = 100;

uploadOpen.addEventListener('change', function () {
  upload.classList.remove('hidden');
});

var removeEffect = function () {
  if (previewPicture.classList.length) {
    var currentEffect = previewPicture.className;
    previewPicture.classList.remove(currentEffect);
  }
};

var addEffect = function (usedEffect) {
  var effect = usedEffect.value;
  var effectClass = 'effects__preview--' + effect;
  previewPicture.classList.add(effectClass);
};

var closePopup = function () {
  upload.classList.add('hidden');
  uploadOpen.value = null;
  removeEffect();
  resizeValue.value = '100%';
  previewPicture.style.transform = 'scale(1)';
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === 27) {
    closePopup();
  }
};

uploadClose.addEventListener('click', closePopup);
document.addEventListener('keydown', onPopupEscPress);

var previewPicture = document.querySelector('.img-upload__preview img');
var effectsList = document.querySelector('.effects__list');

effectsList.addEventListener('click', function (evt) {
  if (evt.target.classList.contains('effects__radio')) {
    removeEffect();
    if (evt.target.value !== 'none') {
      addEffect(evt.target);
    }
  }
});

var resizePicture = function (operation) {
  var currentSize = parseInt(resizeValue.value, 10);
  var size;
  if (operation === 'minus') {
    size = currentSize - sizeStep;
  } else if (operation === 'plus') {
    size = currentSize + sizeStep;
  }
  if (size >= minSize && size <= maxSize) {
    resizeValue.value = size + '%';
    previewPicture.style.transform = 'scale(' + (size / 100) + ')';
  }
};

resizeMinus.addEventListener('click', function () {
  resizePicture('minus');
});

resizePlus.addEventListener('click', function () {
  resizePicture('plus');
});
