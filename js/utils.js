function rectCollision({ rect1, rect2 }) {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
    rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.height
  );
}
function reload() {
  window.location.reload();
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector('#winner').style.display = 'flex';
  if (player.health === enemy.health) {
    document.querySelector('#winner').innerHTML = 'TIE';
  } else if (player.health > enemy.health) {
    document.querySelector('#winner').innerHTML = 'PLAYER WINS';
  } else if (player.health < enemy.health) {
    document.querySelector('#winner').innerHTML = 'ENEMY WINS';
  }
  setTimeout(reload(), 3000);
}

// TIMER
let timer = 64;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }
  if (timer == 0) {
    determineWinner({ player, enemy, timerId });
  }
}
