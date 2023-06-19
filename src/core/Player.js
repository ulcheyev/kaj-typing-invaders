class Player extends Sprite{
    #FLY_BACK_MAX_TIME = 1800;
    #FLY_BACK_TIMEOUT = 8;
    constructor(divName, position, assetDesc, boundaryRect) {
        super(divName, position, assetDesc.fileName,
            new Size(assetDesc.width, assetDesc.height));
        this.score = 0
        this.misses = 0
        this.matches = 0
        this.state = GameSettings.playerState.ok
        this.boundaruRect = boundaryRect;
        this.boundaruRect.shift(this.anchorShift.x, this.anchorShift.y)
    }

    reset(){
        $('#'+this.divName).css({
            "transform": "none",
        })
        this.state = GameSettings.playerState.ok;
        this.score = 0
        this.misses = 0
        this.matches = 0
        this.setPosition(GameSettings.playerStartPos.x, GameSettings.playerStartPos.y)
        if(this.trail !== undefined) this.trail.remove()
        this.trail = new Trail(this)
    }

    incrementScore() {
        this.score++;
    }

    incrementMisses() {
        this.misses++
    }

    incrementMatches() {
        this.matches++
    }

    dead(){
        this.state = GameSettings.playerState.dead;
        GameManager.phase = GameSettings.gamePhase.gameOver;
    }


    flyBack() {
        let start = Date.now();
        let timer = setInterval(() =>  {
            let timePassed = Date.now() - start;
            if (this.position.y >= GameSettings.playerFirePosition.y
                && timePassed >= this.#FLY_BACK_MAX_TIME )
            {
                clearInterval(timer);
                this.trail.remove();
            }
            this.incrementPosition(0, 1);
            this.trail.update()
        }, this.#FLY_BACK_TIMEOUT);
    }

}

class Trail {
    #DYNAMIC_TRAIL_PARTICLE_QUANTITY = 30;
    #DYNAMIC_TRAIL_APEARENCE_DELAY = 550

    constructor(player) {
        this.player = player
        this.buildTrail()
    }

    buildTrail () {
        this.addStaticTrail()
        this.createDynamicTrail();
    }

    getTrailPos() {
        return {
            numberX : this.player.position.x + (this.player.size.width/2-1), // image
            numberY : this.player.position.y + this.player.size.height
        }
    }
    addStaticTrail() {
        let div = document.createElement("div");
        div.classList.add("staticTrail");
        div.style.left = this.getTrailPos().numberX + "px";
        div.style.top = this.getTrailPos().numberY + 'px';
        $(GameSettings.playAreaDiv).append(div);
    }

    addDynamicTrail() {
        let div = document.createElement("div");
        div.classList.add("dynamicTrail");
        div.style.top = -$('.staticTrail').height() + 'px';
        $(".staticTrail").append(div);
    }

    createDynamicTrail() {
        for(let i = 0; i < this.#DYNAMIC_TRAIL_PARTICLE_QUANTITY; ++i) {
            let delay = i * this.#DYNAMIC_TRAIL_APEARENCE_DELAY;
            window.setTimeout(
                this.addDynamicTrail.bind(this),
                delay);
        }
    }

  remove () {
      let $dynamicTrail = $(".dynamicTrail");
      $dynamicTrail.css({
          "animation": "none"
      })
      $dynamicTrail.remove()
      $(".staticTrail").remove()
  }

  update() {
      $(':root').css('--pos', this.getTrailPos().numberX +'px')
      $(".staticTrail").css("top", this.getTrailPos().numberY +'px')
  }

}



