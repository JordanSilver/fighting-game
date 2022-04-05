class Background {
  constructor({ position, imageSrc }) {
    this.position = position;
    this.height = canvas.height;
    this.width = canvas.width;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
  }
}
class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = canvas.height;
    this.width = canvas.width;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.frameCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.frameCurrent < this.framesMax - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: 0, height: 0 },
  }) {
    super({
      imageSrc,
      scale,
      framesMax,
      position,
      offset,
    });

    this.velocity = velocity;
    this.height = 100;
    this.width = 30;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.frameCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;
    this.score = 0;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    if (!this.dead) this.animateFrames();

    // ATTACK BOX
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // ATTACK BOX HELPER
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // gravity function
    if (
      this.position.y + this.height + this.velocity.y >=
      canvas.height - (3 / 7) * this.height
    ) {
      this.velocity.y = 0;
      this.position.y = canvas.height - (3 / 7) * this.height - this.height;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    if (this.lastKey === 'ArrowLeft' || this.lastKey === 'ArrowDown') {
      this.switchSprite('attack');
    } else if (this.lastKey === 'ArrowRight' || this.lastKey === 'ArrowDown') {
      this.switchSprite('attack2');
    }

    this.isAttacking = true;
  }

  takeHit({ damage = 1 }) {
    this.health -= damage;
    if (this.health <= 0) {
      this.switchSprite('death');
    } else {
      this.switchSprite('takeHit');
    }
  }

  switchSprite(sprite) {
    // override animations for death
    if (this.image === this.sprites.death.image) {
      if (this.frameCurrent === this.sprites.death.framesMax - 1)
        this.dead = true;
      return;
    }
    // overiding all other animations with takeHit ani
    if (
      this.image === this.sprites.takeHit.image &&
      this.frameCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    // overiding all other animations with attack ani
    if (
      (this.image === this.sprites.attack.image &&
        this.frameCurrent < this.sprites.attack.framesMax - 1) ||
      (this.image === this.sprites.attack2.image &&
        this.frameCurrent < this.sprites.attack2.framesMax - 1)
    )
      return;

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'idleLeft':
        if (this.image !== this.sprites.idleLeft.image) {
          this.image = this.sprites.idleLeft.image;
          this.framesMax = this.sprites.idleLeft.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'runLeft':
        if (this.image !== this.sprites.runLeft.image) {
          this.image = this.sprites.runLeft.image;
          this.framesMax = this.sprites.runLeft.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'jumpLeft':
        if (this.image !== this.sprites.jumpLeft.image) {
          this.image = this.sprites.jumpLeft.image;
          this.framesMax = this.sprites.jumpLeft.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'fallLeft':
        if (this.image !== this.sprites.fallLeft.image) {
          this.image = this.sprites.fallLeft.image;
          this.framesMax = this.sprites.fallLeft.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'attack':
        if (this.image !== this.sprites.attack.image) {
          this.image = this.sprites.attack.image;
          this.framesMax = this.sprites.attack.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'attackLeft':
        if (this.image !== this.sprites.attackLeft.image) {
          this.image = this.sprites.attackLeft.image;
          this.framesMax = this.sprites.attackLeft.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'attack2':
        if (this.image !== this.sprites.attack2.image) {
          this.image = this.sprites.attack2.image;
          this.framesMax = this.sprites.attack2.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.frameCurrent = 0;
        }
        break;
    }
  }
}
