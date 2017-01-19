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

	return template;
};

// Window.onload sets album param to albumPicasso object
var setCurrentAlbum = function(album) {

	// sets var ablumTitle (et al) to album-view-title class - then set to the title of albumPicasso held in the object or 'The Colors'
	var albumTitle = document.getElementsByClassName('album-view-title')[0];
	var albumArtist = document.getElementsByClassName('album-view-artist')[0];
	var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
	var albumImage = document.getElementsByClassName('album-cover-art')[0];
	var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

	// Sets var defined above > .firstChild > .nodeValue (text node in this case) to value of albumPicasso (or whichever object is passed into setCurrentAlbum from window.onload) > .title, artist, etc  
	albumTitle.firstChild.nodeValue = album.title;
	albumArtist.firstChild.nodeValue = album.artist;
	albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
	albumImage.setAttribute('src', album.albumArtUrl);

	// Set element to empty string before inserting new HTML content to make sure nothing is there
	albumSongList.innerHTML = '';

	// loops through albumSongList (which is = 'album-view-song-list') and creates song row inside inner HTML of 'album-view-song-list'
	for (var i = 0; i < album.songs.length; i++) {
		albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
	}
};

// findParentByClassName traverses up the DOM tree to find the parent with the class specified by element.parentElement

var findParentByClassName = function(element, targetClass) {
	if (element) {
		var currentParent = element.parentElement;
		while (currentParent.className != targetClass && currentParent.className !== null) {
			currentParent = currentParent.parentElement;
		}
		return currentParent;
	}
};

// returns the element with the .song-item-number class - need to go through this again with Junior

var getSongItem = function(element) {
	switch (element.className) {
		case 'album-song-button':
		case 'ion-play':
		case 'ion-pause':
		return findParentByClassName(element, 'song-item-number');
		case 'album-view-song-item':
		return element.querySelector('.song-item-number');
		case 'song-item-title':
		case 'song-item-duration':
		return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
		case 'song-item-number':
		return element;
		default:
		return;
	}  
};

// Sets functionality of on:hover for play, pause button by setting currentlyPlayingSong = the ButtonTemplates 

var clickHandler = function(targetElement) {
	var songItem = getSongItem(targetElement);

	if (currentlyPlayingSong === null) {
		songItem.innerHTML = pauseButtonTemplate;
		currentlyPlayingSong = songItem.getAttribute('data-song-number');
	} else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
		songItem.innerHTML = playButtonTemplate;
		currentlyPlayingSong = null;
	} else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
		var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
		songItem.innerHTML = pauseButtonTemplate;
		currentlyPlayingSong = songItem.getAttribute('data-song-number');
	}
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;

// Sets the starting album to 'albumPicasso'
window.onload = function() {
	setCurrentAlbum(albumPicasso);

	// Adds mouseover event listener for songListContainer which is set to 'album-view-song-list' in clickHandler
	songListContainer.addEventListener('mouseover', function(event) {
		if (event.target.parentElement.className === 'album-view-song-item') {
			// Change the content from the number to the play button's HTML
			event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
			var songItem = getSongItem(event.target);

			if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
				songItem.innerHTML = playButtonTemplate;
			}
		}
	});

	// Adds mouseleave event listener for songRows which is set to 'album-view-song-item' in clickHandler
	for (var i = 0; i < songRows.length; i++) {
		songRows[i].addEventListener('mouseleave', function(event) {
			var songItem = getSongItem(event.target);
			var songItemNumber = songItem.getAttribute('data-song-number');

			// Change the content from the play button to the song number
			if (songItemNumber !== currentlyPlayingSong) {
				songItem.innerHTML = songItemNumber;
			}
		});

		songRows[i].addEventListener('click', function(event) {
             // Event handler call
             clickHandler(event.target);
         });
	}
}