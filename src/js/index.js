const freeCellSlots = [[], [], [], []];
const homeCellSlots = [[], [], [], []];
const otherCellSlots = [[], [], [], [], [], [], [], []];

function initGame() {
    let card = getInitialCards();
    card = shuffle(card);

    for (let i = 0; i < otherCellSlots.length; i++) {
        let slotCapacity = 7;
        if (i > 3) {
            slotCapacity = 6;
        }

        for (let j = 0; j < slotCapacity; j++) {
            otherCellSlots[i].push(card[i * slotCapacity + j]);
        }
    }
}

function getInitialCards() {
    const cards = [];

    for (let i = 1; i <= 52; i++) {
        cards.push(i);
    }

    return cards;
}

function shuffle(cards) {
    // 複製一份牌組陣列
    let shuffledCards = { ...cards };

    for (let i = 0; i < 52; i++) {
        // 隨機取一個位置
        let j = Math.floor(Math.random() * 52);

        // 交換兩張牌
        let temp = shuffledCards[j];
        shuffledCards[j] = shuffledCards[i];
        shuffledCards[i] = temp;
    }

    return shuffledCards;
}

function convertCardToColor(card) {
    const suit = Math.ceil(card / 13);

    switch (suit) {
        case 1: //梅花
        case 4: //黑桃
            return "blue";
        default:
            //菱形、紅心
            return "red";
    }
}

function convertCardToSuit(card) {
    const suit = Math.ceil(card / 13);

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

function convertCardToNumber(card) {
    return card % 13;
}

function convertCardToEnglishNumber(card) {
    const number = card % 13;

    switch (number) {
        case 1:
            return "A";
        case 11:
            return "J";
        case 12:
            return "Q";
        case 12:
            return "K";
        default:
            return number;
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
    const color = convertCardToColor(card);
    const suit = convertCardToSuit(card);
    const englishNumber = convertCardToEnglishNumber(card);
    let imgFileName = `${suit}`;
    if (card % 13 > 10) {
        imgFileName = `${englishNumber}-${color}`;
    }

    return `<div class="card ${color}" id="card-${card}">
                <div class="card-header">
                    <div class="card-number">${englishNumber}</div>
                    <img
                        src="./images/${suit}_s.svg"
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

// let isDragging = false;
// let draggingDom;
// const initDraggingDomPosition = {
//     originX: 0,
//     originY: 0,
//     offsetX: 0,
//     offsetY: 0,
// };
// let draggingDomPosition = { ...initDraggingDomPosition };

// const game = document.querySelector("#game");
// game.addEventListener("mousedown", mousedown);

// function mousedown(event) {
//     if (!event.target.classList.contains("card")) {
//         return;
//     }
//     console.log("mousedown");
//     isDragging = true;
//     draggingDom = event.target;
//     draggingDom.style.zIndex = 999;
//     draggingDomPosition.originX = event.pageX;
//     draggingDomPosition.originY = event.pageY;
//     document.addEventListener("mousemove", mousemove);
//     document.addEventListener("mouseup", mouseup);
// }

// function mousemove(event) {
//     if (!isDragging) {
//         return;
//     }
//     console.log("mousemove");
//     const dx = event.pageX - draggingDomPosition.originX;
//     const dy = event.pageY - draggingDomPosition.originY;
//     draggingDom.style.transform = `translate(${draggingDomPosition.offsetX +
//         dx}px, ${draggingDomPosition.offsetY + dy}px)`;
// }

// function mouseup(event) {
//     if (!isDragging) {
//         return;
//     }
//     console.log("mouseup");
//     draggingDomPosition = initDraggingDomPosition;
//     document.removeEventListener("mousemove", mousemove);
//     document.removeEventListener("mouseup", mouseup);
//     isDragging = false;
// }
