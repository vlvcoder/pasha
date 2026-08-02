import { animations } from "./animations.js";

const TAG_COUNT = 15;
const ANIMATION_DURATION = 300;
const NEXT_ROUND_DURATION = 1000;
const GAME_DURATION_SEC = 60;

const NUMBERS = [2, 3, 4, 5, 6, 7, 8, 9];
const NUMBERS_PROTOTYPE = [...NUMBERS, 6, 7, 8, 9]; // Повторяем некоторые цифры для увеличения частоты
const NUMBERS_PROTOTYPE_20 = [...NUMBERS, ...Array.from({ length: 19 }, (_, i) => i + 2)];
const NUMBERS_PROTOTYPE_30 = [...NUMBERS, ...Array.from({ length: 29 }, (_, i) => i + 2)];

let first = 0;
let second = 0;
let result = null;
let cloud = [];
let isRunning = false;
let level = 1;
let score = 0;
let timerSec = GAME_DURATION_SEC;
let intervalId;

const divFirst = document.getElementById('first');
const divSecond = document.getElementById('second');
const divResult = document.getElementById('result');
const divPool = document.getElementById('pool');
const divLine = document.getElementById('line');
const divStarter = document.getElementById('starter');
const divTimer = document.getElementById('timer');
const divScore = document.getElementById('score');
const divFinalScore = document.getElementById('finalScore');

let nextRoundTimerId = null;
const onTagClick = (event) => {
    const tag = event.target;

    if (!isRunning) {
        tag.remove();
        startRound();
        clearTimeout(nextRoundTimerId);
        return;
    }

    if (parseInt(tag.textContent) === first * second) {
        incrementScore();
        moveToResult(tag);
        isRunning = false;
        nextRoundTimerId = setTimeout(startRound, NEXT_ROUND_DURATION);
    } else {
        moveOut(tag);
    }
};

const insertTag = (num) => {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = num;
    tag.addEventListener('click', onTagClick);
    divPool.appendChild(tag);
};

const render = () => {
    divFirst.textContent = first;
    divSecond.textContent = second;
    divResult.classList.remove('hidden');
    if (result > 0) {
        divResult.textContent = result;
        divResult.classList.remove('empty');
    } else {
        divResult.textContent = '?';
        divResult.classList.add('empty');
    }
    divPool.replaceChildren();
    cloud.forEach(insertTag);
}

const makeTagCloud = () => {
    const gen = () => {
        let factor;
        switch (level) {
            case 2:
                factor = 400;
                break;
            case 3:
                factor = 900;
                break;
            default:
                factor = 96;
        }
        return Math.floor(Math.random() * factor) + 4;
    };

    cloud = [first * second];
    for (let i = 0; i < TAG_COUNT - 1; i++) {
        let n;
        do {
            n = gen();
        } while (cloud.includes(n));
        cloud.push(n);
    }
    // return shuffleInPlace(cloud);
    return cloud.sort((a, b) => a - b);
};

const makeExample = () => {
    const gen = () => {
        let prototype;
        switch (level) {
            case 2:
                prototype = NUMBERS_PROTOTYPE_20;
                break;
            case 3:
                prototype = NUMBERS_PROTOTYPE_30;
                break;
            default:
                prototype = NUMBERS_PROTOTYPE;
        }
        return prototype[Math.floor(Math.random() * prototype.length)];
    };
    first = gen();
    second = gen();
    result = null;
    makeTagCloud();
};

const startRound = () => {
    makeExample();
    render();
    isRunning = true;
};

function shuffleInPlace(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Совмещение элементов
 * @param {HTMLElement} source Перемещаемый элемент
 * @param {HTMLElement} target Целевой элемент
 * @returns 
 */
function moveTo(source, target) {
    // Получаем координаты элементов
    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    // Вычисляем смещение
    const deltaX = targetRect.left - sourceRect.left;
    const deltaY = targetRect.top - sourceRect.top;

    // Применяем анимацию
    return source.animate([
        { transform: 'translate(0, 0)' },
        {
            transform: `translate(${deltaX}px, ${deltaY}px)`,
            backgroundColor: 'var(--successColor)',
        }
    ], {
        duration: ANIMATION_DURATION,
        easing: 'ease-in-out',
        fill: 'forwards',
    });
}

function moveToResult(tag) {
    const animation = moveTo(tag, divResult);
    animation.onfinish = () => divResult.classList.add('hidden');

    divPool.querySelectorAll('*').forEach(el => {
        if (el !== tag) {
            hideTag(el);
        }
    });
}

function hideTag(tag) {
    const animation = tag.animate(
        animations.HIDE_TAG,
        {
            duration: ANIMATION_DURATION,
            easing: 'ease-in-out',
            fill: 'forwards',
        });
    animation.onfinish = () => tag.classList.add('hidden');
}

function moveOut(tag) {
    const animation = tag.animate(
        animations.EXPLODE(),
        {
            duration: ANIMATION_DURATION,
            iterations: 1,
            easing: 'linear',
        }
    );
    animation.onfinish = () => tag.classList.add('hidden');

    divLine.animate(
        animations.LINE_ERROR, {
        duration: ANIMATION_DURATION,
        easing: 'ease-in-out',
        fill: 'forwards'
    });
}

const showStart = (showScore = false) => {
    divFinalScore.style.display = showScore ? 'block' : 'none';
    divFinalScore.textContent = showScore ? `SCORE: ${score}` : '';

    divStarter.style.display = 'flex';
    divLine.style.display = 'none';
};

const startGame = () => {
    timerSec = GAME_DURATION_SEC;
    score = 0;
    startRound();
    divScore.textContent = String(score);
    divTimer.textContent = String(timerSec);
    intervalId = setInterval(onInterval, 1000);
};

const finishGame = () => {
    clearInterval(intervalId);
    showStart(true);
};

function onInterval() {
    timerSec--;
    divTimer.textContent = String(timerSec);

    if (timerSec === 0) {
        finishGame();
    }
}

function incrementScore() {
    score++;
    divScore.textContent = String(score);
};

divStarter.querySelectorAll('a').forEach(element => {
    element.addEventListener('click', function () {
        level = Number(element.getAttribute('data-level'));
        divStarter.style.display = 'none';
        divLine.style.display = 'flex';
        startGame();
    });
});

showStart();