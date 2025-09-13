const socket = io();

const scoreAEl = document.getElementById('scoreA');
const scoreBEl = document.getElementById('scoreB');

function changeScore(team, delta) {
    socket.emit('changeScore', { team, delta });
}

// Prejemanje live posodobitev, da se admin panel tudi osveži
socket.on('update', ({ scoreA, scoreB }) => {
    scoreAEl.textContent = scoreA;
    scoreBEl.textContent = scoreB;
});
