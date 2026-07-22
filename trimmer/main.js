import { makeDigit } from "./digit.js";

const divField = document.getElementById('field');
const divCaret = document.getElementById('caret');
const divTimer = document.getElementById('timer');
const btnStart = document.getElementById('start');
const digit1 = document.getElementById('digit1');
const digit2 = document.getElementById('digit2');

const { showDigit: showDigit1, setVisibility: setVisibility1 } = makeDigit(digit1);
const { showDigit: showDigit2 } = makeDigit(digit2);
makeTrimmer(divField, divCaret, divTimer, btnStart, setScoreFn);

function setScoreFn(cnt) {
    setVisibility1(cnt > 9);
    showDigit1(Math.floor(cnt / 10));
    showDigit2(cnt % 10);
};

function makeTrimmer(field, caret, timer, buttonStart, setScore) {
    const STEP = 40;
    const WIDTH = 25;
    const HEIGHT = 15;
    const DURATION_SEC = 30;

    let point = [0, 0];
    let targets = [];
    let count = 0;
    let timerSec = DURATION_SEC;
    let intervalId;

    caret.style.width = `${STEP}px`;
    caret.style.height = `${STEP}px`;
    field.style.width = `${WIDTH * STEP}px`;
    field.style.height = `${HEIGHT * STEP}px`;
    field.addEventListener('click', () => field.focus());

    function startGame() {
        buttonStart.style.opacity = 0;
        caret.style.opacity = 1;
        clearDirections();
        field.classList.remove('finished');

        point = [0, 0];
        targets = [];
        count = 0;
        timerSec = DURATION_SEC;
        
        setScore(count);
        
        placeCaret([0, 0]);
        insertTarget();
        intervalId = setInterval(onInterval, 1000);
        field.focus();
    }

    startGame();

    buttonStart.addEventListener('click', () => {
        if (timerSec > 0) {
            return;
        }
        startGame();
    });

    function insertTarget() {
        const target = document.createElement('div');
        target.className = 'figure target';
        target.style.width = `${STEP}px`;
        target.style.height = `${STEP}px`;
        target.style.left = `${random(WIDTH) * STEP}px`;
        target.style.top = `${random(HEIGHT) * STEP}px`;
        field.appendChild(target);
        targets.push(target);
    }

    function checkTargets() {
        const completed = targets.find(target => point[0] === target.offsetLeft && point[1] === target.offsetTop);
        if (completed) {
            targets = targets.filter(target => target !== completed);
            completed.remove();
            insertTarget();
            count++;
            setScore(count);
        }
    }

    function onInterval() {
        timerSec--;
        timer.textContent = String(timerSec);

        if (timerSec === 0) {
            clearInterval(intervalId);
            targets.forEach(target => target.remove());
            targets = [];
            caret.style.opacity = 0;
            field.setAttribute('data-text', count);
            field.classList.add('finished');
            buttonStart.style.opacity = 1;
        }
    }

    function placeCaret(diff) {
        const [x, y] = diff;
        const [pointX, pointY] = point;

        if (pointX + x < 0 || pointY + y < 0) {
            return;
        }
        if (pointX + x >= field.clientWidth || pointY + y >= field.clientHeight) {
            return;
        }

        point = [pointX + x, pointY + y];
        caret.style.left = `${point[0]}px`;
        caret.style.top = `${point[1]}px`;
        checkTargets();
    }

    field.addEventListener('keydown', (event) => {
        if (timerSec === 0) {
            return;
        }
        const keyName = event.key;
        let diff = [0, 0];

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(keyName)) {
            switch (keyName) {
                case 'ArrowUp':
                    diff = [0, -STEP];
                    break;
                case 'ArrowDown':
                    diff = [0, STEP];
                    break;
                case 'ArrowLeft':
                    diff = [-STEP, 0];
                    break;
                case 'ArrowRight':
                    diff = [STEP, 0];
                    break;
            }
            clearDirections();
            caret.classList.add(keyName);
            placeCaret(diff);

            event.preventDefault();
            event.stopPropagation();
        }
    });

    function clearDirections() {
        caret.classList.remove('ArrowUp');
        caret.classList.remove('ArrowDown');
        caret.classList.remove('ArrowLeft');
        caret.classList.remove('ArrowRight');
    }

};

function random(n) {
    return Math.floor(Math.random() * n);
}
