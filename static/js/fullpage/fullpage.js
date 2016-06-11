var screen = document.querySelector('.phone-bg .screen');
var body = document.querySelector('.phone-bg .screen .body');
body.changeBodyPosition = function () {
	body.style.transform = 'translate3d(' + pageOffset.x + ', ' + pageOffset.y + ', 0)';
	body.style.webkitTransform = 'translate3d(' + pageOffset.x + 'px, ' + pageOffset.y + 'px, 0)';
}
var screenTouch = {
	x: -1,
	y: -1,
	isPress: false
};
var pageOffset = {
	x: 0,
	y: 0,
	speedX: 0,
	speedY: 0,
	handleBack: function () {
		this.isAnimating = true;
		if (Math.abs(pageOffset.speedY) < 0.1) {
			pageOffset.isAnimating = false;
			clearTimeout(pageOffset.timer);
			if (pageOffset.speedY < 0) {
				pageOffset.y = screen.offsetHeight - body.offsetHeight;
			} else {
				pageOffset.y = 0;
			}
			pageOffset.speedY = 0;
			
		} else {
			if (pageOffset.speedY > 0) {
				pageOffset.speedY = pageOffset.y / 8;
			} else {
				pageOffset.speedY = (pageOffset.y - (screen.offsetHeight - body.offsetHeight))/8;
			}
			pageOffset.y -= pageOffset.speedY;
			this.timer = setTimeout (function(){
				pageOffset.handleBack();
			}, 1000/60);
		}
		body.changeBodyPosition();
	}
};
screen.addEventListener('mousedown', function (e) {
	e.preventDefault();
	e.stopPropagation();
	if (!pageOffset.isAnimating) {
		screenTouch.isPress = true;
		screenTouch.x = e.layerX;
		screenTouch.y = e.layerY;
		screenTouch.startX = screenTouch.x;
		screenTouch.startY = screenTouch.y;
	}
})
screen.addEventListener('mousemove', function (e) {
	e.preventDefault();
	e.stopPropagation();
	if (screenTouch.isPress && !pageOffset.isAnimating) {
		screenTouch.x = e.layerX;
		screenTouch.y = e.layerY;
		screenTouch.changeX = screenTouch.x - screenTouch.startX;
		screenTouch.changeY = screenTouch.y - screenTouch.startY;
		
		if (pageOffset.y > 0 || (pageOffset.y < screen.offsetHeight - body.offsetHeight && pageOffset.y<0) || body.offsetHeight < screen.offsetHeight) {
			pageOffset.y += screenTouch.changeY / 4;
		} else {
			pageOffset.y += screenTouch.changeY;
		}
		screenTouch.startX = screenTouch.x;
		screenTouch.startY = screenTouch.y;
		body.changeBodyPosition();
	}
})
screen.addEventListener('mouseup', function (e) {
	e.preventDefault();
	e.stopPropagation();
	if (!pageOffset.isAnimating) {
		screenTouch.isPress = false;
		pageOffset.speedX = screenTouch.changeX;
		pageOffset.speedY = screenTouch.changeY;
		screenTouch.x = -1;
		screenTouch.y = -1;
		screenTouch.changeX = 0;
		screenTouch.changeY = 0;
		screenTouch.startX = -1;
		screenTouch.startY = -1;

		if (pageOffset.y > 0 || (pageOffset.y < screen.offsetHeight - body.offsetHeight && pageOffset.y<0) || body.offsetHeight < screen.offsetHeight) {
			pageOffset.handleBack();
		} else {

		}
	}
})