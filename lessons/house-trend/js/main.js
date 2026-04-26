import { bricks, groundFaces, roofForms, skies, tiles, windowFrames } from './data.js';

document
    .querySelectorAll('.main')
    .forEach(element => {
        element.addEventListener('click', function (event) {
            event.stopPropagation();
            nextClass(bricks, 'brick-', element.parentElement);
        });
    });

document
    .querySelectorAll('.window')
    .forEach(element => {
        element.addEventListener('click', function (event) {
            event.stopPropagation();
            if (clickIsOnLeftPart(event)) {
                nextClass(skies, 'sky-', element);
            } else {
                nextClass(windowFrames, 'window-frame-', element);
            }
        });
    });

document
    .querySelector('.sky-thumbler')
    .addEventListener('click', function (event) {
        event.stopPropagation();
        nextClass(skies, 'sky-', document.querySelector('.container-universe'));
    });

document
    .querySelector('.ground-thumbler')
    .addEventListener('click', function (event) {
        event.stopPropagation();
        document
            .querySelectorAll('.container-ground')
            .forEach(elem => nextClass(groundFaces, 'ground-face-', elem));
    });

document
    .querySelectorAll('.roof')
    .forEach(element => {
        element.addEventListener('click', function (event) {
            event.stopPropagation();
            if (clickIsOnLeftPart(event)) {
                nextClass(tiles, 'tile-', element.parentElement);
            } else {
                nextClass(roofForms, 'roof-form-', element.parentElement);
            }
        });
    });

const clickIsOnLeftPart = (event) => {
    const element = event.target;
    const rect = element.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    return (clickX / rect.width) < 0.5;
};

const nextClass = (classArray, prefix, element) => {
    const currentClass = [...element.classList]
        .find(c => String(c).startsWith(prefix));
    currentClass && element.classList.remove(currentClass);
    const ind = currentClass ? (classArray.indexOf(currentClass) + 1) % classArray.length : 0;
    element.classList.add(classArray[ind]);
};
