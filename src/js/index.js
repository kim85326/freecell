const freeCellSlots = [[], [], [], []];
const homeCellSlots = [[], [], [], []];
const otherCellSlots = [[], [], [], [], [], [], [], []];

function initGame() {
    let cards = getInitialCards();
    cards = shuffle(cards);
    initOtherCellSlots(cards);
}

function getInitialCards() {
    const cards = [];

    for (let i = 1; i <= 52; i++) {
        const card = {
            point: i,
            color: convertCardToColor(i),
            suit: convertCardToSuit(i),
            number: convertCardToNumber(i),
            englishNumber: convertCardToEnglishNumber(i),
            draggable: false,
            droppable: false,
            slotNumber: 0,
        };
        cards.push(card);
    }

    return cards;
}

function convertCardToColor(point) {
    const suit = Math.ceil(point / 13);

    switch (suit) {
        case 1: //梅花
        case 4: //黑桃
            return "blue";
        default:
            //菱形、紅心
            return "red";
    }
}

function convertCardToSuit(point) {
    const suit = Math.ceil(point / 13);

    switch (suit) {
        case 1:
            return "club"; //梅花
        case 2:
            return "diamond"; //菱形
        case 3:
            return "heart"; //紅心
        default:
            return "spade"; //黑桃
    }
}

function convertCardToNumber(point) {
    const number = point % 13;

    if (number === 0) {
        return 13;
    }

    return number;
}

function convertCardToEnglishNumber(point) {
    const number = point % 13;

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
    let shuffledCards = JSON.parse(JSON.stringify(cards));

    for (let i = 0; i < 52; i++) {
        let j = Math.floor(Math.random() * 52);

        let temp = shuffledCards[j];
        shuffledCards[j] = shuffledCards[i];
        shuffledCards[i] = temp;
    }

    return shuffledCards;
}

function initOtherCellSlots(cards) {
    for (let i = 0; i < otherCellSlots.length; i++) {
        let slotCapacity;

        if (i <= 3) {
            slotCapacity = 7;

            for (let j = 0; j < slotCapacity; j++) {
                const card = cards[i * slotCapacity + j];
                card.slotNumber = i;
                otherCellSlots[i].push(card);
            }
        } else {
            slotCapacity = 6;

            for (let j = 0; j < slotCapacity; j++) {
                const card = cards[28 + (i - 4) * slotCapacity + j];
                card.slotNumber = i;
                otherCellSlots[i].push(card);
            }
        }
    }
}

function refreshGameView() {
    const otherCellSlotsDom = document.querySelectorAll(
        ".other-cell-block .card-slot"
    );
    const freeCellSlotsDom = document.querySelectorAll(
        ".free-cell-block .card-slot"
    );
    const homeCellSlotsDom = document.querySelectorAll(
        ".home-cell-block .card-slot"
    );

    refreshCellSlotsView(otherCellSlotsDom, otherCellSlots);
    refreshCellSlotsView(freeCellSlotsDom, freeCellSlots);
    refreshCellSlotsView(homeCellSlotsDom, homeCellSlots);
    setCardDomsDraggable();
}

function refreshCellSlotsView(slotsDom, slots) {
    slotsDom.forEach((slotDom, index) => {
        const cardDoms = slots[index].map((card) => {
            return getCardDom(card);
        });

        slotDom.innerHTML = cardDoms.join("");
    });
}

function getCardDom(card) {
    let imgFileName = `${card.suit}`;
    if (card.point % 13 > 10) {
        imgFileName = `${card.englishNumber}-${card.color}`;
    }

    return `<div class="card ${card.color}" data-point="${
        card.point
    }" data-draggable=${card.draggable} data-droppable=${
        card.droppable
    } data-slot-number=${card.slotNumber}>
                <div class="card-header">
                    <div class="card-number">${card.englishNumber}</div>
                    <img
                        src="./images/${card.suit}_s.svg"
                        alt=""
                        class="card-suit"
                    />
                </div>
                <div class="card-body">
                    <img
                        src="./images/${imgFileName}.svg"
                        alt=""
                        class="card-image"
                    />
                </div>
            </div>`;
}

function main() {
    initGame();
    refreshGameView();
}

main();

function setCardDomsDraggable() {
    const slotDoms = document.querySelectorAll(".card-slot");
    slotDoms.forEach((slotDom) => {
        if (slotDom.lastChild) {
            slotDom.lastChild.dataset.draggable = true;
        }
    });
}

function setCardDomsDroppable() {
    const slotDoms = document.querySelectorAll(".card-slot");
    slotDoms.forEach((slotDom) => {
        if (slotDom.lastChild) {
            slotDom.lastChild.dataset.droppable = true;
        }
    });
}

let isDragging = false;
let draggingDom;
const initDraggingDomPosition = {
    originX: 0,
    originY: 0,
    offsetX: 0,
    offsetY: 0,
};
let draggingDomPosition = { ...initDraggingDomPosition };

const game = document.querySelector("#game");
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
    const dx = event.pageX - draggingDomPosition.originX;
    const dy = event.pageY - draggingDomPosition.originY;
    draggingDom.style.transform = `translate(${draggingDomPosition.offsetX +
        dx}px, ${draggingDomPosition.offsetY + dy}px)`;
}

function mouseup(event) {
    event.preventDefault();
    if (!isDragging) {
        return;
    }
    const droppableDoms = document.querySelectorAll(
        ".card[data-droppable=true]"
    );

    let droppingDom = null;
    const draggingDomClientPosition = draggingDom.getBoundingClientRect();

    for (let i = 0; i < droppableDoms.length; i++) {
        const droppableDom = droppableDoms[i];

        // 自己不算
        if (droppableDom === draggingDom) {
            continue;
        }

        const droppableDomClientPosition = droppableDom.getBoundingClientRect();

        // dragging 任何一個角在 droppable 的範圍內
        // 左上角
        if (
            droppableDomClientPosition.left <= draggingDomClientPosition.left &&
            draggingDomClientPosition.left <=
                droppableDomClientPosition.right &&
            droppableDomClientPosition.top <= draggingDomClientPosition.top &&
            draggingDomClientPosition.top <= droppableDomClientPosition.bottom
        ) {
            droppingDom = droppableDom;
            break;
        }
        // 右上角
        if (
            droppableDomClientPosition.left <=
                draggingDomClientPosition.right &&
            draggingDomClientPosition.right <=
                droppableDomClientPosition.right &&
            droppableDomClientPosition.top <= draggingDomClientPosition.top &&
            draggingDomClientPosition.top <= droppableDomClientPosition.bottom
        ) {
            droppingDom = droppableDom;
            break;
        }
        // 左下角
        if (
            droppableDomClientPosition.left <= draggingDomClientPosition.left &&
            draggingDomClientPosition.left <=
                droppableDomClientPosition.right &&
            droppableDomClientPosition.top <=
                draggingDomClientPosition.bottom &&
            draggingDomClientPosition.bottom <=
                droppableDomClientPosition.bottom
        ) {
            droppingDom = droppableDom;
            break;
        }
        // 右下角
        if (
            droppableDomClientPosition.left <=
                draggingDomClientPosition.right &&
            draggingDomClientPosition.right <=
                droppableDomClientPosition.right &&
            droppableDomClientPosition.top <=
                draggingDomClientPosition.bottom &&
            draggingDomClientPosition.bottom <=
                droppableDomClientPosition.bottom
        ) {
            droppingDom = droppableDom;
            break;
        }
    }

    if (droppingDom !== null) {
        const card = otherCellSlots[draggingDom.dataset.slotNumber].pop();
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
