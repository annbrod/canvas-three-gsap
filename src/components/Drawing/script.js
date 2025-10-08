import { gsap } from "gsap";

let canvas = document.getElementById('drawing');
let canvasWelcome = document.getElementById('drawing-welcome');
let canvasCursor = document.getElementById('cursor');

canvas.width = window.innerWidth,
canvas.height = window.innerHeight;
canvasWelcome.width = window.innerWidth/2,
canvasWelcome.height = window.innerHeight/2;
canvasCursor.width = window.innerWidth,
canvasCursor.height = window.innerHeight;

let context = canvas.getContext('2d');
let contextWelcome = canvasWelcome.getContext('2d');
let contextCursor = canvasCursor.getContext('2d');

let mouseX = canvasCursor.width / 2;
let mouseY = canvasCursor.height / 2;

//курсор

function mouseFollow() {
    let coordinates = {
        lastX: mouseX,
        lastY: mouseY,
    }


    function mouseRender() {

        contextCursor.clearRect(0, 0, canvasCursor.width, canvasCursor.height);

        coordinates.lastX = lerp(coordinates.lastX, mouseX, 0.5);
        coordinates.lastY = lerp(coordinates.lastY, mouseY, 0.5);

        contextCursor.beginPath();
        contextCursor.arc(coordinates.lastX, coordinates.lastY, 10, 0, Math.PI * 2, false);
        contextCursor.fillStyle = "gray";
        contextCursor.fill();
        contextCursor.lineWidth = 2;
        contextCursor.strokeStyle = 'lightgray';
        contextCursor.stroke();

        requestAnimationFrame(mouseRender);
        contextCursor.closePath();
    };


    function mouseInit() {

        requestAnimationFrame(mouseRender);

        window.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }

    function lerp(a, b, n) {
        return (1 - n) * a + n * b;
    };

    mouseInit();
}


//заставка
let point;
let brush = document.createElement('canvas');
let contextBrush = brush.getContext('2d');
contextBrush.beginPath();
contextBrush.arc(40, 40, 20, 0, Math.PI * 2, false);
contextBrush.fillStyle = "gray";
contextBrush.fill();
contextBrush.lineWidth = 2;
contextBrush.strokeStyle = 'lightgray';
contextBrush.stroke();

const img = new Image();
img.src = brush.toDataURL();

let x, y;

const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttribute('d', 'M43,160.1c5.1-11.2,17-16.9,28.3-20.1c14.5-4.1,30-5.5,44.9-2.6c14.7,2.8,28.2,9.4,42.7,13c7.3,1.8,14.8,2.9,22.2,1.7 c7.1-1.1,13.5-4.5,19.4-8.5c13.8-9.4,25.7-21.4,37.5-33.2c1.4-1.4-0.8-3.5-2.1-2.1c-10.7,10.7-21.4,21.5-33.7,30.4 c-5.7,4.2-11.8,8.1-18.7,9.8c-7.4,1.9-15.1,1-22.5-0.7c-14.7-3.4-28.3-10.1-43.1-13.1c-14.9-3-30.3-2-45,1.8 c-12.8,3.3-26.7,9.5-32.5,22.2C39.6,160.4,42.2,161.9,43,160.1L43,160.1z');
let totalLength = path.getTotalLength();


let helper = {progress: 0}
helper.update = function(value){
  point = path.getPointAtLength(totalLength * helper.progress);
  x = point.x;
  y = point.y;
  contextWelcome.clearRect(0, 0, canvas.width, canvas.height);
  contextWelcome.drawImage(img, x, y );
}

function initWithGsap(){
    let tl = gsap.timeline();
    tl.to(helper, {progress:1, duration:2, delay: 1, ease: 'linear', onUpdate:helper.update})
    .to(canvasWelcome, {opacity: 0})
    return tl
}

document.addEventListener("third-in", function() {
    setTimeout(() => {
        initWithGsap();
    }, 1000);
    mouseFollow();
});

//рисовалка
let drawing = true;
let isMouseDown = false;
let clearButton = document.getElementById('clear-button');
let drawToggle = document.getElementById('draw-toggle');

//градиент для рисования
let gradient = context.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop('0', 'blue');
gradient.addColorStop('.1', 'violet');
gradient.addColorStop('.25', 'magenta');
gradient.addColorStop('.40', 'red');
gradient.addColorStop('.6', 'orange');
gradient.addColorStop('.75', 'yellow');
gradient.addColorStop('1', 'green');

//градиент для стирания
let eraseGradient = context.createLinearGradient(0, canvas.height, 0, 0);
eraseGradient.addColorStop(0.5, 'rgba(25, 27, 30, 1)');
eraseGradient.addColorStop(1, 'rgba(40, 47, 57, 1)');

drawToggle.onclick = function () {
    drawing = drawing !== true;
    if (drawing == true) {
        drawToggle.textContent = 'Ластик';
    } else {
        drawToggle.textContent = 'Кисть';
    }
};


canvas.addEventListener('mousedown', function (e) {
    isMouseDown = true;
});

canvas.addEventListener('mouseup', function (e) {
    isMouseDown = false;
    // -сбрасываем, чтобы можно было рисовать в новом месте
    context.beginPath();
});

canvas.addEventListener('touchstart', function (e) {
    isMouseDown = true;
});
canvas.addEventListener('touchend', function (e) {
    isMouseDown = false;
    context.beginPath();
});
canvas.addEventListener('touchcancel', function (e) {
    isMouseDown = false;
    context.beginPath();
});

canvas.addEventListener('mousemove', function (e) {
// -Рисуем 

    if (isMouseDown) {

        if (drawing === true) {
            drawLine(e);
        } else {
            eraseLine(e);
        }

    }
});

canvas.addEventListener('touchmove', function (e) {
    // -Рисуем  на тачустройствах
    if (isMouseDown) {
        if (drawing === true) {
            drawLine(e.touches[0]);
        } else {
            eraseLine(e.touches[0]);
        }


    }
});

function drawLine(e) {
    context.fillStyle = gradient;
    context.strokeStyle = gradient;
    context.lineTo(e.clientX, e.clientY);

    context.stroke();
    context.lineWidth = 20;

    // -сбрасываем, чтобы не происходило заполнение цветом
    context.beginPath();
    context.arc(e.clientX, e.clientY, 10, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(e.clientX, e.clientY);

}

function eraseLine(e) {
    context.fillStyle = eraseGradient;
    context.strokeStyle = eraseGradient;
    context.lineTo(e.clientX, e.clientY);

    context.stroke();
    context.lineWidth = 40;

    // -сбрасываем, чтобы не происходило заполнение цветом
    context.beginPath();
    context.arc(e.clientX, e.clientY, 20, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(e.clientX, e.clientY);
}

function clear() {
    context.fillStyle = eraseGradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.fillStyle = gradient;
}

document.addEventListener('keydown', function (e) {

// -Стирание наирисованного
    if (e.keyCode === 67) {
        clear();
    }
});

clearButton.onclick = function () {
    clear();
};

window.addEventListener('resize',function() {
    canvas.width = window.innerWidth,
    canvas.height = window.innerHeight;
    canvasWelcome.width = window.innerWidth/2,
    canvasWelcome.height = window.innerHeight/2;
    canvasCursor.width = window.innerWidth,
    canvasCursor.height = window.innerHeight;
    eraseGradient = context.createLinearGradient(0, canvas.height, 0, 0);
    eraseGradient.addColorStop(0.5, 'rgba(25, 27, 30, 1)');
    eraseGradient.addColorStop(1, 'rgba(40, 47, 57, 1)');
})
