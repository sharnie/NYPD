/**
 * Global object containing the functions used to download
 *
 * @type {object}
 */
window.PLAYLIST_ = [];

var listParser = {
    /**
     * Listen for audio change
     *
     */
    onMessage: function() {
        var _this = this;
        chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
            if ( message.from === 'background' ) {
                _this.listTracker( message.audio_url );
            }
            if ( message.from === 'popup' ) {
                sendResponse(PLAYLIST_);
            }
            if ( message.from === 'popup' && message.command === 'skip song' ) {
                document.querySelector( '.skipButton' ).click();
            }
        });
    },

    /**
     * Encode STRING
     *
     */
    utf8_to_b64: function( str ) {
      return window.btoa(unescape(encodeURIComponent( str )));
    },

    /**
     * Decode STRING
     *
     */
    b64_to_utf8: function( str ) {
      return decodeURIComponent(escape(window.atob( str )));
    },

    /**
     * setInterval for new song
     *
     */
    listTracker: function( audio_url ) {
        var interval = setInterval(function() {
            if( document.getElementsByClassName('trackData').length ) {
                var songTitle  = document.getElementsByClassName('songTitle'),
                    artistName = document.getElementsByClassName('artistSummary'),
                    albumTitle = document.getElementsByClassName('albumTitle');
                if( songTitle.length && artistName.length && albumTitle.length ) {
                    songTitle  = songTitle[0].innerHTML;
                    artistName = artistName[0].innerHTML;
                    albumTitle = albumTitle[0].innerHTML;
                    if( songTitle.length && artistName.length && albumTitle.length ) {
                        albumArt = $('.playerBarArt[src]').attr('src');
                        albumArt = albumArt.indexOf("no_album_art") === -1 ? albumArt : 'http://www.pandora.com/img/no_album_art.png';
                        listParser.addSong({
                            id:     listParser.utf8_to_b64( songTitle + artistName ),
                            song:   songTitle,
                            album:  albumTitle,
                            artist: artistName,
                            art:    albumArt,
                            url:    audio_url
                        });
                        clearInterval(interval);
                    }
                }
            }
        }, 2000);
    },

    /**
     * Add new song to PLAYLIST_
     *
     */
    addSong: function( songObj ) {
        if( !this.finder( songObj.id ) ) {
            PLAYLIST_.push(songObj);
        }
    },

    /**
     * Finder used to lookup existing songs
     *
     */
    finder: function( id ) {
        found = false;
        for(var i = 0; i < PLAYLIST_.length; i++) {
            if( PLAYLIST_[i].id === id ) {
                found = true;
            }
        }
        return found;
    }
};

listParser.onMessage();