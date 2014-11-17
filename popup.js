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
            '<a href="'+ last.url +'" id="download-btn" class="btn-primary font-bold text-center block btn-download"download="'+ (last.song + ' - ' + last.artist + ' - ' + last.album + '.mp4') +'">Download</a>'
        ];
        template = template.join("\n");
        document.getElementById('content').innerHTML = template;
    }
};

window.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({}, function( tabs ) {
        for(var i = 0; i < tabs.length; i++) {
            if( tabs[i].url.indexOf("pandora") !== -1 ) {
                chrome.tabs.sendMessage(tabs[i].id, { from: 'popup' }, UI.content);
                return false;
            }
        }
    });
});