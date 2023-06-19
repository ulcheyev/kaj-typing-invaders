class Bullet extends Sprite {

    #BULLET_SPEED_ALIGNMENT_BALAST = 1.3
    constructor(divName, assetDesc, position, vel) {
        super(divName, position, assetDesc.fileName, new Size(assetDesc.width, assetDesc.height));
        this.dead = false
        this.addToBoard(true)
        this.bulletVelocity = vel;
    }


    update() {
        let align = GameSettings.bulletSpeed/this.#BULLET_SPEED_ALIGNMENT_BALAST
        this.incrementPosition(
            this.bulletVelocity.x * align,
            this.bulletVelocity.y * align)
        if(this.position.y  < 0) {
            this.killMe()
        }
    }


    killMe() {
        this.dead = true
        this.removeFromBoard()
    }
}

class BulletCollection{
    constructor(player) {
        this.listBullets = []
        this.lastAdded = 0
        this.player = player
        this.total_bullets = 0
    }

    reset(){
        for(let bullet of this.listBullets) {
            bullet.removeFromBoard()
        }
        this.listBullets = []
        this.lastAdded = 0
        this.total_bullets = 0
    }

    add(angle){
        if (this.lastAdded > GameSettings.bulletFireRate &&
            this.player.state !== GameSettings.playerState.hitFlashing)
        {
            let bulletVelocity = {
                x: GameSettings.bulletSpeed * Math.cos(-angle * Math.PI / 180),
                y: GameSettings.bulletSpeed * Math.sin(-angle * Math.PI / 180)
            };

            this.lastAdded = 0;
            this.listBullets.push(
                    new Bullet(
                        'bullet_'+this.total_bullets,
                        GameManager.assets['blueLaser'],
                        new Point(this.player.position.x + (this.player.size.width / 2),
                            this.player.position.y),
                        bulletVelocity
                )
            )
            this.total_bullets++;
        }
    }

    update() {
        this.lastAdded++;
        for(let i = this.listBullets.length - 1; i >= 0; i--) {
            if(this.listBullets[i].dead === true){
                this.listBullets.splice(i, 1)
            }else{
                this.listBullets[i].update()
            }
        }
    }
}































