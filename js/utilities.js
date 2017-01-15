

var forEach = function(array, callback) {
	for (var i = 0; i < array.length; i++) { // loop through points array passed in from animatePoints() function
		callback(array[i]);	// executing a function passed in from forEach loop, in this case revealPoints(); function
	}
}
