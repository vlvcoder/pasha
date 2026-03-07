const MAX_LENGTH = 16;

let value = '0';
let operation = null;
let prevValue = '0';

const resultElement = document.getElementsByClassName('result-output')[0];

const result = () => operation ? `${prevValue}${operation}${value === '0' ? '' : value}` : value;

show();

document.querySelectorAll('.digit').forEach(element => {
    element.addEventListener('click', function () {
        if (value?.length >= MAX_LENGTH) return;
        value += element.textContent;
        const parts = value.split('.');
        parts[0] = removeLeadingZeros(parts[0]);
        value = parts.join('.');
        show();
    });
});

document.querySelectorAll('.point').forEach(element => {
    element.addEventListener('click', function () {
        if (value.indexOf('.') >= 0) return;
        value += '.';
        show();
    });
});

document.querySelectorAll('.operation').forEach(element => {
    element.addEventListener('click', function () {
        if (operation) onEquals();
        prevValue = value;
        value = '0';
        operation = element.textContent;
        show();
    });
});

document.querySelectorAll('.equals').forEach(element => {
    element.addEventListener('click', onEquals);
});

document.querySelectorAll('.clear').forEach(element => {
    element.addEventListener('click', function () {
        value = '0';
        prevValue = '0';
        operation = null;
        show();
    });
});

function removeLeadingZeros(str) {
    const num = parseFloat(str);
    if (isNaN(num)) return str;
    if (/^0+\.0+$/.test(str)) return '0.0';
    return num.toString();
}

function show() {
    const res = result();
    if (!operation && res.length > MAX_LENGTH && res.indexOf('.') < 0) {
        resultElement.textContent = 'Overflow';
    } else {
        resultElement.textContent = res.substring(0, MAX_LENGTH);
    }
}

function onEquals() {
    if (!operation) return;
    value = String(eval(result()));
    prevValue = '0';
    operation = null;
    show();
}
