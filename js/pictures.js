'use strict';

// Возможные комментарии
var COMMENTS = ['Все отлично!', 'В целом все неплохо. Но не все.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
// Возможные описания картинок
var DESCRIPTION = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
// Максимальное количество комментариев к каждой картинке
var COMMENTS_QUANTITY = 2;
// Количество доступных аватаров для комментаторов
var AVATAR_QUANTITY = 6;
// Клавиатурные коды
var ESC_KEYCODE = 27;

// Размеры загружаемых фотографий (в %)
var MAX_SIZE = 100;
var MIN_SIZE = 25;
// Шаг изменения размера загружаемых фотографий (в %)
var SIZE_CHANGE_STEP = 25;

// DOM-элементы
var bigPictureOverlay = document.querySelector('.big-picture');
var bigPictureOverlayCloseButton = document.querySelector('#picture-cancel');

var socialCommentsUl = document.querySelector('.social__comments');

var uploadStartButton = document.querySelector('#upload-file');
var uploadPreviewImg = document.querySelector('.img-upload__preview');
var uploadOverlay = document.querySelector('.img-upload__overlay');
var uploadOverlayCloseButton = document.querySelector('#upload-cancel');

var sizeMinusButton = document.querySelector('.resize__control--minus');
var sizePlusButton = document.querySelector('.resize__control--plus');
var sizeValueInput = document.querySelector('.resize__control--value');

var uploadScaleImg = document.querySelector('.img-upload__scale');
var scaleValueInput = document.querySelector('.scale__value');
var scaleLevel = document.querySelector('.scale__level');
var scalePin = document.querySelector('.scale__pin');
var scaleLine = document.querySelector('.scale__line');

var effectsListUl = document.querySelector('.effects__list');

var picturesSection = document.querySelector('.pictures');

/**
 * Создает числовой массив от min до max (включительно) по возрастанию с шагом step.
 *
 * @param {number} min - минимальное число массива. Любое число, может быть отрицательным и/или дробным.
 * @param {number} max - максимальное число массива. Любое число, может быть отрицательным и/или дробным. Должно быть больше или равно минимальному числу массива.
 * @param {number} step - шаг массива. Положительное число.
 * @return {array} range - числовой массив от min до max (включительно).
 */
var generateRange = function (min, max, step) {
  var range = [];
  for (var i = min; i <= max; i += step) {
    range.push(i);
  }
  return range;
};

var likes = generateRange(15, 200, 1);
var urlNumbers = generateRange(1, 25, 1);

/**
 * Перемешивает массив случайным образом (алгоритм Фишера-Йетса).
 *
 * @param {array} arr - любой массив элементов.
 * @return {array} newArr - новый массив из тех же элементов в случайном порядке.
 */
var randomizeArray = function (arr) {
  var arrLength = arr.length;
  var newArr = [];
  for (var i = 0; i < arrLength; i++) {
    var index = Math.floor(Math.random() * arr.length);
    newArr.push(arr[index]);
    arr.splice(index, 1);
  }
  return newArr;
};

var randomUrlNumbers = randomizeArray(urlNumbers);

/**
 * Выдает случайный элемент из массива. Допустимы повторы.
 *
 * @param {array} arr - любой массив элементов.
 * @return {string} randomElement - случайный элемент из входящего массива.
 */
var getRandomElement = function (arr) {
  var index = Math.floor(Math.random() * arr.length);
  var randomElement = arr[index];
  return randomElement;
};

/**
 * Генерирует массив заданной длины из возможных комментариев (COMMENTS).
 *
 * @param {number} quantity - количество комментариев.
 * @return {array} commentsList - массив из комментариев.
 */
var generateCommentsList = function (quantity) {
  var commentsList = [];
  var commentsListLength = Math.ceil(Math.random() * quantity);
  for (var i = 0; i < commentsListLength; i++) {
    var comment = getRandomElement(COMMENTS);
    commentsList.push(comment);
  }
  return commentsList;
};

/**
 * Создает массив картинок заданной длины. Параметры картинок: уникальный адрес, случайное количество лайков, случайный список комментариев и случайное описание.
 *
 * @param {number} picturesQuantity - количество картинок (длина массива).
 * @return {array} pictures - массив картинок.
 */
var getPictures = function (picturesQuantity) {
  var pictures = [];
  for (var i = 0; i < picturesQuantity; i++) {
    var photo = {
      id: 'picture_link_' + i,
      url: 'photos/' + randomUrlNumbers[i] + '.jpg',
      likes: getRandomElement(likes),
      comments: generateCommentsList(COMMENTS_QUANTITY),
      description: getRandomElement(DESCRIPTION)
    };
    pictures.push(photo);
  }
  return pictures;
};

var pictures = getPictures(25);

/**
 * Создает DOM-элемент на основе шаблона, превью картинки на главной странице.
 *
 * @param {object} picture - картинка с характеристиками.
 * @param {string} picture.url - путь к картинке.
 * @param {number} picture.likes - количество лайков к картинке.
 * @param {array} picture.comments - массив с комментариями к картинке.
 * @return {object} pictureElement - DOM-элемент на основе шаблона, превью картинки.
 */
var renderPreviewPicture = function (picture) {
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture__link');
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.id = picture.id;
  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

  return pictureElement;
};

/**
 * Создает DOM-элемент на основе шаблона, комментарий к картинке.
 *
 * @param {string} comment - текст комментария.
 * @return {object} commentElement - DOM-элемент на основе шаблона, комментарий к картинке.
 */
var renderComment = function (comment) {
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.social__comment');
  var commentElement = pictureTemplate.cloneNode(true);

  commentElement.querySelector('.social__picture').src = 'img/avatar-' + Math.ceil(Math.random() * AVATAR_QUANTITY) + '.svg';
  commentElement.querySelector('.social__text').textContent = comment;

  return commentElement;
};

/**
 * Добавляет на страницу DOM-элементы на основе данных массива.
 *
 * @param {array} elements - массив элементов.
 * @param {object} appendTo - место в DOM-дереве для добавления элементов.
 * @param {function} renderFunction - функция, которая отрисовывает каждый элемент массива.
 */
var renderElements = function (elements, appendTo, renderFunction) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < elements.length; i++) {
    fragment.appendChild(renderFunction(elements[i]));
  }
  appendTo.appendChild(fragment);
};


