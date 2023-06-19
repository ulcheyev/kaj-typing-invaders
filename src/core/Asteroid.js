class Asteroid extends Sprite {
    #ASTEROID_FLASH_TIMEOUT = 150
    #ASTEROID_Y_SHIFT_DELAY = 10
    constructor(divName, assetDesc, position, text) {
        super(divName, position, assetDesc.fileName, new Size(assetDesc.width, assetDesc.height));
        this.text = text
        this.completed = false
        this.lastShift = 0;
    }

    addText() {
        let txt = document.createElement("div");
        let filledText = document.createElement("div");

        txt.classList.add("asteroidText");
        filledText.classList.add("filledAsteroidText");

        txt.id = this.divName + '_txt'
        txt.innerText += this.text

        $('#'+this.divName)
            .append(filledText)
            .append(txt);

        this.filledText = filledText;
        this.unfilledText = txt;
    }


    reset(){
        this.text = undefined;
        this.isInFocus = false
        this.completed = true
        GameManager.currentAsteroid = undefined;
        this.removeFromBoard()
    }

    setFocus() {
        this.isInFocus = true
        $('#'+this.divName).css(
            "z-index", "30"
        )
        $('#'+this.divName + '_txt').css(
            "z-index", "30"
        )
    }


    update() {
        let iy = GameSettings.asteroidYSpeed
        let ix = GameSettings.asteroidXSpeed;

        if(this.position.x > GameSettings.playerStartPos.x) {
            ix = -GameSettings.asteroidXSpeed
        }

        if(this.lastShift % this.#ASTEROID_Y_SHIFT_DELAY === 0) {
            this.incrementPosition(ix, iy)
        }else{
            this.incrementPosition(0, iy)
        }

        this.lastShift++;
        if(this.position.y  > GameSettings.playAreaHeight
        || this.completed === true)
        {
            this.reset()
        }
    }


    flash() {
        let div = $('#'+this.divName);
        div.css("background-image", "url('resources/meteorBrownMed_flashed.png')")
        setTimeout(function (){
            div.css("background-image", "url('resources/meteorBrownMed.png')")
        }, this.#ASTEROID_FLASH_TIMEOUT)
    }

    fillLetter(letter) {

        this.flash()

        let filledText = this.filledText.textContent;
        let unfilledText = this.unfilledText.textContent;
        this.filledText.innerText = filledText + letter;
        this.unfilledText.innerText = unfilledText.slice(1);

        function comptuteAngle() {
            let ship = $('#' + GameSettings.playerDivName);
            let asteroid = $('#' + this.divName);
            let sx = ship.offset().left + ship.width() / 2;
            let sy = ship.offset().top + ship.height() / 2;
            let ax = asteroid.offset().left + asteroid.width() / 2;
            let ay = asteroid.offset().top + asteroid.height() / 2;
            let dx = ax - sx;
            let dy = ay - sy;
            let angle = Math.atan2(dy, dx) * 180 / Math.PI;
            angle += 90;
            ship.css({
                "transform": "rotate(" + angle + "deg)",
                "transform-origin": "center"
            });
            angle = (angle - 90) * -1;
            GameManager.bullets.add(angle)
        }

        comptuteAngle.call(this);

        //FILLED
        if(filledText.length === this.text.length-1) {
            playSound('explosion')
            this.reset();
            let cenP = this.getCenterPoint();
            GameManager.explosions.createBigExplosion(new Point(cenP.x, cenP.y))
            GameManager.player.incrementScore()
            GameManager.currentAsteroid = undefined
            GameManager.asteroids.totalFilledAsteroids++;
            updateProgressBar()
        }
    }

}


class AsteroidCollection {
    #ASTEROID_MAX_HEIGHT_TO_SPAWN = 30
    constructor(player, bullets) {
        this.listAsteroids = []
        this.player = player
        this.totalAsteroids = 0
        this.totalFilledAsteroids = 0
        this.bullets = bullets;
    }
    add(){
        let toAdd = new Asteroid(
            'asteroid_'+this.totalAsteroids,
            GameManager.assets['meteorBrownMed'],
            new Point(
                getRandomNumberTo(
                    GameSettings.playAreaWidth,
                    15),
                getRandomNumberTo(this.#ASTEROID_MAX_HEIGHT_TO_SPAWN)
            ),
            GameManager.words[this.totalAsteroids]
        )
        toAdd.addToBoard(true)
        toAdd.addText()
        this.listAsteroids.push(toAdd)
        this.totalAsteroids++;
    }

    update() {
        for(let i = this.listAsteroids.length - 1; i >= 0; i--) {
            let currAsteroid = this.listAsteroids[i];
            // Check collision with player
            if(this.player.containingBox.intersectedBy(currAsteroid.containingBox)) {
                this.player.dead()
            }else {
                // If current asteroid is completed, remove it
                if (currAsteroid.completed === true) {
                    this.listAsteroids.splice(i, 1)
                } else {
                    //CHECK COLLISION BETWEEN BULLETS AND ASTEROIDS
                    for (let j = 0; j < this.bullets.listBullets.length; j++) {
                        let currBu = this.bullets.listBullets[j];
                        if (currAsteroid.containingBox.intersectedBy(currBu.containingBox)) {
                            currBu.killMe();
                        }
                    }
                    this.listAsteroids[i].update()
                }
            }
        }
    }

    reset() {
        for(let asteroid of this.listAsteroids) {
            asteroid.removeFromBoard()
        }

        this.listAsteroids = []
        this.totalAsteroids = 0
        this.totalFilledAsteroids = 0
    }
}
