// || ** Setting the Currently Playing Audio File ** ||
var setSong = function(songNumber) {
	// tests to see if a song is already playing to avoid multiple songs playing at once
	if (currentSoundFile) {
		currentSoundFile.stop();
	}

	// parseInt converts song number to integer
	currentlyPlayingSongNumber = parseInt(songNumber);
	currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

	// creates new audio file using buzz API 
	// http://buzz.jaysalvat.com/documentation/sound/
	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, { 
		formats: [ 'mp3' ],
		preload: true
	});

	var seek = function(time) {
		if (currentSoundFile) {
			currentSoundFile.setTime(time);
		}
	}

	// call currentVolume variable and set default to 80
	setVolume(currentVolume);
};

// wraps the Buzz setVolume() method with a conditional statement that checks to see if a  currentSoundFile exists and sets volume
var setVolume = function(volume) {
	if (currentSoundFile) {
		currentSoundFile.setVolume(volume);
	}
};

var getSongNumberCell = function(number) {
	return $('.song-item-number[data-song-number="' + number + '"]');
};


// Template function to create song row html called by the for loop in setCurrentAlbum function
var createSongRow = function(songNumber, songName, songLength) {
	var template =
		'<tr class="album-view-song-item">'
		+ '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
		+ '  <td class="song-item-title">' + songName + '</td>'
		+ '  <td class="song-item-duration">' + songLength + '</td>'
		+ '</tr>'
		;

	var $row = $(template);

var clickHandler = function() {
	// sets songNumber equal to the value of 'data-song-number'
	var songNumber = parseInt($(this).attr('data-song-number'));
	// currentlyPlayingSong is set to null, this checks if it's not null
	if (currentlyPlayingSongNumber !== null) {
		// change to song number back from play/pause button for currently playing song because user started playing new song.
		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	}

	// if the element is not the song number
	if (currentlyPlayingSongNumber !== songNumber) {
		// switch from Play -> Pause button to indicate new song is playing.
		$(this).html(pauseButtonTemplate);
		// set currentlyPlayingSong equal to songNumber
		setSong(songNumber);
		currentSoundFile.play();
		updatePlayerBarSong();
		updateSeekBarWhileSongPlays();

		var $volumeFill = $('.volume .fill');
		var $volumeThumb = $('.volume .thumb');
		$volumeFill.width(currentVolume + '%');
		$volumeThumb.css({left: currentVolume + '%'});
	} else if (currentlyPlayingSongNumber === songNumber) {
		if (currentSoundFile.isPaused()) {
			$(this).html(pausedButtonTemplate);
			$('.main-controls .play-pause').html(playerBarPauseButton);
			currentSoundFile.play();
			updateSeekBarWhileSongPlays();
		} else {
			$(this).html(playButtonTemplate);
			$('.main-controls .play-pause').html(playerBarPlayButton);
			currentSoundFile.pause();
		}
	}
};

// reveals playButtonTemplate onHover  
var onHover = function(event) {
	var songNumberCell = $(this).find('.song-item-number');
	var songNumber = parseInt(songNumberCell.attr('data-song-number'));

	if (songNumber !== currentlyPlayingSongNumber) {
		songNumberCell.html(playButtonTemplate);
	}
};

// reveals songNumber offHover
var offHover = function(event) {
	var songNumberCell = $(this).find('.song-item-number');
	var songNumber = parseInt(songNumberCell.attr('data-song-number'));


	if (songNumber !== currentlyPlayingSongNumber) {
		songNumberCell.html(songNumber);
	}

};

	// find the element with the .song-item-number class that's contained in whichever row is clicked and execute the callback we pass to it when the target element is clicked
	$row.find('.song-item-number').click(clickHandler);
	// combines mouseover and mouseleave functions
	$row.hover(onHover, offHover);
	// return $row, which is created with the event listeners attached
	return $row;
};

// || ** Building the Album Information / Image and Song List on the page ** ||  

