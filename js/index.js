"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var freeCellSlots = [[], [], [], []];
var homeCellSlots = [[], [], [], []];
var otherCellSlots = [[], [], [], [], [], [], [], []];

function initGame() {
  var cards = getInitialCards();
  cards = shuffle(cards);
  initOtherCellSlots(cards);
}

function getInitialCards() {
  var cards = [];

  for (var i = 1; i <= 52; i++) {
    var card = {
      point: i,
      color: convertCardToColor(i),
      suit: convertCardToSuit(i),
      number: convertCardToNumber(i),
      englishNumber: convertCardToEnglishNumber(i),
      draggable: false,
      droppable: false,
      slotNumber: 0
    };
    cards.push(card);
  }

  return cards;
}

function convertCardToColor(point) {
  var suit = Math.ceil(point / 13);

  switch (suit) {
    case 1: //梅花

    case 4:
      //黑桃
      return "blue";

    default:
      //菱形、紅心
      return "red";
  }
}

function convertCardToSuit(point) {
  var suit = Math.ceil(point / 13);

  switch (suit) {
    case 1:
      return "club";
    //梅花

    case 2:
      return "diamond";
    //菱形

    case 3:
      return "heart";
    //紅心

    default:
      return "spade";
    //黑桃
  }
}

function convertCardToNumber(point) {
  var number = point % 13;

  if (number === 0) {
    return 13;
  }

  return number;
}

function convertCardToEnglishNumber(point) {
  var number = point % 13;

  switch (number) {
    case 1:
      return "A";

    case 11:
      return "J";

    case 12:
      return "Q";

    case 0:
      return "K";

    default:
      return number;
  }
}

function shuffle(cards) {
  var shuffledCards = JSON.parse(JSON.stringify(cards));

  for (var i = 0; i < 52; i++) {
    var j = Math.floor(Math.random() * 52);
    var temp = shuffledCards[j];
    shuffledCards[j] = shuffledCards[i];
    shuffledCards[i] = temp;
  }

  return shuffledCards;
}

function initOtherCellSlots(cards) {
  for (var i = 0; i < otherCellSlots.length; i++) {
    var slotCapacity = void 0;

    if (i <= 3) {
      slotCapacity = 7;

      for (var j = 0; j < slotCapacity; j++) {
        var card = cards[i * slotCapacity + j];
        card.slotNumber = i;
        otherCellSlots[i].push(card);
      }
    } else {
      slotCapacity = 6;

      for (var _j = 0; _j < slotCapacity; _j++) {
        var _card = cards[28 + (i - 4) * slotCapacity + _j];
        _card.slotNumber = i;
        otherCellSlots[i].push(_card);
      }
    }
  }
}

function refreshGameView() {
  var otherCellSlotsDom = document.querySelectorAll(".other-cell-block .card-slot");
  var freeCellSlotsDom = document.querySelectorAll(".free-cell-block .card-slot");
  var homeCellSlotsDom = document.querySelectorAll(".home-cell-block .card-slot");
  refreshCellSlotsView(otherCellSlotsDom, otherCellSlots);
  refreshCellSlotsView(freeCellSlotsDom, freeCellSlots);
  refreshCellSlotsView(homeCellSlotsDom, homeCellSlots);
  setCardDomsDraggable();
}

function refreshCellSlotsView(slotsDom, slots) {
  slotsDom.forEach(function (slotDom, index) {
    var cardDoms = slots[index].map(function (card) {
      return getCardDom(card);
    });
    slotDom.innerHTML = cardDoms.join("");
  });
}

function getCardDom(card) {
  var imgFileName = "".concat(card.suit);

  if (card.point % 13 > 10) {
    imgFileName = "".concat(card.englishNumber, "-").concat(card.color);
  }

  return "<div class=\"card ".concat(card.color, "\" data-point=\"").concat(card.point, "\" data-draggable=").concat(card.draggable, " data-droppable=").concat(card.droppable, " data-slot-number=").concat(card.slotNumber, ">\n                <div class=\"card-header\">\n                    <div class=\"card-number\">").concat(card.englishNumber, "</div>\n                    <img\n                        src=\"./images/").concat(card.suit, "_s.svg\"\n                        alt=\"\"\n                        class=\"card-suit\"\n                    />\n                </div>\n                <div class=\"card-body\">\n                    <img\n                        src=\"./images/").concat(imgFileName, ".svg\"\n                        alt=\"\"\n                        class=\"card-image\"\n                    />\n                </div>\n            </div>");
}

