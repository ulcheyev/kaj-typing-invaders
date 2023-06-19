


const ImageFiles = [
    'playerShip',
    'blueLaser',
    'meteorBrownMed',
    'meteorBrownMed_flashed',
    'meteorBrownSmall',
    'meteorBrownTiny',
    'explosion00_s',
    'explosion01_s',
    'explosion02_s',
    'explosion03_s',
    'explosion04_s',
    'explosion05_s',
    'explosion06_s',
    'explosion07_s',
    'explosion08_s'
];


const GameSettings = {
    /*=========================================
    KEY EVENTS
    ===========================================*/
    keyPress:{
        left: 37,
        right: 39,
        up: 38,
        down: 40,
        space: 32
    },

    /*=========================================
    PLAY AREA
    ===========================================*/
    playAreaWidth: 620,
    playAreaHeight: 720,
    playAreaDiv : '#playArea',

    /*=========================================
    PLAYER
    ===========================================*/
    playerDivName: 'ship',
    playerStartPos: {
        x: 300,
        y: 400
    },
    playerFirePosition: {
        x: 300,
        y: 500
    }
    ,
    playerState: {
        ok:0,
        dead:1,
        hitFlashing:2
    },

    /*=========================================
    BULLET
    ===========================================*/
    bulletSpeed: 6,
    bulletFireRate:15,

    /*=========================================
    ASTEROIDS
    ===========================================*/
    asteroidsQuantity: 5,
    asteroidYSpeed: 0.3, // 0.1
    asteroidXSpeed: 0.5, // 0.4
    explosionTimeout: 1000,


    /*=========================================
    PHASE
    ===========================================*/
    gamePhase: {
        mainMenu:0,
        readyToPlay: 1,
        countDownToStart: 2,
        playing: 3,
        gameOver: 4,
        paused: 5,
        winGame: 6
    },

    /*=========================================
    COUNT
   ===========================================*/
    countDownGap: 700,
    countDownValues: ['3', '2', '1', 'GO!'],


}


let GameManager = {
    assets: {},
    assetsLoaded: false,
    prevPhase: undefined,
    phase: GameSettings.gamePhase.mainMenu,
    player: undefined,
    explosions: undefined,
    bullets: undefined,
    asteroids : undefined,
    tickId: undefined,
    text: "Sun of the sleepless! Melancholy star!\n" +
        "Whose tearful beam glows tremulously far,\n" +
        "That show’st the darkness thou canst not dispel,\n" +
        "How like art thou to joy remember’d well!\n" +
        "\n" +
        "So gleams the past, the light of other days,\n" +
        "Which shines, but warms not with its powerless rays;\n" +
        "A night-beam Sorrow watcheth to behold,\n" +
        "Distinct, but distant — clear, but oh, how cold!",
    words: undefined,
    currentAsteroid: undefined
}

