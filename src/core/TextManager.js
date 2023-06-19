function processText (text) {
    const words = text.toLowerCase().match(/[a-z]+/gi);

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].replace(/[^\wa-z]/gi, '');
    }
    return words
}

function setWords() {
   GameManager.words = processText(GameManager.text)
}