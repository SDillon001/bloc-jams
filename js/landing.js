//Refactored code to reveal ALL points by calling function animatePoints();

var animatePoints = function() {
	var points = document.getElementsByClassName('point');

		var revealPoint = function(index) {
				points[index].style.opacity = 1;
				points[index].style.transform = "scaleX(1) translateY(0)";
				points[index].style.msTransform = "scaleX(1) translateY(0)";
				points[index].style.WebkitTransform = "scaleX(1) translateY(0)";
		}

	for (var i = 0; i < points.length; i++) {
		revealPoint(i);
	}
};

// Reveal points one by one based on argument passed in, i.e. revealPoint(2);

/*var revealPoint = function(index) {

	var points = document.getElementsByClassName('point');

	for (var i = 0; i < points.length; i++) {
		points[index].style.opacity = 1;
		points[index].style.transform = "scaleX(1) translateY(0)";
		points[index].style.msTransform = "scaleX(1) translateY(0)";
		points[index].style.WebkitTransform = "scaleX(1) translateY(0)";

	}
}
*/

//Long code to reveal ALL points by calling function animatePoints();

/*
var animatePoints = function() {

	var points = document.getElementsByClassName('point');

	var revealFirstPoint = function() {
		points[0].style.opacity = 1;
		points[0].style.transform = "scaleX(1) translateY(0)";
		points[0].style.msTransform = "scaleX(1) translateY(0)";
		points[0].style.WebkitTransform = "scaleX(1) translateY(0)";
	};

	var revealSecondPoint = function() {
		points[1].style.opacity = 1;
		points[1].style.transform = "scaleX(1) translateY(0)";
		points[1].style.msTransform = "scaleX(1) translateY(0)";
		points[1].style.WebkitTransform = "scaleX(1) translateY(0)";
	};

	var revealThirdPoint = function() {
		points[2].style.opacity = 1;
		points[2].style.transform = "scaleX(1) translateY(0)";
		points[2].style.msTransform = "scaleX(1) translateY(0)";
		points[2].style.WebkitTransform = "scaleX(1) translateY(0)";
	};

	revealFirstPoint();
	revealSecondPoint();
	revealThirdPoint();

};
*/