// Window.onload sets album param to albumPicasso object
var setCurrentAlbum = function(album) {
	currentAlbum = album;

	// sets var ablumTitle (et al) to album-view-title class - then set to the title of albumPicasso held in the object or 'The Colors'
	var $albumTitle = $('.album-view-title');
	var $albumArtist = $('.album-view-artist');
	var $albumReleaseInfo = $('.album-view-release-info');
	var $albumImage = $('.album-cover-art');
	var $albumSongList = $('.album-view-song-list');

	// Sets var defined above to value of albumPicasso (or whichever object is passed into setCurrentAlbum from window.onload) > .title, artist, etc  
	$albumTitle.text(album.title);
	$albumArtist.text(album.artist);
	$albumReleaseInfo.text(album.year + ' ' + album.label);
	$albumImage.attr('src', album.albumArtUrl);

	// Set element to empty string before inserting new HTML content to make sure nothing is there
	$albumSongList.empty();

	// loops through albumSongList (which is = 'album-view-song-list') and creates song row by appending $albumSongList ('album-view-song-list') with elements in var $newRow
	for (var i = 0; i < album.songs.length; i++) {
		var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
		$albumSongList.append($newRow);
	}
};

// || ** Toggling from Play to Pause on Bottom Bar Player ** || 
var togglePlayFromPlayerBar = function() {
	if (currentSoundFile) {
		// if song is paused and play button is clicked in the player bar
		if (currentSoundFile.isPaused()) {
			// then => change the song number cell from play button to pause button
			var songNumberCell = $(this).find('.song-item-number');
			songNumberCell.html(pauseButtonTemplate);
			// change the HTML of the player bar's play button to pause button
			$('.main-controls .play-pause').html(playerBarPauseButton);
			// play the song
			currentSoundFile.play();

		// if a song is playing and the pause button is clicked
		} else {
			// then => change the song number cell from puase button to play button
			var songNumberCell = $(this).find('.song-item-number');
			songNumberCell.html(playButtonTemplate);
			// change the HTML of the player bar's pause button to play button
			$('.main-controls .play-pause').html(playerBarPlayButton);
			// pause the song
			currentSoundFile.pause();
		}
	}
};

var updateSeekBarWhileSongPlays = function() {
	if (currentSoundFile) {
		// bind() the timeupdate event to currentSoundFile. timeupdate is a custom Buzz event that fires repeatedly while time elapses during song playback.
		currentSoundFile.bind('timeupdate', function(event) {
			// We use Buzz's  getTime() method to get the current time of the song and the getDuration() method for getting the total length of the song. Both values return time in seconds.
			var seekBarFillRatio = this.getTime() / this.getDuration();
			var $seekBar = $('.seek-control .seek-bar');

			updateSeekPercentage($seekBar, seekBarFillRatio);

		});
	}
};

// function to update the seekbar position on the Player Bar
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
	// multiply the ratio by 100 to determine a percentage
	var offsetXPercent = seekBarFillRatio * 100;

	// Math.max() and Math.min() function to make sure percentage is not less than 0 and not more than 100.
	offsetXPercent = Math.max(0, offsetXPercent);
	offsetXPercent = Math.min(100, offsetXPercent);

	// convert percentage to a string and add the % character
	var percentageString = offsetXPercent + '%';
	// by setting the width of the .fill and left value of .thumb CSS interprets the value as a percent instead of a unit-less number between 0 and 100
	$seekBar.find('.fill').width(percentageString);
	$seekBar.find('.thumb').css({left: percentageString});
};

	// method for determining the  seekBarFillRatio
