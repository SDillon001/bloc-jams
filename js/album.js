
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
		} else if (currentlyPlayingSongNumber === songNumber) {
			if (currentSoundFile.isPaused()) {
				$(this).html(pauseButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPauseButton);
				currentSoundFile.play();
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
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
	$playButton.click(togglePlayFromPlayerBar);
});