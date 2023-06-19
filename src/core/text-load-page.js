const MIN_WORDS_QUANTITY = 20
const MAX_WORDS_QUANTITY = 1000
let $dropArea = $('#dropArea');
let $textArea = $('#text')
let $start = $('#start')
let $charCount = $('#number')
let standardText = false

function addListeners () {
   $(window).on('beforeunload', handleRefreshButton)
    $(window).on('load', windowLoadEventHandler)
    $(window).on('popstate', handlePopState)
    $dropArea.on( 'dragover',  handleFileDragOver);
    $dropArea.on( 'drop',  handleFileDropOver);
    $textArea.on("input", countCharsInText)
    standardTextCheckBoxHandler()
    $start.on( "click",  function(e) {
        validateInput(e)
    } );
}

function validateInput(e) {
    if(!standardText) {
        e.preventDefault()
        let textContent = $('textarea').val().trim();
        if (textContent.length === 0) {
            setError('Error: Please, paste your text.')
        } else {
            let words = processText(textContent);
            if (words.length < MIN_WORDS_QUANTITY) {
                setError(`Error: Please, paste a text with at least ${MIN_WORDS_QUANTITY} words.`)
            } else if (words.length > MAX_WORDS_QUANTITY) {
                setError(`Error: Please, paste a text with max ${MAX_WORDS_QUANTITY} words.`)
            } else {
                storeItemInLocalStorage('text', textContent)
                location.href = 'index.html?loaded=1'
            }
        }
    }
    else
    {
        location.href = 'index.html'
    }
}


function setError(error) {
    $('#error').text(error).css('background-color', '#e34234')
    $('textarea').css(
        'border', 'solid 1px red'
    )
    $('#keyboard rect').attr("fill", "red");
}

function handleFileDragOver(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    let originalEvent = ev.originalEvent;
    if (originalEvent.dataTransfer) {
        originalEvent.dataTransfer.dropEffect = 'copy';
    }
}

function pasteTextInArea(text) {
    $textArea.val(text)
    countCharsInText()
}

function handleFileDropOver(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    let dataTransfer = ev.originalEvent.dataTransfer;
    if (!dataTransfer) {
        console.log('Error" event.dataTransfer is not present.');
        return;
    }
    let file = dataTransfer.files[0];

    if (file.type === 'text/plain') {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
            pasteTextInArea(event.target.result);
        };
    } else {
        setError('Error: only .txt files are supported.')
    }
}


function countCharsInText() {
    let text = $textArea.val();
    let wordsCount = text.trim().split(/\s+/).length
    $charCount.text(wordsCount)
    if (wordsCount < MIN_WORDS_QUANTITY
        || wordsCount > MAX_WORDS_QUANTITY) {
        $charCount.css('color','red');
    } else {
        $charCount.css('color','green');
    }
    const textareaId = 'textarea1';
    storeItemInLocalStorage('savedText', text)
}







function standardTextCheckBoxHandler() {
    $('#checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            standardText = true
        } else {
            standardText = false
        }
    });
}


/*
 * Save user text before refresh.
 */
function handleRefreshButton() {
    let timestamp = Date.now();
    let id = 'text_' + timestamp;
    let text = $textArea.val();
    let stateObj = { textId: id };

    if (text !== null && text.length !== 0) {
        storeItemInLocalStorage(id, text);
        history.pushState(stateObj, "", "");
    }

}

/*
Handle pop state, paste text with unique id
 */
function handlePopState() {
    let state = history.state;

    if (state && state.textId) {
        let txt = getLocalStorageItem(state.textId);
        $textArea.val(txt);
        countCharsInText()
    } else {
        $textArea.val('');
    }
}


/*
 * Paste the latest saved text
 */
function windowLoadEventHandler() {
    checkNavigatorConnection()
    let keys = Object.keys(localStorage);
    let latestId = keys.reduce(function(prevId, currentId) {
        if (currentId.startsWith('text_')) {
            return Math.max(prevId, parseInt(currentId.slice(5)));
        }
        return prevId;
    }, 0);

    if (latestId !== 0) {
        let txt = getLocalStorageItem('text_' + latestId);
        $textArea.val(txt);
        countCharsInText();
    }
}



$(
    addListeners()
)





