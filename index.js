const canvas = document.querySelector('canvas');
const overlay = document.querySelector('.js-overlay');
const start = document.querySelector('#start');
const splash = document.querySelector('.splash');
const hud = document.querySelector('#hud');
const gameBtnLeft = document.querySelector('#game-button-left');
const gameBtnRight = document.querySelector('#game-button-right');
const gameBtnJump = document.querySelector('#game-button-jump');
const gameBtnAttack = document.querySelector('#game-button-fight');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.5;

const background = new Background({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/grass-background.png',
});

const ghost = new Sprite({
  position: {
    x: 100,
    y: 100,
  },
  imageSrc: './img/flying-ob.png',
  scale: 0.5,
  framesMax: 13,
});

const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  imageSrc: './img/royalKnight/Idle.png',
  framesMax: 8,
  scale: 1.3,
  offset: { x: 0, y: 85 },
  sprites: {
    idle: {
      imageSrc: './img/royalKnight/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './img/royalKnight/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/royalKnight/Jump.png',
      framesMax: 3,
    },
    fall: {
      imageSrc: './img/royalKnight/Fall.png',
      framesMax: 3,
    },
    attack: {
      imageSrc: './img/royalKnight/Attack1.png',
      framesMax: 4,
    },
    attackLeft: {
      imageSrc: './img/royalKnight/Attack1.png',
      framesMax: 4,
    },
    attack2: {
      imageSrc: './img/royalKnight/Attack2.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './img/royalKnight/takeHit-w.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './img/royalKnight/Death.png',
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 95,
      y: 10,
    },
    width: 95,
    height: 25,
  },
});

const enemy = new Fighter({
  position: { x: 200, y: 100 },
  velocity: { x: 0, y: 0 },
  color: 'green',

  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 1.5,
  offset: { x: 120, y: 120 },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4,
    },
    idleLeft: {
      imageSrc: './img/kenji/Idle-left.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8,
    },
    runLeft: {
      imageSrc: './img/kenji/Run-left.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2,
    },
    jumpLeft: {
      imageSrc: './img/kenji/Jump-left.png',
      framesMax: 2,
    },

    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2,
    },
    fallLeft: {
      imageSrc: './img/kenji/Fall-left.png',
      framesMax: 2,
    },
    attack: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4,
    },
    attackLeft: {
      imageSrc: './img/kenji/Attack2-left.png',
      framesMax: 4,
    },
    attack2: {
      imageSrc: './img/kenji/Attack2-left.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './img/kenji/Take Hit.png',
      framesMax: 3,
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: 0,
      y: 10,
    },
    width: 120,
    height: 25,
  },
});

