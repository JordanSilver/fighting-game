const canvas = document.querySelector('canvas');
const overlay = document.querySelector('.js-overlay');
const start = document.querySelector('#start');
const splash = document.querySelector('.splash');
const hud = document.querySelector('#hud');
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
    x: 0,
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
  scale: 1.5,
  offset: { x: 20, y: 80 },
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
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/royalKnight/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/royalKnight/Attack1.png',
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
      x: 100,
      y: 25,
    },
    width: 95,
    height: 25,
  },
});

const enemy = new Fighter({
  position: { x: 400, y: 100 },
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
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
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
      x: -190,
      y: 25,
    },
    width: 100,
    height: 25,
  },
});

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

  player.update();
  enemy.update();

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
    enemy.velocity.x = -3;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 3;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  // COLLISION DETECTION

  // player attack collision detection
  if (
    rectCollision({ rect1: player, rect2: enemy }) &&
    player.isAttacking &&
    player.frameCurrent === 2
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    gsap.to('#enemyHealth', {
      width: enemy.health + '%',
    });
  }

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
  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
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
  setTimeout(decreaseTimer, 300);
  setTimeout(animate, 2700);
});
