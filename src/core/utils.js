
let soundPlayVolume = 0.2;
let isUserInteracted = false;
const MAX_LOCAL_STORAGE_SIZE = 1024 * 1024 * 3
const LOCAL_STORAGE_CLEAR_QUANTITY = 30;

function getRandomNumberTo(num, bounds) {
    let number = Math.random() * num;
    if (bounds !== undefined) {
        if(number < num/2) {
            number += bounds
        }else{
            number -= bounds
        }
    }
    return number;

}

function isEmpty(arr) {
    return arr.listAsteroids.length === 0
}

function getLocalStorageItem(key) {
    return localStorage.getItem(key)
}
function storeItemInLocalStorage(key, toSave) {
    localStorage.setItem(key, toSave)
}
function storeItemInArrayInLocalStorage(key, toSave) {
    let localStorageItem = JSON.parse(getLocalStorageItem(key));
    localStorageItem = localStorageItem === null ? [] : localStorageItem
    localStorageItem.push(toSave)
    localStorage.setItem(key, JSON.stringify(localStorageItem))
}
function getDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function playSound(name)
{
    let play = (elem) => {
        if (isUserInteracted) {
            elem.volume = soundPlayVolume
            elem.play();
        }
        else
        {
            $(document).ready(function() {
                $(document).on("click", function () {
                    isUserInteracted = true;
                    elem.volume = soundPlayVolume
                    elem.play();
                })
            })
        }
    }
    switch (name){
        case 'theme': play($("#themeAudio")[0]); break;
        case 'explosion': play($("#explosionSound")[0]); break;
        case 'win': play($("#winSound")[0]); break;
        case 'loose': play($("#looseSound")[0]); break;
    }

}

function volumeOn() {
    soundPlayVolume = 0.2
}

function volumeOff() {
    soundPlayVolume = 0
}

function checkLocalStorageSize() {
    let elems = JSON.parse(getLocalStorageItem('stats'));
    if(elems !== null) {
        let currentSizeBytes = elems.length;
        if (currentSizeBytes >= MAX_LOCAL_STORAGE_SIZE) {
            elems.splice(currentSizeBytes - LOCAL_STORAGE_CLEAR_QUANTITY, LOCAL_STORAGE_CLEAR_QUANTITY)
            console.log(`LS is overloaded. Deleted ${LOCAL_STORAGE_CLEAR_QUANTITY} older elems in stats.`);
            storeItemInLocalStorage('stats', JSON.stringify(elems))
        }
    }
}

function checkNavigatorConnection() {
    if (!navigator.onLine) {
        window.location.href = 'error.html';
    }
}