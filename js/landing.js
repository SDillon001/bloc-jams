var pointsArray = document.getElementsByClassName('point'); // assigns pointsArray to each <div> class="point"

// revealPoint function executes 4 styles on point div 	
var revealPoint = function(point) {
	point.style.opacity = 1;
	point.style.transform = "scaleX(1) translateY(0)";
	point.style.msTransform = "scaleX(1) translateY(0)";
	point.style.WebkitTransform = "scaleX(1) translateY(0)";
}

// pointsArray is passed into points argument from animatePoints on line 16
var animatePoints = function(points) {
	forEach(points, revealPoint); // points is passed into the forEach callback as the array argument. revelPoint is passed in as the callback function which is looped over the points array and executed for each array element
};

// executes animatePoints function if the browser window is great than 950 pixels (for larger screens)
window.onload = function() {
	if (window.innerHeight > 950) {
		animatePoints(pointsArray);
	}

// measures the distance of the 'selling-points' from the top of the browser window
	var sellingPoints = document.getElementsByClassName('selling-points')[0];
	var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

// executes animatePoints() function if user has scrolled more than 200 pixels from top of browser window
	window.addEventListener('scroll', function(event) {
		if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
			animatePoints(pointsArray);
		}
	});
 
}