Link to Project on **GitHub Pages: [Bloc-Jams](http://gitfolio.stevedillon.net/)**

# Bloc-Jams Case Study

## Project Summary
___
**[Bloc Jams](http://stevedillon.net/bloc/bloc-jams/)** is a digital music player project application built during the [Bloc Front-End Web Developer](https://www.bloc.io/) course. It is made up of HTML, CSS, JavaScript and jQuery. For learning purposes, the first version of Bloc Jams was written with vanilla JavaScript and then re-factored into jQuery for the final version of the application.

## Background
___

This application is one of three projects completed during the Front-End Foundations training portion of the Bloc Web Developer Track. As a student of this course, I followed the course curriculum and collaborated with a mentor to author this project.

Students were provided with the logo, icons, background images and mp3 music files for use in the site.

## Objective
___

The main function of the **Bloc Jams** application is to display an album view and play music files. The project began with creating the landing page and a link to an album called 'collection' view.

The album cover and title information were created dynamically by creating an album template using JavaScript in a function called `buildCollectionItemTemplate`:

```JavaScript
var buildCollectionItemTemplate = function() {
   var template =
   '<div class="collection-album-container column fourth">'
   + '  <img src="assets/images/album_covers/01.png"/>'
   + '  <div class="collection-album-info caption">'
   + '    <p>'
   + '      <a class="album-name" href="album.html"> The Colors </a>'
   + '      <br/>'
   + '      <a href="album.html"> Pablo Picasso </a>'
   + '      <br/>'
   + '      X songs'
   + '      <br/>'
   + '    </p>'
   + '  </div>'
   + '</div>'
   ;
   return $(template);
};
```

The HTML created in the `$template` variable was called using a `$(window).load(function()`:

```JavaScript
$(window).load(function() {
    var $collectionContainer = $('.album-covers');
    
    $collectionContainer.empty();

    for (var i = 0; i < 12; i++) {
     var $newThumbnail = buildCollectionItemTemplate();
     $collectionContainer.append($newThumbnail);
  }
});
```
___

Students were also tasked with creating a songplayer UI that would be linked to by clicking on an album name on the album collection view page.

In addition to a song list, the project requirements included the ability to switch between song tracks, pause, play and update the total duration in minutes for each track. Song transition was needed in two locations, in the song list grid in the center of the album page as well as at the buttons in the player bar at the bottom of the page. 

___

### Song Play

Songs are initialized in the application using [Buzz! - a JavaScript HTML5 audio library](http://buzz.jaysalvat.com/documentation/sound/). On page load, the first song is initialized by setting the `songNumber` using the Buzz library in the function `setSong`: 

```JavaScript
var setSong = function(songNumber) {

    if (currentSoundFile) {
        currentSoundFile.stop();
    }

    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, { 
        formats: [ 'mp3' ],
        preload: true
    });

    setVolume(currentVolume);
};
```

___

### Song Selection

A `clickhandler` function makes each song row clickable allowing the user to toggle play / pause each song from the row. 

```JavaScript
var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));
    if (currentlyPlayingSongNumber !== null) {
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }

    if (currentlyPlayingSongNumber !== songNumber) {
        $(this).html(pauseButtonTemplate);
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
            $(this).html(pauseButtonTemplate);
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
```

___

Additionally, the `togglePlayFromPlayerBar` function allows the user to toggle play / pause each song from the player bar at the bottom of the page.

```JavaScript
var togglePlayFromPlayerBar = function() {
    if (currentSoundFile) {
        if (currentSoundFile.isPaused()) {
            var songNumberCell = $(this).find('.song-item-number');
            songNumberCell.html(pauseButtonTemplate);
            $playButton.html(playerBarPauseButton);
            currentSoundFile.play();
        } else {
            var songNumberCell = $(this).find('.song-item-number');
            songNumberCell.html(playButtonTemplate);
            $playButton.html(playerBarPlayButton);
            currentSoundFile.pause();
        }
    }
};
```

___

Users can also skip to specific points in a song using the seek bar or adjust the volume using the volume control on the bottom player bar.

## Results
___

The result is a fully functioning, digital music player created using HTML5, CSS, and JavaScript. 

## Conclusion
___

When I took this project on, I had limited experience with JavaScript, therefore, this project was a bit challenging for me. In the end, I gained a greater understanding of how to add functionality to an application using JavaScript, skills that I will no doubt apply to future projects.