// КАРТИНКА В ПОЛНОМ РАЗМЕРЕ

/**
 * Отрисовывает страницу с картинкой в полном размере.
 *
 * @param {object} picture - картинка с характеристиками.
 * @param {string} picture.url - путь к картинке.
 * @param {number} picture.likes - количество лайков к картинке.
 * @param {array} picture.comments - массив с комментариями к картинке.
 * @param {string} picture.description - описание к картинке.
 */
var renderBigPicture = function (picture) {
  // Показываем страницу с картинкой в полном размере
  bigPictureOverlay.classList.remove('hidden');
  document.addEventListener('click', overlayBigPictureClickHandler);
  // Рендерим и вставляем лист с комментариями
  renderElements(picture.comments, socialCommentsUl, renderComment);
  // Вставляем остальные параметры картинки
  bigPictureOverlay.querySelector('.big-picture__img > img').src = picture.url;
  bigPictureOverlay.querySelector('.likes-count').textContent = picture.likes;
  bigPictureOverlay.querySelector('.comments-count').textContent = picture.comments.length;
  bigPictureOverlay.querySelector('.social__caption').textContent = picture.description;
};

/**
 * Находит по переданному событию порядковый номер выбранной картинки в массиве картинок (pictures) и вызывает функцию отрисовки.
 *
 * @param {object} evt - объект event.
 */
var findPicture = function (evt) {
  if (evt.target.parentNode.className === 'picture__link') {
    for (var i = 0; i < pictures.length; i++) {
      if (pictures[i].id === evt.target.parentNode.id) {
        renderBigPicture(pictures[i]);
      }
    }
  }
};

/**
 * Удаляет всех потомков переданного DOM-элемента
 *
 * @param {object} element - DOM-элемент (Element), потомков которого следует удалить.
 */
var removeAllChildren = function (element) {
  var childList = element.childNodes;
  for (var i = 0; i < childList.length; i++) {
    element.removeChild(childList[i]);
  }
};
/**
 * Вызывает закрытие окна в полном размере при клике на поле overlayBigPicture, вне поля окна с картинкой
 *
 * @param {object} evt - объект event.
 */
