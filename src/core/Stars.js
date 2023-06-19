
const STAR_FREQUENCY = 30
const STAR_APPEARANCE_DELAY = 1500
const MEDIUM_STAR_APPEARANCE_DELAY_BALLAST = 600
const BIG_STAR_APPEARANCE_DELAY_BALLAST = 1200

function removeStars() {
    $('.star').remove();
}

function pauseStars() {
    $('.star').css({
        "animation-play-state": "paused"
    });
}

function addStar(starClass) {
    let div = document.createElement("div");
    div.classList.add("star", starClass);
    div.style.left = getRandomNumberTo(GameSettings.playAreaWidth) + "px";
    $(GameSettings.playAreaDiv).append(div);
}

function createStars() {
    for(let i = 0; i < STAR_FREQUENCY; ++i) {
        let delay = i * STAR_APPEARANCE_DELAY;
        window.setTimeout(addStar, delay, "starSmall");
        window.setTimeout(addStar, delay + MEDIUM_STAR_APPEARANCE_DELAY_BALLAST, "starMedium");
        window.setTimeout(addStar, delay + BIG_STAR_APPEARANCE_DELAY_BALLAST, "starBig");
    }
}















