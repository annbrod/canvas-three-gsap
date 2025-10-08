const wrapper = document.querySelector('.screen--second');
const nextLayer = document.querySelector('.screen--third')
let scrollPosition = 0;
let touchPos;
let canvas = document.querySelector('#second');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let animRequest, balls;

function startAnimation() {

	if (!animRequest) {
		loop();
	}
}

function stopAnimation() {
	if (animRequest) {
		window.cancelAnimationFrame(animRequest);
		animRequest = undefined;
	}
}

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loop() {
    balls.update();
    balls.draw();

    animRequest = window.requestAnimationFrame(loop);
}

//конструктор шарика
class Balls {
	constructor() {
		this.totalBalls = 60;
		this.balls = [];

		this.init = function () {
			this.setUpBalls();
			startAnimation();
		};

		this.setUpBalls = function () {
			for (var i = 0; i < this.totalBalls; i++) {
				let red = Math.floor(Math.random() * 340);
				let green = Math.floor(Math.random() * 0);
				let blue = Math.floor(Math.random() * 30);
				let color = `rgba(${red},${green},${blue})`;
				let radius = (getRandom(1, 30));
				let speed = 1;
				let width = canvas.width;
				let height = canvas.height;

				let ball = {
					x: Math.floor(Math.random() * (width - 0 + 1)),
					y: Math.floor(Math.random() * (height - 0 + 1)),
					radius,
					radians: 0,
					color,
					xUnits: 0,
					yUnits: 0,
					speed,
					//направление круга
					angle: getRandom(5, 190)
				};

				this.balls.push(ball);
			}
		};


		this.draw = function () {
			ctx.clearRect(
				0, 0,
				canvas.width,
				canvas.height
			);

			this.balls.forEach((ball) => {
				ball.x += ball.xUnits;
				ball.y += ball.yUnits;

				ctx.fillStyle = ball.color;
				ctx.shadowBlur = 20;
				ctx.shadowOffsetX = 2;
				ctx.shadowOffsetY = 2;
				ctx.shadowColor = 'red';
				ctx.beginPath();
				ctx.arc(
					ball.x, ball.y,
					ball.radius, 0,
					2 * Math.PI, false
				);

				ctx.closePath();
				ctx.fill();

				this.checkBorders(ball);
			});
		};

		//проверить, чтобы круг не улетел за пределы канвы
		this.checkBorders = function (ball) {
			if (ball.x < 0 || ball.x > canvas.width) {
				ball.angle = 180 - ball.angle;
			}

			if (ball.y < 0 || ball.y > canvas.height) {
				ball.angle = 360 - ball.angle;
			}
		};

		//чтобы круги не летели в одну сторону
		this.update = function () {
			this.balls.forEach(function (ball) {
				ball.radians = ball.angle * Math.PI / 180;
				ball.xUnits = Math.cos(ball.radians) * ball.speed;
				ball.yUnits = Math.sin(ball.radians) * ball.speed;
			});
		};

	}
}

balls = new Balls();
balls.init();

window.addEventListener('resize',function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stopAnimation();
    balls = new Balls();
	balls.init();
})


function onScrollDown () {
    wrapper.classList.add('gone');
    nextLayer.classList.add('shown');
	let customEvent = new Event("third-in");
	document.dispatchEvent(customEvent);
}
wrapper.addEventListener( 'wheel', function(e) {
    let newScrollPosition = e.deltaY;
    if (newScrollPosition - scrollPosition > 2 ) {
        onScrollDown();
    }
});
wrapper.addEventListener( 'touchstart', function(e) {
    touchPos = e.changedTouches[0].clientY;
});
wrapper.addEventListener( 'touchmove', function(e) {
    let newTouchPos = e.changedTouches[0].clientY;
    if(newTouchPos < touchPos) {
        onScrollDown();
    }
} );

