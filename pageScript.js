function GetSelectedText () {
    if (window.getSelection) {  // all browsers, except IE before version 9
        var range = window.getSelection ();
        caught = range.toString().toLowerCase();
        console.log('caught: ' + caught);
        try { definition = dictionary[caught]['definition'];
              console.log('definition: ' + definition); }
        catch(err) {}
        try { root = jQuery.grep(arr, function( n, i ) {
                return ( n.indexOf(' ' + caught + ' ') !== -1 );
            })[0].split(" ")[0];
            console.log('root: ' + root);
            try { definition = dictionary[root]['definition'];
                  console.log('definition: ' + definition); }
            catch(err) {}
        }

        catch(err) {}

    }
    else {
        // if (document.selection.createRange) { // Internet Explorer
        //     var ierange = document.selection.createRange ();
        // try
        //   {
        //     alert(dictionary[ierange.text]['definition']);
        //   }
        // catch(err) {}
        // }
    }
}

var BR = {
    ready: function() {
        // - request ze stron (stary) chrome < 26
        // chrome.extension.sendRequest('giveLocalStorage', function(response) {
        //     console.log(response);
        // });

        //nowa komunikacja chrome > 25

        //sendMessage
        // chrome.runtime.sendMessage({
        //     greeting: 'hello'
        // }, function(response) {
        //     console.log(response.farewell);
        // });

        //connect - lepsze
        var port = chrome.runtime.connect({
            name: "tlumacz"
        });
        document.addEventListener("mouseup", function() {
            var range = window.getSelection ();
            c = range.toString().toLowerCase();
            try {
                console.log(c);
                port.postMessage({caught: c});
            } catch(err) {console.log(err)}
        }
        );
        // console.log('Knock knock');
        // port.postMessage({caught: "alguno"});
        // jQuery(document).bind("dblclick", port.postMessage({caught: "alguno"}));
        port.onMessage.addListener(function(msg) {
            console.log(msg.answer)
            // if (msg.answer == "Who's there?") {
            //     console.log('Madame');
            //     port.postMessage({
            //         answer: "Madame"
            //     });
            // } else if (msg.question == "Madame who?") {
            //     console.log('Madame... Bovary');
            //     port.postMessage({
            //         answer: "Madame... Bovary"
            //     });
            // }
        });
    }
};


document.addEventListener('DOMContentLoaded', function() {
    BR.ready();
    // $(document).bind("dblclick", GetSelectedText);
});
