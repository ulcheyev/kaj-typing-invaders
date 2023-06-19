class Explosions{
    constructor(assetName) {
        this.count = 0;
        this.offset = undefined;
        this.setOffset(assetName);
    }

    setOffset(assetName) {
        let asset = GameManager.assets[assetName]
        let coordX = -(asset.width/2);
        let coordY = -(asset.width/2);
        this.offset = new Point(
            coordX,
            coordY
        )
    }

    createBigExplosion(position) {
        let div = document.createElement("div")
        div.classList.add("explosion")
        let divId = 'explosion_' + this.count
        div.id = divId
        div.style.left = (position.x+this.offset.x) + 'px'
        div.style.top = (position.y+this.offset.y) + 'px'
        $(GameSettings.playAreaDiv).append(div)
        setTimeout(()=> $('#'+divId).remove(),
            GameSettings.explosionTimeout)
        this.count++;
    }
}