var overlayBigPictureClickHandler = function (evt) {
  if (evt.target === bigPictureOverlay) {
    closeBigPictureOverlay();
  }
};

/**
 * Закрывает окно с картинкой в полном размере, перед этим удаляя все комментарии под картинкой.
 */
var closeBigPictureOverlay = function () {
  removeAllChildren(socialCommentsUl);
  bigPictureOverlay.classList.add('hidden');
  document.removeEventListener('click', overlayBigPictureClickHandler);
};


// ЗАГРУЗКА КАРТИНОК

/**
 * Закрывает окно загрузки картинок по нажатию ESC.
 *
 * @param {object} evt - объект event.
 */
var escUploadPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeUploadOverlay();
  }
};

/**
 * Вызывает закрытие окна загрузки при клике на поле overlayUpload, вне поля окна загрузки
 *
 * @param {object} evt - объект event.
 */
var overlayUploadClickHandler = function (evt) {
  if (evt.target === uploadOverlay) {
    closeUploadOverlay();
  }
};

/**
 * Открывает окно загрузки фотографий.
 */
var openUploadOverlay = function () {
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', escUploadPressHandler);
  document.addEventListener('click', overlayUploadClickHandler);
};

/**
 * Закрывает окно загрузки фотографий.
 */
var closeUploadOverlay = function () {
  uploadOverlay.classList.add('hidden');
  uploadStartButton.value = '';
  document.removeEventListener('keydown', escUploadPressHandler);
  document.removeEventListener('click', overlayUploadClickHandler);

};

// ИЗМЕНЕНИЕ РАЗМЕРА КАРТИНКИ

/**
 * Меняет размер картинки, в зависимости от входных данных - уменьшает или увеличивает.
 *
 * @param {boolean} sizeUp - true: размер увеличивается, false: размер уменьшается.
 * @param {object} img - DOM-элемент, картинка, размер которой изменяется.
 * @param {object} input - DOM-элемент, отображающий текущий размер картинки.
 */
var resizeValue = function (sizeUp, img, input) {
  var pictureSize = +(input.value).replace('%', '');
  if (sizeUp && pictureSize < MAX_SIZE) {
    pictureSize += SIZE_CHANGE_STEP;
  } else if (!sizeUp && pictureSize > MIN_SIZE) {
    pictureSize -= SIZE_CHANGE_STEP;
  }
  img.style = 'transform: scale(' + pictureSize / 100 + ')';
  input.value = pictureSize + '%';
};


// ИЗМЕНЕНИЕ ЭФФЕКТА КАРТИНКИ

/**
 * Находит координаты линии слайдера.
 *
 * @return {object} coords - координаты линии слайдера.
 */
var findScaleCoords = function () {
  var scaleCoords = scaleLine.getBoundingClientRect();
  var coords = {
    start: scaleCoords.x,
    width: scaleCoords.width,
    fin: scaleCoords.x + scaleCoords.width
  };
  return coords;
};

/**
 * Проверяет id эффекта. Если эффект «Оригинал», то скрывает слайдер регулирования эффекта.
 *
 * @param {string} id - id применяемого эффекта.
 */
var checkEffect = function (id) {
  if (id === 'effect-none') {
    uploadScaleImg.classList.add('hidden');
  } else {
    uploadScaleImg.classList.remove('hidden');
  }
};

/**
 * Возвращает по id эффекта соответстующий класс, который нужно добавить картинке. При передаче неизвестного аргумента вернет undefined.
 *
 * @param {string} id - id применяемого эффекта.
 * @return {string} classes[id] - класс изображения с применяемым эффектом.
 */
var returnClassEffect = function (id) {
  var classes = {
    'effect-none': 'effects__preview--none',
    'effect-chrome': 'effects__preview--chrome',
    'effect-sepia': 'effects__preview--sepia',
    'effect-marvin': 'effects__preview--marvin',
    'effect-phobos': 'effects__preview--phobos',
    'effect-heat': 'effects__preview--heat'
  };
  return classes[id];
};

/**
 * Удаляет все классы у переданного элемента, кроме класса 'img-upload__preview'.
 *
 * @param {object} element - DOM-элемент у которого необходимо удалить все классы.
 */
var clearClassList = function (element) {
  var elementClassList = element.classList;
  for (var i = 0; i < elementClassList.length; i++) {
    if (elementClassList[i] !== 'img-upload__preview') {
      element.classList.remove(elementClassList[i]);
    }
  }
};

