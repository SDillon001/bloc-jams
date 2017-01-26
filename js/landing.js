var animatePoints = function() {
	var revealPoint = function() {
		$(this).css({
			opacity: 1,
			transform: 'scaleX(1) translateY(0)'
		});
	};

	$.each($('.point'), revealPoint);
};

// executes animatePoints function if the browser window is great than 950 pixels (for larger screens)
$(window).load(function() {
	if ($(window).height() > 950) {
		animatePoints();
	}

// measures the distance of the 'selling-points' from the top of the browser window
var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

// executes animatePoints() function if user has scrolled more than 200 pixels from top of browser window
$(window).scroll(function(event) {
	if ($(window).scrollTop() >= scrollDistance) {
		animatePoints();
	}
});
});