let $newGameButton = $("#newGame");
let $loadTextButton = $("#loadText");
let $restartButton = $("#restartButton")
let $backToMenuButton = $('#backToMenuButton')
let $statistics = $('#statisticsButton')
let $statisticsTable = $('.statisticsTable');
let $volumeButton = $('#volumeButton');
let $volumeOnButton = $('#volume-on')[0];
let $volumeOffButton = $('#volume-off')[0];
function prepare() {
    appendMessage('Press Space to start')
    showPauseButton()
    GameManager.phase = GameSettings.gamePhase.readyToPlay
}

function processMenu() {
    $newGameButton.on("click", function () {
        hideMainMenu()
        prepare();
    });
    createStars();
    $loadTextButton.on("click", function () {
        location.href = 'text-load.html';
    });

    $restartButton.on('click', () => {
        clearGame()
        prepare()
    })

    $statistics.on('click', () => {
        showStatistics()
    })

    $backToMenuButton.on('click', backToMenu)
    pauseAndPlayHandlerInitialize();

    $volumeButton.on('click', showVolumeButtons)
}

function hideMainMenu() {
    hideStatistics()
    $newGameButton.parent().hide()
}

function showMainMenu() {
    $newGameButton.parent().show()
}

function checkLoadPageRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('loaded');

    if(myParam === '1') {
        GameManager.text = getLocalStorageItem("text")
        GameManager.words = processText(GameManager.text)
        $newGameButton.click()
    }

}

function writeMessage(text) {
    clearMessages();
    appendMessage(text)
}

function showPauseMenu(hideMessage) {
    $('.pauseMenu').css(
        'display', 'block'
    )
    if(hideMessage) {
        $('.message').hide()
    }
}

function hidePauseMenu() {
    $('.pauseMenu').hide()
    $('.message').css(
        'display', 'block'
    )
}

function hidePauseButton() {
    $('#button').hide()
}

function showPauseButton() {
    $('#pauseButton')[0].style.display = 'inline';
    $('#playButton')[0].style.display = 'none';
    $('#button').show()
}
function pauseAndPlayHandlerInitialize() {
    let $button = $('#button');
    function handle() {
        if(GameManager.phase !== GameSettings.gamePhase.mainMenu &&
            GameManager.phase !== GameSettings.gamePhase.countDownToStart &&
            GameManager.phase !== GameSettings.gamePhase.winGame)
        {
            let pause = $('#pauseButton')[0]
            let play = $('#playButton')[0]
            if (pause.style.display !== 'none') {
                pauseGame()
                showPauseMenu(true)
                pause.style.display = 'none';
                play.style.display = 'inline';
            } else {
                hidePauseMenu()
                continueGame()
                pause.style.display = 'inline';
                play.style.display = 'none';
            }
        }
    }
    $button.on("click", handle)
    $(window).keydown(function(e) {
        if (e.key == 'Escape')
        {
            handle()
        }
    })
}

function appendMessage(text) {
    $('#messageContainer')
        .append('<div class="message">'+text+'</div>'
        );
}

function clearMessages() {
    $('#messageContainer').empty();
}

function countDown(n) {
    GameManager.player.flyBack()
    GameManager.phase = GameSettings.gamePhase.countDownToStart;
    for(let i = n; i >= 1; i--) {
        setTimeout(writeMessage,
            GameSettings.countDownGap * (n-i),
            i)
    }

    setTimeout(clearMessages,
        (n)*
        GameSettings.countDownGap)

    setTimeout(startGame,
        (n)*
        GameSettings.countDownGap)
}

function updateProgressBar() {
    let progress =
        (GameManager.asteroids.totalFilledAsteroids
            / GameManager.words.length) * 100;
    $('.progress-bar').css('width', progress + '%');
}

function hideProgressBar() {
    $('.progress-bar').css('width', 0 + '%');
}

function showVolumeButtons() {
    if ($volumeOnButton.style.display !== 'none') {
        $volumeOnButton.style.display = 'none';
        $volumeOffButton.style.display = 'inline';
        volumeOff()
    } else {
        $volumeOnButton.style.display = 'inline';
        $volumeOffButton.style.display = 'none';
        volumeOn()
    }
}



function showStatistics()
{
    if($statisticsTable.css('display') === 'none')
    {
        fillWithStats()
        $statisticsTable.show()
    }
    else
    {
        $statisticsTable.hide()
    }
}

function hideStatistics() {
    $statisticsTable.hide()
}




