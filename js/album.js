var albumPicasso = {
	title: 'The Colors',
	artist: 'Pablo Picasso',
	label: 'Cubism',
	year: '1881',
	albumArtUrl: 'assets/images/album_covers/01.png',
	songs: [
	{ title: 'Blue', duration: '4:26' },
	{ title: 'Green', duration: '3:14' },
	{ title: 'Red', duration: '5:01' },
	{ title: 'Pink', duration: '3:21'},
	{ title: 'Magenta', duration: '2:15'}
	]
};

var albumMarconi = {
	title: 'The Telephone',
	artist: 'Guglielmo Marconi',
	label: 'EM',
	year: '1909',
	albumArtUrl: 'assets/images/album_covers/20.png',
	songs: [
	{ title: 'Hello, Operator?', duration: '1:01' },
	{ title: 'Ring, ring, ring', duration: '5:01' },
	{ title: 'Fits in your pocket', duration: '3:21'},
	{ title: 'Can you hear me now?', duration: '3:14' },
	{ title: 'Wrong phone number', duration: '2:15'}
	]
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
		var songNumber = $(this).attr('data-song-number');
		// currentlyPlayingSong is set to null, this checks if it's not null
	if (currentlyPlayingSong !== null) {
		// change to song number back from play/pause button for currently playing song because user started playing new song.
		var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
		currentlyPlayingCell.html(currentlyPlayingSong);
	}
	// if the element is not the song number
	if (currentlyPlayingSong !== songNumber) {
			// switch from Play -> Pause button to indicate new song is playing.
			$(this).html(pauseButtonTemplate);
			// set currentlyPlayingSong equal to songNumber
			currentlyPlayingSong = songNumber;
		} else if (currentlyPlayingSong === songNumber) {
			// switch from Pause -> Play button to pause currently playing song.
			$(this).html(playButtonTemplate);
			currentlyPlayingSong = null;
		}
	};

// reveals playButtonTemplate onHover  
var onHover = function(event) {
	var songNumberCell = $(this).find('.song-item-number');
	var songNumber = songNumberCell.attr('data-song-number');

	if (songNumber !== currentlyPlayingSong) {
		songNumberCell.html(playButtonTemplate);
	}
};

// reveals songNumber offHover
var offHover = function(event) {
	var songNumberCell = $(this).find('.song-item-number');
	var songNumber = songNumberCell.attr('data-song-number');

	if (songNumber !== currentlyPlayingSong) {
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

// Window.onload sets album param to albumPicasso object
var setCurrentAlbum = function(album) {

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

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;

// Sets the starting album to 'albumPicasso'
$(document).ready(function() {
	setCurrentAlbum(albumPicasso);
});