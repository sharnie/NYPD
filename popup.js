var UI = {
    content: function(playlist) {

        var last = playlist[ playlist.length - 1 ];
        var template = [
            '<section class="music m-b-sm">',
                '<div class="music-cover pull-left m-r-sm">',
                  '<img id="art" src="'+ last.art +'" alt="" />',
                '</div>',
                '<div class="music-details pull-left">',
                  '<div id="song-title" class="music-label font-bold">'+ last.song +'</div>',
                  '<div id="artist-name" class="music-label">'+ last.artist +'</div>',
                  '<div id="album-title" class="music-label">'+ last.album +'</div>',
                '</div>',
            '</section>',
            '<a href="'+ last.url +'" id="download-btn" class="btn-primary font-bold text-center block btn-download" download="'+ (last.artist + ' - ' + last.song + ' - ' + last.album + '.mp4') +'">Download</a>',
            '<a href="#" id="next-btn" class="btn-primary font-bold text-center block btn-next">Next</a>',
            '<input type="text" value="'+ last.url +'" class="audio-url" />'
        ];

        document.getElementById('content').innerHTML = template.join("\n");
    },

    pandoraTab: function( callback ) {

        chrome.tabs.query({}, function( tabs ) {
            for ( var i = 0; i < tabs.length; i++ ) {
                if ( tabs[i].url.indexOf("pandora") !== -1 ) {
                    if ( typeof callback === 'function' ) callback( tabs[i] );
                    return false;
                }
            }
        });
    }
};

window.addEventListener('DOMContentLoaded', function() {

    UI.pandoraTab(function( tab ) {
        chrome.tabs.sendMessage( tab.id, { from: 'popup' }, UI.content );
    });

    var search = setInterval(function() {
        var nextBtn = document.getElementById( 'next-btn' );
        if ( nextBtn ) {
            clearInterval( search );
            document.getElementById( 'next-btn' ).addEventListener('click', function() {
                UI.pandoraTab(function( tab ) {
                    chrome.tabs.sendMessage( tab.id, { from: 'popup', command: 'skip song' } );
                });
            });
        }
    }, 100);
});