var setupSeekBars = function() {
	// find all elements in the DOM with a class of  "seek-bar" that are contained within the element with a class of "player-bar"
	var $seekBars = $('.player-bar .seek-bar');

	$seekBars.click(function(event) {
		// pageX holds the X (or horizontal) coordinate at which the event occured
		// subtract the offset() of the seek bar held in $(this) from the left side
		var offsetX = event.pageX - $(this).offset().left;
		var barWidth = $(this).width();

		// divide offsetX by the width of the entire bar to calculate  seekBarFillRatio
		var seekBarFillRatio = offsetX / barWidth;

		// Checks the class of the seek bar's parent to determine whether the current seek bar is changing the volume or seeking to a song position
		if($(this).parent().attr('class') == 'seek-control') {
			// If it's the playback seek bar, seek to the position of the song determined by the seekBarFillRatio
			seek(seekBarFillRatio * currentSoundFile.getDuration());
		} else {
			// set the volume based on the seekBarFillRatio
			setVolume(seekBarFillRatio * 100);
		}

		// we pass $(this) as the $seekBar argument and seekBarFillRatio for its eponymous argument to updateSeekBarPercentage()
		updateSeekPercentage($(this), seekBarFillRatio);
	});

	// find elements with a class of .thumb inside our $seekBars and add an event listener for the mousedown event
	$seekBars.find('.thumb').mousedown(function(event) {
		// taking the context of the event and wrapping it in jQuery. In this scenario, $(this) will be equal to the .thumb node that was clicked
		var $seekBar = $(this).parent();

		// bind() behaves similarly to addEventListener() => http://api.jquery.com/bind/
		$(document).bind('mousemove.thumb', function(event) {
			var offsetX = event.pageX - $seekBar.offset().left;
	        var barWidth = $seekBar.width();
	        var seekBarFillRatio = offsetX / barWidth;

	        updateSeekPercentage($seekBar, seekBarFillRatio);
		});

		// bind the mouseup event with a .thumb namespace
		$(document).bind('mouseup.thumb', function() {
			$(document).unbind('mousemove.thumb');
			$(document).unbind('mouseup.thumb');
		});
	});
};

// returns the index of a song found in album's songs array
var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
};

// When we call the next and previous functions in our application, they should increment or decrement the index of the current song in the array, respectively.

var nextSong = function() {

	var getLastSongNumber = function(index) {
		return index == 0 ? currentAlbum.songs.length : index;
	};

	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	// incrementing 'song' here
	currentSongIndex++;

	if (currentSongIndex >= currentAlbum.songs.length) {
		currentSongIndex = 0;
	}

	// set a new current song
	setSong(currentSongIndex + 1);
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();
	currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

	// Update the Player Bar information
	$('.currently-playing .song-name').text(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
	$('.main-controls .play-pause').html(playerBarPauseButton);

	var lastSongNumber = getLastSongNumber(currentSongIndex);
	var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

	$nextSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);

};

// When we call the next and previous functions in our application, they should increment or decrement the index of the current song in the array, respectively.

var previousSong = function() {

	var getLastSongNumber = function(index) {
		return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
	};

	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	// decrementing the currentSongIndex here instead of incrementing
	currentSongIndex--;

	if (currentSongIndex < 0) {
		currentSongIndex = currentAlbum.songs.length - 1;
	}

	// set a new current song
	setSong(currentSongIndex + 1);
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();
	currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

	// update the Player Bar information
	$('.currently-playing .song-name').text(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
	$('.main-controls .play-pause').html(playerBarPauseButton);

	var lastSongNumber = getLastSongNumber(currentSongIndex);
	var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

	$previousSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);

};

// Toggle the name from the <h2> tags that contain the song name and the artist name into bottom player bar
var updatePlayerBarSong = function() {

	$('.currently-playing .song-name').text(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
	$('.main-controls .play-pause').html(playerBarPauseButton);

};

// || ** Variable List ** ||
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span';
var playerBarPauseButton = '<span class="ion-pause"></span';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null; // sets current song to null before assignment
var currentVolume = 80; // sets default start volume

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playButton = $('.main-controls .play-pause');

// Sets the starting album to 'albumPicasso' and sets click handlers for previous and next buttons in Player Bar
$(document).ready(function() {
	setCurrentAlbum(albumPicasso);
	setupSeekBars();
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
	$playButton.click(togglePlayFromPlayerBar);
});