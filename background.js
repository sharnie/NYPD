/**
 * Global object
 *
 * @type {object}
 */
var DoraExpress = {
    /**
     * Web request event listener, used to track audio urls.
     *
     * @private
     */
    audioTracker: function() {
        chrome.webRequest.onCompleted.addListener(function(details) {
            chrome.tabs.get(details.tabId, function(tab) {
                if(details.url.indexOf("access/?version=4") !== -1) {
                    chrome.tabs.sendMessage(tab.id, {
                        from: 'background',
                        audio_url: details.url
                    }, function(response){});
                }
            });
        }, { urls: ["http://*/*", "https://*/"], types: ["other"] });
    },
};

document.addEventListener('DOMContentLoaded', function(e) {
    DoraExpress.audioTracker();
});