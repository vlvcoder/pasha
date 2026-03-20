const moves = document.getElementsByClassName('move');

for (let i = 0; i < moves.length; i++) {
    moves[i].onclick = (e) => {
        for (let i = 0; i < moves.length; i++) {
            moves[i].classList.remove('active');
        }
        e.target.classList.add('active');
    };
}
