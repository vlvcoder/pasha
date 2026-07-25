import { makeDigit } from "./digit.js";

const divField = document.getElementById('field');
const divCaret = document.getElementById('caret');
const divTimer = document.getElementById('timer');
const btnStart = document.getElementById('start');
const digit1 = document.getElementById('digit1');
const digit2 = document.getElementById('digit2');
const scoreList = document.getElementById('scoreList');

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
    const WIDTH = 15;
    const HEIGHT = 10;
    const DURATION_SEC = 60;
    const TAIL_PADDING = 5;

    let point = [0, 0];
    let tail = [];
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
        tail = [];
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
        if (tail.length >= WIDTH * HEIGHT - 2) {
            finishGame();
            return;
        }

        const target = document.createElement('div');
        target.className = 'figure target';
        target.style.width = `${STEP}px`;
        target.style.height = `${STEP}px`;
        let targetPoint;
        let isTargetEqualsPoint;
        let isTargetEqualsTail;
        do {
            targetPoint = [random(WIDTH), random(HEIGHT)];
            isTargetEqualsPoint = isPointsEqual(targetPoint, point);
            isTargetEqualsTail = tail.find(({ tailPoint }) => isPointsEqual(targetPoint, tailPoint));
        } while (isTargetEqualsPoint || isTargetEqualsTail);

        target.style.left = `${targetPoint[0] * STEP}px`;
        target.style.top = `${targetPoint[1] * STEP}px`;
        field.appendChild(target);
        targets.push(target);
    }

    function checkTargets() {
        const completed = targets
            .find(target =>
                point[0] === Math.round(target.offsetLeft / STEP)
                && point[1] === Math.round(target.offsetTop / STEP));
        if (completed) {
            targets = targets.filter(target => target !== completed);
            completed.remove();
            count++;
            setScore(count);
        }
        return !!completed;
    }

    function finishGame() {
        clearInterval(intervalId);
        targets.forEach(target => target.remove());
        targets = [];
        tail.forEach(ti => ti.element.remove());
        tail = [];
        timerSec = 0;
        caret.style.opacity = 0;
        field.setAttribute('data-text', count);
        field.classList.add('finished');
        buttonStart.style.opacity = 1;

        const li = document.createElement('li');
        li.textContent = count;
        scoreList.appendChild(li);
    }

    function onInterval() {
        timerSec--;
        timer.textContent = String(timerSec);

        if (timerSec === 0) {
            finishGame();
        }
    }

    function placeCaret(diff, keyName) {
        const [x, y] = diff;
        const [pointX, pointY] = point;
        const newPoint = [pointX + x, pointY + y];

        if (pointX + x < 0 || pointY + y < 0) {
            return;
        }
        if (pointX + x >= WIDTH || pointY + y >= HEIGHT) {
            return;
        }

        if (tail[0] && tail[0].tailPoint) {
            if (isPointsEqual(tail[0].tailPoint, newPoint)) {
                return;
            }
        }

        if (tail.find(({ tailPoint }) => isPointsEqual(tailPoint, newPoint))) {
            finishGame();
            return;
        }

        clearDirections();
        caret.classList.add(keyName);

        const pervPoint = point;
        point = [pointX + x, pointY + y];
        caret.style.left = `${point[0] * STEP}px`;
        caret.style.top = `${point[1] * STEP}px`;
        const targetCompleted = checkTargets();
        if (targetCompleted) {
            insertTailItem(pervPoint);
            insertTarget();
        } else {
            moveTail(pervPoint);
        }
    }

    const placeTailElement = (tailelement, tailPoint) => {
        const [left, right] = tailPoint;
        tailelement.style.left = `${left * STEP + TAIL_PADDING}px`;
        tailelement.style.top = `${right * STEP + TAIL_PADDING}px`;
    };

    function moveTail(tailPoint) {
        if (tail.length === 0) {
            return;
        }
        for (let i = tail.length - 1; i > 0; i--) {
            tail[i].element.style.left = tail[i - 1].element.style.left;
            tail[i].element.style.top = tail[i - 1].element.style.top;
            tail[i].tailPoint = [...tail[i - 1].tailPoint];
        }
        tail[0].tailPoint = tailPoint;
        placeTailElement(tail[0].element, tailPoint);
    }

    function insertTailItem(tailPoint) {
        const element = document.createElement('div');
        element.className = 'tail';
        element.style.width = `${STEP - 2 * TAIL_PADDING}px`;
        element.style.height = `${STEP - 2 * TAIL_PADDING}px`;
        placeTailElement(element, tailPoint);
        field.appendChild(element);
        tail.unshift({
            element,
            tailPoint,
        });
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
                    diff = [0, -1];
                    break;
                case 'ArrowDown':
                    diff = [0, 1];
                    break;
                case 'ArrowLeft':
                    diff = [-1, 0];
                    break;
                case 'ArrowRight':
                    diff = [1, 0];
                    break;
            }
            placeCaret(diff, keyName);
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

function isPointsEqual(p1, p2) {
    return p1[0] === p2[0] && p1[1] === p2[1];
}