/**
 * Отображает перемещение пина и уровня слайдера. Вызывает функцию смены глубины эффекта.
 *
 * @param {number} coordinateX - текущая координата пина слайдера.
 * @param {object} scaleCoords - координаты линии (возможных положений) слайдера.
 * @param {number} scaleCoords.start - начальная координата линии слайдера.
 * @param {number} scaleCoords.fin - конечная координата линии слайдера.
 * @param {number} scaleCoords.width - длина линии слайдера.
 */
var moveScalePin = function (coordinateX, scaleCoords) {
  if (coordinateX >= scaleCoords.start && coordinateX <= scaleCoords.fin) {
    var shift = coordinateX - scaleCoords.start;
    var level = shift / scaleCoords.width * 100;

    scalePin.style.left = shift + 'px';
    scaleLevel.style.width = level + '%';
    changeEffectLevel(level);
  }
};


/**
 * Меняет эффект на превью картинки, добавляя ей необходимый класс. Основывается на id выбранного эффекта.
 * Перед сменой эффекта обнуляет положение пина слайдера.
 *
 * @param {string} id - id выбранного эффекта.
 */
var changeEffect = function (id) {
  var scaleCoords = findScaleCoords();
  moveScalePin(scaleCoords.start, scaleCoords);

  var newClass = returnClassEffect(id);
  checkEffect(id);
  clearClassList(uploadPreviewImg);
  uploadPreviewImg.classList.add(newClass);
};


/**
 * Меняет уровень эффекта пропорционально, в зависимости от id выбранного эффекта.
 * Для эффекта «Хром» — filter: grayscale(0..1);
 * Для эффекта «Сепия» — filter: sepia(0..1);
 * Для эффекта «Марвин» — filter: invert(0..100%);
 * Для эффекта «Фобос» — filter: blur(0..3px);
 * Для эффекта «Зной» — filter: brightness(1..3).
 *
 * @param {number} level -  выставленный уровень применяемого эффекта.
 */

var changeEffectLevel = function (level) {
  var effectId = document.querySelector('input[name=effect]:checked').id;
  scaleValueInput.value = level;
  var filterValue = {
    'effect-chrome': 'filter: grayscale(' + level / 100 + ');',
    'effect-sepia': 'filter: sepia(' + level / 100 + ');',
    'effect-marvin': 'filter: invert(' + level + '%);',
    'effect-phobos': 'filter: blur(' + level * 3 / 100 + 'px);',
    'effect-heat': 'filter: brightness(' + (level * 2 / 100 + 1) + ');'
  };

  uploadPreviewImg.style = filterValue[effectId];
};

// вызов функций

renderElements(pictures, picturesSection, renderPreviewPicture);

picturesSection.addEventListener('click', function (evt) {
  findPicture(evt);
});


bigPictureOverlayCloseButton.addEventListener('click', function () {
  closeBigPictureOverlay();
});


uploadStartButton.addEventListener('change', function () {
  openUploadOverlay();
});

uploadOverlayCloseButton.addEventListener('click', function () {
  closeUploadOverlay();
});

sizePlusButton.addEventListener('click', function () {
  resizeValue(true, uploadPreviewImg, sizeValueInput);
});

sizeMinusButton.addEventListener('click', function () {
  resizeValue(false, uploadPreviewImg, sizeValueInput);
});


effectsListUl.addEventListener('change', function (evt) {
  changeEffect(evt.target.id);
});

scalePin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  var coords = findScaleCoords();

  var mouseMoveScaleHandler = function (moveEvt) {
    moveEvt.preventDefault();
    moveScalePin(moveEvt.clientX, coords);
  };

  var mouseUpScaleHandler = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', mouseMoveScaleHandler);
    document.removeEventListener('mouseup', mouseUpScaleHandler);
  };

  document.addEventListener('mousemove', mouseMoveScaleHandler);
  document.addEventListener('mouseup', mouseUpScaleHandler);

});

// Временно спрятанные счетчик комментариев и кнопка дальнейшей загрузки комментариев
document.querySelector('.social__comment-count')
  .classList
  .add('visually-hidden');

document.querySelector('.social__loadmore')
  .classList
  .add('visually-hidden');
