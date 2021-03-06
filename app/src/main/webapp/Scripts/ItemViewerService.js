/*
 This code implements the XDM API for use within item preview app.
 */

(function (XDM, CM) {

    var isIrisReady = false;

    // we load one page in advance, but we don't want that to cause a cascade of page show/load
    Blackbox.getConfig().preventShowOnLoad = false;
    //Adding this onto TDS for now so it is available in the dictionary handler.
    var irisUrl = location.href;
    Blackbox.getConfig().baseUrl = irisUrl;
    ContentManager.Dialog.urlFrame = "Pages/DialogFrame.aspx";

    var buttonsLoaded = false;
    // Functions that are used by toolbar buttons

    //Calculator
    var calculatorBtn = function(ev) {
        var currentPage = ContentManager.getCurrentPage();
        if (currentPage) {
            Calculator.toggle();
        }
    };

    //Global Notes
    var globalNotesBtn = function(ev) {
        var currentPage = ContentManager.getCurrentPage();
        if (currentPage && TDS.Notes) {
            TDS.Notes.open();
        }
    };

    //Masking
    var showMask = function(ev) {
        var currentPage = ContentManager.getCurrentPage();
        if (currentPage) {
            Masking.toggle();
        }
    };

    var dictionaryBtn = function(ev) {
        var currentPage = ContentManager.getCurrentPage();
        if (currentPage) {
            Dictionary.toggle();
        }
    };

    var comments = function(ev){
        var currentPage = ContentManager.getCurrentPage();
        var currentItem = ContentManager.getCurrentEntity();

        if (currentPage && TDS.Notes && currentItem) {
            var itemId = getItemId(currentItem);
            TDS.Notes.open({"id": itemId, "type": TDS.Notes.Types.TextArea});
        }
    };


    // setup cross domain api
    XDM.init(window);

    function isGlobalNotesEnabled(){
        return TDS.getAccommodationProperties().existsAndNotEquals('Global Notes', 'TDS_GN0');

    }

    function getItemId(item) {
        return "I-" + item.bankKey + "-" + item.itemKey;
    }

    function getItemMap(requestedItems) {
        var distinctItemCount = 0;

        var itemMap = requestedItems.reduce(function (map, item) {
            ++distinctItemCount;
            map[getItemId(item)] = item;
            return map;
        }, {});

        if (requestedItems.length !== distinctItemCount) {
            throw new Error('One or more of the requested items appears multiple times in this request.');
        }

        return itemMap;
    }

    function getExistingPage(requestedItems) {

        var requestedItemCount = Object.keys(requestedItems).length,
            partialMatches = false,
            matchedPage = null,
            matchedItems = null;

        // go through each page to try matching items
        CM.getPages().forEach(function (page) {
            var items = page.getItems(),
                matches = [];

            // check this page for items which are in the current content request
            items.forEach(function (item) {
                var itemId = getItemId(item),
                    matchedItem = requestedItems[itemId];

                if (matchedItem) {
                    matches.push({
                        loaded: item,
                        requested: matchedItem
                    });
                }
            });

            if (matches.length === items.length && items.length === requestedItemCount) {
                // exact match, save the page and items
                matchedPage = page;
                matchedItems = matches;
            } else if (matches.length) {
                // only some items matched
                partialMatches = true;
            }
        });

        if (partialMatches) {
            throw new Error('One or more of the items requested have already been loaded. Make sure the content request is the same as the orginal (e.g. it can\'t contain different response or label values).');
        }

        return {
            page: matchedPage,
            itemPairs: matchedItems
        };
    }

    function loadContent(xmlDoc, scrollToDiv) {
        if (typeof xmlDoc == 'string') {
            xmlDoc = Util.Xml.parseFromString(xmlDoc);
        }

        // create array of content json from the xml
        var deferred = $.Deferred();
        var contents = CM.Xml.create(xmlDoc);
        var content = contents[0];

        var itemMap = getItemMap(content.items);
        var result = getExistingPage(itemMap);

        //if the page is already loaded we want to force a reload because the accommodations may have changed.
        if (result.page) {
            // show the page
            TDS.Dialog.hideProgress();
            ContentManager.removePage(result.page);
            // If there is a word list loaded clear the cached words because they may have changed.
            if(window.WordListPanel){
                window.WordListPanel.clearCache();
            }
        }

       var page = CM.createPage(content);

        page.render();
        page.once('loaded', function () {
            TDS.Dialog.hideProgress();
            page.show();
            deferred.resolve();
            if(scrollToDiv) {
                var el = document.getElementById(scrollToDiv);
                if(el){
                    el.scrollIntoView();
                }

            }
        });

        ContentManager.onItemEvent("comment", function(ev) {
            comments(ev);
        });

        if (TDS.getAccommodationProperties().hasMaskingEnabled()) {
            Blackbox.showButton('btnMask', showMask, true);
        }

        if(isGlobalNotesEnabled()){
            Blackbox.showButton('btnGlobalNotes', globalNotesBtn, true);
        }
        if (TDS.getAccommodationProperties().hasCalculator()) {
            Blackbox.showButton('btnCalculator', calculatorBtn, true);
        }

        if (TDS.getAccommodationProperties().isDictionaryEnabled()) {
            Blackbox.showButton('btnDictionary', dictionaryBtn, true);
        }

        if (TDS.getAccommodationProperties().showItemToolsMenu()) {
            $(".itemTools").addClass("toolsContainer");
        }

        var printSize = CM.getAccProps().getPrintSize();
        if(printSize) {
            CM.getZoom().setLevel(printSize, true);
        } else {
            CM.getZoom().setLevel(0, true);
        }

        return deferred.promise();
    }

    //function that is passed to Blackbox.changeAccommodations to modify the accommodations
    //in our case we just want to clear out any accommodations that are set.
    function clearAccommodations(accoms) {
        accoms.clear()
    }

    //parses any accommodations from the token, and sets them on the Blackbox.
    function setAccommodations(token) {
        var parsed = JSON.parse(token);
        //Call changeAccommodations once to reset all accommodations to their default values
        Blackbox.changeAccommodations(clearAccommodations);
        if(parsed.hasOwnProperty('accommodations')) {
            Blackbox.setAccommodations(parsed['accommodations']);
            //Call changeAccommodations a second time to apply the new accommodations that were set
            //by setAccommodations
            Blackbox.changeAccommodations(function(accoms){})
        }
    }


    function loadToken(vendorId, token, scrollToDivId, readOnly) {
        var deferred = $.Deferred();
        blackBoxReady.then(function(){
            loadContentPromise(vendorId, token)
                .then(function(value) {
                    deferred.resolve(value);
                })
                .catch(function(error){
                    var errorMsg = "error: " + error + " with loading token " + token;
                    console.log(errorMsg);
                    deferred.reject(errorMsg);
                }
            );
        });
        return deferred;
    }

    
    var loadContentPromise = function(vendorId, token, scrollToDivId, readOnly){
        return new Promise(
            function(resolve, reject ) {
                Messages.set('TDS.WordList.illustration', 'Illustration', 'ENU');
                var url = irisUrl + '/Pages/API/content/load?id=' + vendorId;
                TDS.Dialog.showProgress();
                if(readOnly === true){
                    CM.setReadOnly(true);
                }
                setAccommodations(token);
                $.post(url, token, null, 'text').then(function (data) {
                    loadContent(data, scrollToDivId).then(resolve);
                }).fail(function (xhr, status, error){
                    TDS.Dialog.hideProgress();
                    reject(error);
                });
            }
        );
    };

    var blackBoxReady = new Promise(
        function(resolve){
            if(isIrisReady){
                resolve(true);
            }else{
                Blackbox.events.on('ready', function () {
                    resolve(true);
                });
            }
        }
    );


    XDM.addListener('IRiS:loadToken', loadToken);

    Blackbox.events.on('ready', function () {
        Blackbox.fireEvent('IRiS:Ready')
        isIrisReady = true;
    });

})(window.Util.XDM, window.ContentManager);