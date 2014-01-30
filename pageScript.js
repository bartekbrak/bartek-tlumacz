var BR = {
    ready: function() {
        var port = chrome.runtime.connect({
            name: "Zgłaszam się ze strony internetowej."
        });
        document.addEventListener("dblclick", function() {
            var range = window.getSelection();
            theword = range.toString().toLowerCase();
            if (theword.length > 1 )
                port.postMessage({caught: theword});
        });
        port.onMessage.addListener(function(msg) {
            console.log(msg.answer);
            displaytheword(msg.answer);
        });
    }
};

var displaytheword = function(explanation) {
    var div = document.createElement('div');
    var defaultTimeout = 3000;
    document.body.appendChild(div);
    div.style.position = 'fixed';
    div.style.left = '50px';
    div.style.right = '50px';
    div.style.bottom = '10px';
    div.style.height = '50px';
    div.style.backgroundColor = 'black';
    div.style.color = 'white';
    div.style.textAlign = 'center';
    div.style.lineHeight = '50px';
    div.textContent = explanation;
    div.addEventListener('mouseover', function(e) {
        fade(div);
    });
    setTimeout(function(){fade(div);}, defaultTimeout);
}

var fade = function(element) {
    var op = 1;
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}


document.addEventListener('DOMContentLoaded', BR.ready);
