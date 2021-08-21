// game start animation

setTimeout(() => {
    let inner = document.querySelector('.game-start__text');
    let wordsArr = [3,2,1,'Start!'];
    let wordIndex = 0;
    let timer;
    let animTime = 600;

    
    function animationStep() {
        timer = setInterval(function() {

            inner.innerHTML = wordsArr[wordIndex];
            inner.classList.add('_active');
            wordIndex++; 

            setTimeout(() => {
                inner.classList.remove('_active');
            }, 500);

            animateStop();
        } , animTime)
    }

    function animateStop() {
        if (wordIndex >= wordsArr.length) {
            clearInterval(timer);

            setTimeout(() => {
                inner.parentElement.remove();

                // run game
                gameTimer(60);
                 createGameObject();
                 document.addEventListener('keydown' , movePlayer);
            }, animTime);
        }
    }

    animationStep();
}, 300);