// make bots
let bots = [];
function makeBots({ amount = 1 }) {
  for (let i = 0; i < amount; i++) {
    const bot = new Fighter({
      position: {
        // enter bots from both sides
        x: Math.random() > 0.5 ? -100 : canvas.width + 100,
        y: Math.random() * canvas.height + 60,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      color: 'red',
      imageSrc: './img/eliteKnight/_Idle.png',
      framesMax: 10,
      scale: 1.4,
      offset: { x: 150, y: 35 },
      sprites: {
        idle: {
          imageSrc: './img/eliteKnight/_Idle.png',
          framesMax: 10,
        },
        run: {
          imageSrc: './img/eliteKnight/_Run.png',
          framesMax: 10,
        },
        runLeft: {
          imageSrc: './img/eliteKnight/_Run-left.png',
          framesMax: 10,
        },
        jump: {
          imageSrc: './img/eliteKnight/_Jump.png',
          framesMax: 3,
        },
        fall: {
          imageSrc: './img/eliteKnight/_Fall.png',
          framesMax: 3,
        },
        attack: {
          imageSrc: './img/eliteKnight/_Attack.png',
          framesMax: 4,
        },
        attackLeft: {
          imageSrc: './img/eliteKnight/_Attack.png',
          framesMax: 4,
        },
        attack2: {
          imageSrc: './img/eliteKnight/_Attack2.png',
          framesMax: 6,
        },
        takeHit: {
          imageSrc: './img/eliteKnight/_Hit.png',
          framesMax: 1,
        },
        death: {
          imageSrc: './img/eliteKnight/_Death.png',
          framesMax: 10,
        },
      },
      attackBox: {
        offset: {
          x: 0,
          y: 0,
        },
        width: 25,
        height: 30,
      },
    });
    bots.push(bot);
  }
}
makeBots({ amount: 1 });

// KEYBOARD CONTROLS
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

// ANIMATION FRAME LOOP (RENDERER)

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'rgba(0, 0, 0, 0.3)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  ghost.update();
  enemy.update();
  // player.update();
  bots.forEach((bot) => {
    bot.update();
  });

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -3;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 3;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  // jumping and falling animation
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5;
    enemy.switchSprite('runLeft');
  } else {
    // idle left for right for enemy
    if (enemy.lastKey === 'ArrowRight') {
      enemy.switchSprite('idleLeft');
    } else if (enemy.lastKey === 'ArrowLeft') {
      enemy.switchSprite('idle');
    } else {
      enemy.switchSprite('idle');
    }
  }
  // dont let enemy jump until position is halfway up the screen
  if (enemy.position.y < canvas.height / 2 && enemy.lastKey === 'ArrowUp') {
    enemy.velocity.y = -0.2;
    enemy.switchSprite('run');
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
    if (enemy.lastKey === 'ArrowRight') {
      enemy.switchSprite('jumpLeft');
    } else if (enemy.lastKey === 'ArrowLeft') {
      enemy.switchSprite('jump');
    }
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
    if (enemy.lastKey === 'ArrowRight') {
      enemy.switchSprite('fallLeft');
    } else if (enemy.lastKey === 'ArrowLeft') {
      enemy.switchSprite('fall');
    }
  }

  // change enemy hitbox for direction moving
  if (enemy.velocity.x > 0) {
    enemy.attackBox.offset.x = 100;
  } else if (enemy.velocity.x < 0) {
    enemy.attackBox.offset.x = -75;
  }
  // bot movement in relation to enemy

  bots.forEach((bot) => {
    if (bot.velocity.y < 0) {
      bot.switchSprite('jump');
    } else if (bot.velocity.y > 0) {
      bot.switchSprite('fall');
    }

    if (bot.position.x > enemy.position.x + enemy.width / 2) {
      bot.velocity.x = -1;
      bot.switchSprite('runLeft');
    } else if (bot.position.x < enemy.position.x - enemy.width / 2) {
      bot.velocity.x = 1;
      bot.switchSprite('run');
    } else {
      bot.switchSprite('idle');
    }

    if (
      // bot attacks when enemy is in range
      bot.position.x > enemy.position.x - bot.attackBox.width &&
      bot.position.x < enemy.position.x + enemy.attackBox.width &&
      bot.position.y > enemy.position.y - bot.attackBox.height &&
      bot.position.y < enemy.position.y + enemy.attackBox.height
    ) {
      // bot attack animation with random chance to hit enemy
      bot.switchSprite('attack');
      if (Math.random() > 0.5) {
        enemy.takeHit({ damage: 0.1 });
      }
      gsap.to('#enemyHealth', {
        width: enemy.health + '%',
      });
    }
  });

  // COLLISION DETECTION

  // // player attack collision detection
  // if (
  //   rectCollision({ rect1: player, rect2: enemy }) &&
  //   player.isAttacking &&
  //   player.frameCurrent === 2
  // ) {
  //   enemy.takeHit();
  //   player.isAttacking = false;

  //   gsap.to('#enemyHealth', {
  //     width: enemy.health + '%',
  //   });
  // }

  // Enemy attack collision detection with bot
  bots.forEach((bot) => {
    if (
      rectCollision({ rect1: enemy, rect2: bot }) &&
      enemy.isAttacking &&
      enemy.frameCurrent === 2
    ) {
      bot.takeHit({ damage: 100 });
      enemy.isAttacking = false;
    }
  });

  // count the bots killed by enemy and update the score

  // if bot is dead, remove it from the array and add a new bot, after a delay
  bots.forEach((bot, i) => {
    if (bot.dead) {
      enemy.score++;
      bots.splice(i, 1);
      setTimeout(() => {
        if (enemy.score <= 4) {
          makeBots({ amount: 1 });
        }
      }, 1000);
    }
  });
  document.querySelector('#timer').innerHTML = `${enemy.score}`;
  // player miss
  if (player.isAttacking && player.frameCurrent === 3) {
    player.isAttacking = false;
  }
  // enemy miss
  if (enemy.isAttacking && enemy.frameCurrent === 3) {
    enemy.isAttacking = false;
  }

  // enemy attack collision detection
  if (
    rectCollision({ rect1: enemy, rect2: player }) &&
    enemy.isAttacking &&
    enemy.frameCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    gsap.to('#playerHealth', {
      width: player.health + '%',
    });
  }

  // END GAME BASED ON HEALTH
  if (enemy.health <= 0 || player.health <= 0 || enemy.score >= 5) {
    determineWinner({ player, enemy, timerId });
  }
}

// EVENT LISTENERS ( CONTROLS, KEYBOARD)

window.addEventListener('keydown', (e) => {
  if (!player.dead) {
    switch (e.key) {
      // player movement
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'w':
        player.velocity.y = -10;
        break;
      case 's':
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    switch (e.key) {
      // enemy movement
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        enemy.velocity.y = -10;
        break;
      case 'ArrowDown':
        enemy.attack();

        break;
    }
  }
});

// mobile touch event listeners for enemy on game buttons
gameBtnLeft.addEventListener('touchstart', () => {
  if (!enemy.dead) {
    keys.ArrowLeft.pressed = true;
    enemy.lastKey = 'ArrowLeft';
  }
});
gameBtnLeft.addEventListener('touchend', () => {
  if (!enemy.dead) {
    keys.ArrowLeft.pressed = false;
  }
});
gameBtnRight.addEventListener('touchstart', () => {
  if (!enemy.dead) {
    keys.ArrowRight.pressed = true;
    enemy.lastKey = 'ArrowRight';
  }
});
gameBtnRight.addEventListener('touchend', () => {
  if (!enemy.dead) {
    keys.ArrowRight.pressed = false;
  }
});
gameBtnJump.addEventListener('touchstart', () => {
  if (!enemy.dead) {
    enemy.velocity.y = -10;
  }
});
gameBtnAttack.addEventListener('touchstart', () => {
  if (!enemy.dead) {
    enemy.attack();
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'w':
      keys.w.pressed = false;
      break;
  }
  // enemy keys
  switch (e.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = false;
      break;
  }
});

// resize canvas and background on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  background.position.x = 0;
  background.position.y = 0;
  background.width = canvas.width;
  background.height = canvas.height;
});

// Loading screen
const removeOverlay = () => {
  document.body.removeChild(overlay);
};
const hideOverlay = () => {
  overlay.classList.add('hide');
  hud.classList.remove('hidden');
};

start.addEventListener('click', () => {
  start.classList.add('hidden');
  canvas.classList.remove('hidden');
  setTimeout(hideOverlay, 2600);
  setTimeout(removeOverlay, 2800);
  // setTimeout(decreaseTimer, 300);
  setTimeout(animate, 2800);
});
