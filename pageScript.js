var BR = {
    ready: function() {
        var port = chrome.runtime.connect({
            name: "Zgłaszam się ze strony internetowej."
        });
        document.addEventListener("mouseup", function() {
            var range = window.getSelection ();
            c = range.toString().toLowerCase();
            port.postMessage({caught: c});
        });
        port.onMessage.addListener(function(msg) {
            console.log(msg.answer)
        });
    }
};


document.addEventListener('DOMContentLoaded', BR.ready);
