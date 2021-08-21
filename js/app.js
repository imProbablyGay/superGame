let player = document.querySelector('.player-item img');
let gameArea = document.querySelector('.game-area');
let collectText = document.querySelector('.collect-item-text');
let againModal = new bootstrap.Modal(document.getElementById('again-modal'), {
    keyboard: false
});
let playerParent = player.parentElement;
let playerStyle;
let keyPressed = false;
let pressedKey = null;
let animStep;
let keyCode;
let gameScore = 0;
let bestScore = localStorage.getItem('best-score');
let gameObj;
let touched = false;
let increaseStep = 5;


// return default img & remove rotate
document.addEventListener('keyup' , () => {
    keyPressed = false;
    pressedKey = null;
    keyCode = null;
    
    player.src = 'img/player-default.png';
    player.style.transform = '';

    if (doElsCollide(playerParent, gameObj)) {
        collectText.style.display = 'block';

        // key event
        document.addEventListener('keydown' , collectItem);

        touched = true;

    } else {
        collectText.style.display = 'none';
        document.removeEventListener('keydown' , collectItem);
    }
})

function movePlayer(e) {
    keyCode = e.which;
    playerStyle = playerParent.currentStyle || window.getComputedStyle(playerParent);
    keyPressed = true;
    gameObj = document.querySelector('.game-object');

    // collide
    if (doElsCollide(playerParent, gameObj)) {
        collectText.style.display = 'block';

        // key event
        document.addEventListener('keydown' , collectItem);

        touched = true;

    } else {
        collectText.style.display = 'none';
        document.removeEventListener('keydown' , collectItem);
    }


    // left & right move
    if (keyCode == 68) {
        setTimeout(moveLeft, 10);
    }

    if (keyCode == 65) {
        setTimeout(moveRight, 10);
    }

    if (keyCode == 87) {
        setTimeout(moveUp, 10);
    }

    if (keyCode == 83) {
        setTimeout(moveDown, 10);
    }
}


// functions
function moveLeft() {
    if (pressedKey == null) pressedKey = keyCode;
   if (keyCode != pressedKey || !keyPressed) return false;

   // protect player
   if (protectPlayer('left')) return false;

    // move logic
    player.src = 'img/player-right-left.png';
    player.style.transform = 'rotate(0)';

    playerParent.style.left = parseInt(playerStyle.left) + increaseStep + 'px';

    // set new timeout
    setTimeout(moveLeft, 10);
}

function moveRight() {
    if (pressedKey === null) pressedKey = keyCode;
    if (keyCode != pressedKey || !keyPressed) return false;

    // protect player
    if (protectPlayer('right')) return false;

    // move logic
    player.src = 'img/player-right-left.png';
    player.style.transform = 'rotate(180deg)';

    playerParent.style.left = parseInt(playerStyle.left) - increaseStep + 'px';
    
    // set new timeout
    setTimeout(moveRight, 10);
}

function moveUp() {
    if (pressedKey === null) pressedKey = keyCode;
    if (keyCode != pressedKey || !keyPressed) return false;

    // protect player
    if (protectPlayer('up')) return false;

    // move logic
    player.src = 'img/player-bottom-top.png';
    player.style.transform = 'rotate(0deg)';

    playerParent.style.top = parseInt(playerStyle.top) - increaseStep + 'px';

    // set new timeout
    setTimeout(moveUp, 10);
}

function moveDown() {
    if (pressedKey === null) pressedKey = keyCode;
    if (keyCode != pressedKey || !keyPressed) return false;

    // protect player
    if (protectPlayer('down')) return false;

    // move logic
    player.src = 'img/player-bottom-top.png';
    player.style.transform = 'rotate(180deg)';

    playerParent.style.top = parseInt(playerStyle.top) + increaseStep + 'px';
    
    // set new timeout
    setTimeout(moveDown, 10);
}

function protectPlayer(direction) {
    if (direction == 'right') {
        if (parseInt(playerStyle.left) <= 30) {
            return true;
        }
    } else if (direction == 'left') {
        if (parseInt(playerStyle.left) + 35 >= window.innerWidth) {
            return true;
        }
    } else if (direction == 'down') {
        if (parseInt(playerStyle.top) + 35 >= window.innerHeight) {
            return true;
        }
    } else if (direction == 'up') {
        if (parseInt(playerStyle.top) <= 30) {
            return true;
        }
    }
}

function gameTimer(time) {
    let timerContainer = document.querySelector('.timer');
    let intTime = time;
    let modal = document.querySelector('#again-modal');
    let modalBody = modal.querySelector('.modal-body');

    timerContainer.innerHTML = time;


    let timer = setInterval(() => {
        timerContainer.innerHTML = intTime--;

        if (intTime < 5) {
            timerContainer.style.color = 'red';
        }
        
        if (intTime < 0) {
            // remove move event
            document.removeEventListener('keydown', movePlayer);

            clearInterval(timer);

            // open modal
            againModal.show();

            modalBody.querySelector('.modal-your-score').innerHTML = gameScore;
            modalBody.querySelector('.modal-best-score').innerHTML = bestScore;
        }
    }, 1000);

    // event
    modal.addEventListener('hidden.bs.modal' , () => {
        if (gameScore > bestScore) {
            localStorage.setItem('best-score', gameScore);
        }
        location.reload();
    })
}

function createGameObject() {
    // create and add elem in html
    let elem = document.createElement('div');
    let elemImg = document.createElement('img');
    let elemScore = document.createElement('span');
    elemScore.innerHTML = '+1';
    elemImg.src = 'img/game-item.png';
    elem.append(elemImg);
    elem.append(elemScore);
    elem.classList.add('game-object');
    
    //set position to element
    let elemLeft = window.innerWidth - 50,
        elemTop = window.innerHeight - 50,
        x = randomInt(0 , elemLeft),
        y = randomInt(0 , elemTop);
    elem.style.cssText = `left:${x}px;top:${y}px;`;

    gameArea.append(elem);
}

function randomInt(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

function collectItem(e) {
    // if item already collected return
    if (gameObj.classList.contains('_collected-object')) return false;

    // if e pressed
    if (e.which == 69) {
        gameScore++;
        console.log(gameScore);

        // show score
        gameObj.querySelector('span').style.display = 'block';

        gameObj.classList.add('_collected-object');
        collectText.style.display = 'none';

        gameObj.ontransitionend = () => {
            gameObj.remove();
            createGameObject(player, gameObj);
        }
    }
}


doElsCollide = function(el1, el2) {
    el1.offsetBottom = el1.offsetTop + el1.offsetHeight;
    el1.offsetRight = el1.offsetLeft + el1.offsetWidth;
    el2.offsetBottom = el2.offsetTop + el2.offsetHeight;
    el2.offsetRight = el2.offsetLeft + el2.offsetWidth;

    return !((el1.offsetBottom < el2.offsetTop) ||
                (el1.offsetTop > el2.offsetBottom) ||
                (el1.offsetRight < el2.offsetLeft) ||
                (el1.offsetLeft > el2.offsetRight))
};
