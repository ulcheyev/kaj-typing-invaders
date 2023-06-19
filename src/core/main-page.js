/*==============================================================================
RESETS
==============================================================================*/
function resetBullets(){
    if(GameManager.bullets !== undefined) {
        GameManager.bullets.reset()
    }else{
        GameManager.bullets = new BulletCollection(GameManager.player)
    }
}

function resetAsteroids(){
    if(GameManager.asteroids !== undefined) {
        GameManager.asteroids.reset()
    }else{
        GameManager.asteroids = new AsteroidCollection(GameManager.player, GameManager.bullets)
    }
}

function resetExplosions() {
    GameManager.explosions = new Explosions('explosion00_s')
}

function resetPlayer(){
    if(GameManager.player === undefined) {
        let asset = GameManager.assets['playerShip']
        let height = GameSettings.playAreaHeight - 80;
        let width = GameSettings.playAreaWidth - 80;
        GameManager.player = new Player(
            GameSettings.playerDivName,
            new Point(GameSettings.playerStartPos.x, GameSettings.playerStartPos.y),
            asset,
            new Rectangle(40, 40, width, height))
        GameManager.player.addToBoard(true)
    }else{
        saveStats()
    }
    GameManager.player.reset()
    console.log("Player reseted.")
}

function saveStats() {
    let plyr = GameManager.player;
    let stats = {
        date: new Date(),
        matches: plyr.matches,
        misses:plyr.misses,
        words:plyr.score
    }
    if (stats.misses === 0
    && stats.matches === 0
    && stats.words === 0)
    {
        console.log('Zeros in stats')
    }else
    {
        storeItemInArrayInLocalStorage('stats', JSON.stringify(stats))
        statsUpdate()
    }
    checkNavigatorConnection()
}

function resetGame() {
    console.log('Main Game Init.');
    GameManager.currentAsteroid = undefined
    resetPlayer()
    resetBullets()
    resetExplosions()
    resetAsteroids()
    clearMessages();
    removeStars();
    hideProgressBar()
    setWords()
}

/*==============================================================================
 GAME START/OVER/PAUSE/WIN
==============================================================================*/

function gameOver() {
    playSound('loose')
    writeMessage('Game Over')
    appendMessage('Press Space to start')
}

function gameWin()
{
    playSound('win')
    clearPlayArea()
    GameManager.phase = GameSettings.gamePhase.winGame
    writeMessage('Game Win')
    stopTick()
    hidePauseButton()
    showPauseMenu(false)
}


function pauseGame() {
    GameManager.prevPhase = GameManager.phase
    GameManager.phase = GameSettings.gamePhase.paused
}

function continueGame() {
    GameManager.phase = GameManager.prevPhase
    if(GameManager.phase === GameSettings.gamePhase.playing) {
        tick()
    }
}

/*==============================================================================
PROCESSORS
==============================================================================*/


function processResources(indexNum) {
    let img = new Image();
    let fileName = 'resources/' + ImageFiles[indexNum] + '.png';
    img.src = fileName;
    img.onload = function() {
        GameManager.assets[ImageFiles[indexNum]] = {
            width: this.width,
            height: this.height,
            fileName: fileName
        };
        indexNum++;
        if (indexNum < ImageFiles.length) {
            processResources(indexNum);
        } else {
            console.log('Assets Done.');
            GameManager.assetsLoaded = true
            resetGame()
            checkLoadPageRedirect()
        }
    }
}


function keyProcessor(key) {
    if(GameManager.currentAsteroid === undefined) {
        let asteroids = GameManager.asteroids.listAsteroids;
        for (let i = 0; i < asteroids.length; i++) {
            let asteroid = asteroids[i];
            if(asteroid !== undefined && !asteroid.completed) {
                if(key === asteroid.text.charAt(0)) {
                    asteroid.setFocus()
                    GameManager.currentAsteroid = asteroid;
                    break;
                }
            }

        }
    }
    if( GameManager.currentAsteroid !== undefined &&
        GameManager.currentAsteroid.unfilledText.
       textContent.charAt(0) === key)
    {
        GameManager.currentAsteroid.fillLetter(key);
        GameManager.player.incrementMatches()
    }
    else
    {
        GameManager.player.incrementMisses()
    }

}

function eventProcessor(){
    window.addEventListener('beforeunload', saveStats)
    $(document).keydown(
        event => {
            if(GameManager.phase === GameSettings.gamePhase.readyToPlay &&
                event.which === GameSettings.keyPress.space)
            {
                countDown(3)
            }
            else if(GameManager.phase === GameSettings.gamePhase.playing){
                keyProcessor(event.key)
            }
            else if(GameManager.phase === GameSettings.gamePhase.gameOver &&
                event.which === GameSettings.keyPress.space)
            {
                clearGame()
                countDown(3)
            }
        }
    )

}

/*==============================================================================
TICK
==============================================================================*/
function tick(){
    if(GameManager.phase === GameSettings.gamePhase.playing) {
        GameManager.bullets.update()
        GameManager.asteroids.update()
        addAsteroids()
        if(GameManager.phase === GameSettings.gamePhase.gameOver) {
            gameOver();
        }else
        {
           GameManager.tickId = requestAnimationFrame(tick);
        }
    }
}

function stopTick() {
    cancelAnimationFrame(GameManager.tickId)
}

function addAsteroids() {
    if(isEmpty(GameManager.asteroids))
    {
        let quantityToAdd = GameSettings.asteroidsQuantity
        let number = GameManager.asteroids.totalAsteroids + quantityToAdd;
        if(number > GameManager.words.length)
        {
            quantityToAdd = GameManager.words.length - GameManager.asteroids.totalAsteroids
            if(quantityToAdd === 0) {
                gameWin()
            }
        }
        for(let i = 0; i < quantityToAdd; i ++)
        {
            GameManager.asteroids.add()
        }
    }
}
function startGame() {
    GameManager.phase = GameSettings.gamePhase.playing
    tick()
}
function clearGame() {
    resetGame()
    hidePauseMenu()
    clearPlayArea()
    clearMessages()
    createStars()
}

function clearPlayArea() {
    $('[id^=asteroid]').remove()
    $('[id^=bullet]').remove()
}

function backToMenu() {
    GameManager.phase = GameSettings.gamePhase.mainMenu
    stopTick()
    hidePauseMenu()
    hidePauseButton()
    hideProgressBar()
    showMainMenu()
    clearMessages()
    resetGame()
    clearPlayArea()
}



/*==============================================================================
DOM IS READY MAIN
==============================================================================*/
$(
    processResources(0),
    checkLocalStorageSize(),
    playSound('theme'),
    processMenu(),
    eventProcessor()
)
