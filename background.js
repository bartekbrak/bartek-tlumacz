// indexedDB
var version = 35;

function logerr(e) {
    log("IndexedDB error" + e.code + ": " + e.message);
}

function log(e) {
    console.log(e);
}


log('indexedDB start ' + new Date());

var BR = {};

BR.db = null;
BR.results = [];


BR.open = function() {
    var request = indexedDB.open("tlumacz", version);
    request.onupgradeneeded = function(e) {
        BR.db = e.target.result;
        e.target.transaction.onerror = BR.onerror;

        if (BR.db.objectStoreNames.contains("definitions")) {
            BR.db.deleteObjectStore("definitions");
        }

        var store = BR.db.createObjectStore("definitions", {
            keyPath: "lemma"
        });
        log(store);

        BR.loadDefinitions();
    };
    request.onsuccess = function(e) {
        BR.db = e.target.result;
        log('request.onsuccess zakończył się powodzeniem')
        // var store = BR.db.createObjectStore("definitions", {
        //     keyPath: "lemma"
        // });
        // BR.loadDefinitions(store);
    };
    request.onerror = logerr;
};

BR.loadDefinitions = function() {
    log('Loading the definitions into Indexed DB')
    loadJSON('./dictionaries/samples/dictionary.small.json',
        function(dictionary) {
            for (var lemma in dictionary) {
                BR.addDefinitionStore(lemma, dictionary[lemma]);
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
            log('i tu!')
            return;
        } else {
            BR.results.push([result.value.text, result]);
            log('tu!')
            log(result.value.text + result);
            result.
            continue ();
        }
    };
    cursorRequest.onerror = request.onerror = logerr;
};


BR.getDefinition = function(caught) {
    var store = BR.db.transaction(["definitions"], "readonly").objectStore("definitions");
    var request = store.get(caught);
    request.onsuccess = function(e) {
        log('getDefinition success');
        log(e.target.result.name);
    };
    request.onerror = logerr;
};

BR.getOne = function(c) {
    BR.db.transaction("definitions").objectStore("definitions").get(c).onsuccess = function(event) {
      if (event.target.result != undefined)
      log("it is " + event.target.result.definition);

    };

}

BR.addDefinitionStore = function(lemma, definition) {
    log('loading lemma: ' + lemma)
    log('loading definition: ' + definition)
    var db = BR.db;
    log('got db: ' + db )
    var trans = db.transaction(["definitions"], "readwrite");
    var store = trans.objectStore("definitions");

    var request = store.put({
        "lemma": lemma,
        "definition": definition
    });
    request.onsuccess = function(e) {
        log('addDefinition success');
    };
    request.onerror = logerr;
};

BR.addDefinition = function(lemma, definition) {
    var db = BR.db;
    var trans = db.transaction(["definitions"], "readwrite");
    var store = trans.objectStore("definitions");
    var request = store.put({
        "lemma": lemma,
        "definition": definition
    });
    request.onsuccess = function(e) {
        log('addDefinition success');
    };
    request.onerror = logerr;
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
// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         log('pop!');
//         log(sender.tab ?
//             "from a content script:" + sender.tab.url :
//             "from the extension");
//         if (request.greeting == "hello")
//             sendResponse({
//                 farewell: "goodbye!"
//             });
//     });
//connect - lepsze
chrome.runtime.onConnect.addListener(function(port) {
    log(port.name);
    //poniżej moiżwemy consoloe.log zrobi dla rozmowy
    port.onMessage.addListener(function(msg) {
        // if (msg.caught == "alguno") {
        //     log('got alguno');
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
          else log("Didn't find the word " + msg.caught)

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
//             log(JSON.parse(xhr.response));
//         } else if (xhr.status != 200) {
//             log('Błąd: ' + xhr.status + '!');
//         }
//     }
// };
// xhr.open('GET', url, true);
// xhr.send();
