// indexedDB
var version = 17;

// http://stackoverflow.com/a/18278346
function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}


console.log('indexedDB start', new Date());

var BR = {};

BR.db = null;
BR.results = [];

BR.open = function() {
    var request = indexedDB.open("todos", version);
    request.onupgradeneeded = function(e) {
        var db = e.target.result;
        e.target.transaction.onerror = BR.onerror;

        if (db.objectStoreNames.contains("definitions")) {
            db.deleteObjectStore("definitions");
        }

        var store = db.createObjectStore("definitions", {
            keyPath: "lemma"
        });

    };
    request.onsuccess = function(e) {
        BR.db = e.target.result;
        // console.log('This is what success tastes like!')
        // BR.loadDefinitions();
    };
    request.onerror = function(e) {
        console.log('Database error: ' + e.target.errorCode);
    };
};

BR.loadDefinitions = function() {
    console.log('Loading the definitions into Indexed DB')
    loadJSON('./dictionaries/samples/dictionary.small.json',
        function(dictionary) {
            for (var lemma in dictionary) {
                BR.addDefinition(lemma, dictionary[lemma]); 
            }
        },
        function(xhr) { console.error(xhr); }
    );

}

BR.getAllTodoItems = function() {
    var db = BR.db;
    var trans = db.transaction(["definitions"], "readwrite");
    var store = trans.objectStore("definitions");
    // Get everything in the store;
    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store.openCursor(keyRange);
    BR.results = [];
    cursorRequest.onsuccess = function(e) {
        var result = e.target.result;
        if (result === null) {
            console.log('i tu!')
            return;
        } else {
            BR.results.push([result.value.text, result]);
            console.log('tu!')
            console.log(result.value.text, result);
            result.
            continue ();
        }
    };
    cursorRequest.onerror = BR.onerror;
};


BR.getDefinition = function(caught) {
    var db = BR.db;
    var trans = db.transaction(["definitions"], "readonly");
    var store = trans.objectStore("definitions");
    var request = store.get(caught);
    request.onsuccess = function(e) {
        console.log('getDefinition success');
        console.log(e.target.result.name);
    };
    request.onerror = function(e) {
        console.log(e.value);
        console.log('error');
    };
};

BR.getOne = function(c) {
    BR.db.transaction("definitions").objectStore("definitions").get(c).onsuccess = function(event) {
      if (event.target.result != undefined)
      console.log("it is " + event.target.result.definition);

    };
    
}

BR.addDefinition = function(lemma, definition) {
    var db = BR.db;
    var trans = db.transaction(["definitions"], "readwrite");
    var store = trans.objectStore("definitions");
    var request = store.put({
        "lemma": lemma,
        "definition": definition
    });
    request.onsuccess = function(e) {
        console.log('addDefinition success');
    };
    request.onerror = function(e) {
        console.log(e.value);
    };
};

BR.init = function() {
    BR.open();
};

document.addEventListener("DOMContentLoaded", BR.init, false);

// chrome extension

// - set default
// if (!localStorage.test) {
//     localStorage.test = 1;
// }

// - request ze stron (stary) chrome < 26

function onRequest(request, sender, sendResponse) {
    if (request == 'showOptions') {
        chrome.tabs.create({
            url: chrome.extension.getURL('options.html')
        });
    } 
    // else if (request == 'giveLocalStorage') {
    //     sendResponse(BR.results);
    // }
}
chrome.extension.onRequest.addListener(onRequest);

//nowa komunikacja chrome > 25
//message
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "hello")
            sendResponse({
                farewell: "goodbye!"
            });
    });
//connect - lepsze
chrome.runtime.onConnect.addListener(function(port) {
    console.log(port.name);
    //poniżej moiżwemy consoloe.log zrobi dla rozmowy
    port.onMessage.addListener(function(msg) {
        // if (msg.caught == "alguno") {
        //     console.log('got alguno');
        //     port.postMessage({
        //         answer: "someone (some person)"
        //     });
        // }
        BR.db.transaction("definitions").objectStore("definitions").
        get(msg.caught).onsuccess = function(event) {
          if (event.target.result != undefined)
                port.postMessage({
                    answer: event.target.result.definition
                });
            
        };         
    });
});

// ładowanie pliku js

// var jsonUrl = 'http://tomekf.pl/json.php',
//     error = '',
//     url = jsonUrl + '?r=' + new Date().getTime(),
//     xhr = new XMLHttpRequest();
// xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4) {
//         if (xhr.status == 200) {
//             console.log(JSON.parse(xhr.response));
//         } else if (xhr.status != 200) {
//             console.log('Błąd: ' + xhr.status + '!');
//         }
//     }
// };
// xhr.open('GET', url, true);
// xhr.send();
