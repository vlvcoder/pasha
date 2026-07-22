const createElementFromHTML = (parent, htmlString) => {
    parent.insertAdjacentHTML('beforeend', htmlString);
    return parent.lastChild;
};

export const makeDigit = (divDigit) => {
    const IMAGES = [
        [0, 1, 2, 4, 5, 6],
        [2, 5],
        [0, 2, 3, 4, 6],
        [0, 2, 3, 5, 6],
        [1, 2, 3, 5],
        [0, 1, 3, 5, 6],
        [0, 1, 3, 4, 5, 6],
        [0, 2, 5],
        [0, 1, 2, 3, 4, 5, 6],
        [0, 1, 2, 3, 5, 6],
    ];

    const matches = [
        createElementFromHTML(divDigit, '<div class="match"></div>'),
        createElementFromHTML(divDigit, '<div class="match match-ver"></divid=>'),
        createElementFromHTML(divDigit, '<div class="match match-ver"></div>'),
        createElementFromHTML(divDigit, '<div class="match"></div>'),
        createElementFromHTML(divDigit, '<div class="match match-ver"></div>'),
        createElementFromHTML(divDigit, '<div class="match match-ver"></div>'),
        createElementFromHTML(divDigit, '<div class="match"></div>'),
    ];

    matches[3].style.opacity = '0';

    return {
        showDigit: (index) => {
            matches
                .forEach(
                    (match, ind) => match.style.opacity = IMAGES[index].includes(ind) ? '1' : '0'
                );
        },
        setVisibility: (visibility) => {
            if (visibility) {
                divDigit.style.display = 'block';
            } else {
                divDigit.style.display = 'none';
            }

        },
    };
};