function main() {
  initGame();
  refreshGameView();
}

main();

function setCardDomsDraggable() {
  var slotDoms = document.querySelectorAll(".card-slot");
  slotDoms.forEach(function (slotDom) {
    if (slotDom.lastChild) {
      slotDom.lastChild.dataset.draggable = true;
    }
  });
}

function setCardDomsDroppable() {
  var slotDoms = document.querySelectorAll(".card-slot");
  slotDoms.forEach(function (slotDom) {
    if (slotDom.lastChild) {
      slotDom.lastChild.dataset.droppable = true;
    }
  });
}

var isDragging = false;
var draggingDom;
var initDraggingDomPosition = {
  originX: 0,
  originY: 0,
  offsetX: 0,
  offsetY: 0
};

var draggingDomPosition = _objectSpread({}, initDraggingDomPosition);

var game = document.querySelector("#game");
game.addEventListener("mousedown", mousedown);

function mousedown(event) {
  event.preventDefault();

  if (!event.target.classList.contains("card")) {
    return;
  }

  if (!event.target.dataset.draggble === false) {
    return;
  }

  setCardDomsDroppable();
  isDragging = true;
  draggingDom = event.target;
  draggingDom.style.zIndex = 999;
  draggingDomPosition.originX = event.pageX;
  draggingDomPosition.originY = event.pageY;
  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mouseup", mouseup);
}

function mousemove(event) {
  event.preventDefault();

  if (!isDragging) {
    return;
  }

  var dx = event.pageX - draggingDomPosition.originX;
  var dy = event.pageY - draggingDomPosition.originY;
  draggingDom.style.transform = "translate(".concat(draggingDomPosition.offsetX + dx, "px, ").concat(draggingDomPosition.offsetY + dy, "px)");
}

function mouseup(event) {
  event.preventDefault();

  if (!isDragging) {
    return;
  }

  var droppableDoms = document.querySelectorAll(".card[data-droppable=true]");
  var droppingDom = null;
  var draggingDomClientPosition = draggingDom.getBoundingClientRect();

  for (var i = 0; i < droppableDoms.length; i++) {
    var droppableDom = droppableDoms[i]; // 自己不算

    if (droppableDom === draggingDom) {
      continue;
    }

    var droppableDomClientPosition = droppableDom.getBoundingClientRect(); // dragging 任何一個角在 droppable 的範圍內
    // 左上角

    if (droppableDomClientPosition.left <= draggingDomClientPosition.left && draggingDomClientPosition.left <= droppableDomClientPosition.right && droppableDomClientPosition.top <= draggingDomClientPosition.top && draggingDomClientPosition.top <= droppableDomClientPosition.bottom) {
      droppingDom = droppableDom;
      break;
    } // 右上角


    if (droppableDomClientPosition.left <= draggingDomClientPosition.right && draggingDomClientPosition.right <= droppableDomClientPosition.right && droppableDomClientPosition.top <= draggingDomClientPosition.top && draggingDomClientPosition.top <= droppableDomClientPosition.bottom) {
      droppingDom = droppableDom;
      break;
    } // 左下角


    if (droppableDomClientPosition.left <= draggingDomClientPosition.left && draggingDomClientPosition.left <= droppableDomClientPosition.right && droppableDomClientPosition.top <= draggingDomClientPosition.bottom && draggingDomClientPosition.bottom <= droppableDomClientPosition.bottom) {
      droppingDom = droppableDom;
      break;
    } // 右下角


    if (droppableDomClientPosition.left <= draggingDomClientPosition.right && draggingDomClientPosition.right <= droppableDomClientPosition.right && droppableDomClientPosition.top <= draggingDomClientPosition.bottom && draggingDomClientPosition.bottom <= droppableDomClientPosition.bottom) {
      droppingDom = droppableDom;
      break;
    }
  }

  if (droppingDom !== null) {
    var card = otherCellSlots[draggingDom.dataset.slotNumber].pop();
    card.slotNumber = droppingDom.dataset.slotNumber;
    otherCellSlots[droppingDom.dataset.slotNumber].push(card);
  }

  refreshGameView();
  draggingDomPosition = initDraggingDomPosition;
  document.removeEventListener("mousemove", mousemove);
  document.removeEventListener("mouseup", mouseup);
  draggingDom.style.zIndex = "";
  isDragging = false;
}
//# sourceMappingURL=index.js.map
