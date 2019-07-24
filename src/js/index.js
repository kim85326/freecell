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
    if (!event.target.classList.contains("card")) {
        return;
    }
    console.log("mousedown");
    isDragging = true;
    draggingDom = event.target;
    draggingDom.style.zIndex = 999;
    draggingDomPosition.originX = event.pageX;
    draggingDomPosition.originY = event.pageY;
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
}

function mousemove(event) {
    if (!isDragging) {
        return;
    }
    console.log("mousemove");
    const dx = event.pageX - draggingDomPosition.originX;
    const dy = event.pageY - draggingDomPosition.originY;
    draggingDom.style.transform = `translate(${draggingDomPosition.offsetX +
        dx}px, ${draggingDomPosition.offsetY + dy}px)`;
}

function mouseup(event) {
    if (!isDragging) {
        return;
    }
    console.log("mouseup");
    draggingDomPosition = initDraggingDomPosition;
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
    isDragging = false;
}
