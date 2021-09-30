var triangle = new Image();
var circle = new Image();
var square = new Image();
var playerImg = new Image();
var blank = new Image();
var diamond = new Image();
var bg = new Image();
var ship = new Image();
var tank = new Image();

var canvas = document.getElementById("gameWindow");
var ctx = canvas.getContext("2d");

let cw = canvas.width;
let ch = canvas.height;

function init() {
  triangle.src = "resources/images/SVG/Triangle.svg"; // Set source path
  circle.src = "resources/images/SVG/Circle.svg"; // Set source path
  square.src = "resources/images/SVG/Square.svg"; // Set source path
  playerImg.src = "resources/images/SVG/helmet.svg"; // Set source path
  diamond.src = "resources/images/SVG/Diamond.svg"; // Set source path
  bg.src = "resources/images/SVG/water.svg"; // Set source path
  ship.src = "resources/images/SVG/boat.svg"; // Set source path
  tank.src = "resources/images/SVG/tank.svg"; // Set source path
  roll = 0;
  player1 = new Player();
  game1 = new Game();
  player1.updatePlayerPos();
  drawEvent();
}

// ----------GAME CODE----------

// Game Variables
let rolled = false;
let roll = 0;

class Player {
  constructor() {
    this.oxygen = 15;
    this.inv = [];
    this.pos = 0;
    this.air = 15;
    this.decent = true;
    this.keptInv = [];
    this.total = 0;
  }

  updatePlayerPos = (a = 0) => {
    if (!this.decent) {
      a -= this.inv.length;
      a = a < 0 ? 0 : a;
      a = a * -1;
    }
    let newPos = a + this.pos;
    if (newPos >= game1.trail.length - 1) {
      newPos = game1.trail.length - 1;
      this.decent = false;
    }
    if (newPos < 0) {
      newPos = 0;
    }

    this.pos = newPos;
    this.oxygen -= this.inv.length;
    if (this.pos === 0 && !this.decent) {
      game1.roundReset();
      this.keptInv = this.keptInv.concat(this.inv);
      this.inv = [];
      this.tally();
    } else if (this.oxygen <= 0) {
      game1.roundReset();
      this.inv = [];
      this.tally();
    }
    rolled = false;
  };

  takeTile = () => {
    if (game1.trail[this.pos].pickup) {
      game1.trail[this.pos].round = game1.round;
      this.inv.push(game1.trail[this.pos]);
      game1.trail[this.pos] = {
        pickup: false,
        shape: diamond,
      };
    }
  };

  accend = () => {
    this.decent = false;
  };

  drawPlayer = () => {
    draw(playerImg, 400, this.pos * 55 + 75);
  };

  tally = () => {
    this.total = 0;
    this.keptInv.forEach((currentItem) => {
      this.total += currentItem.value;
    });
  };
}

class Game {
  constructor() {
    this.end = false;
    this.treasureList = [
      {
        level: 0,
        valueMin: 0,
        valueMax: 3,
        shape: triangle,
        amount: 4,
      },
      {
        level: 1,
        valueMin: 3,
        valueMax: 6,
        shape: square,
        amount: 5,
      },
      {
        level: 2,
        valueMin: 6,
        valueMax: 9,
        shape: circle,
        amount: 6,
      },
    ];
    this.round = 1;
    this.randVal = (min, max) => {
      min = Math.ceil(min);
      max = Math.ceil(max);
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    this.trail = [];
    (this.initTrail = (treasure) => {
      this.trail.push({
        shape: blank,
      });
      for (let a = 0; a < treasure.length; a++) {
        for (let b = 0; b < treasure[a].amount; b++) {
          this.trail.push({
            value: this.randVal(treasure[a].valueMin, treasure[a].valueMax),
            shape: treasure[a].shape,
            pickup: true,
          });
        }
      }
    }),
      this.initTrail(this.treasureList);
  }

  printTrail = (x = 500, y = 75) => {
    for (let i = 0; i < this.trail.length; i++) {
      draw(this.trail[i].shape, x, i * 55 + y);
    }
  };

  roundReset = () => {
    this.trail.forEach((currentItem, index) => {
      if (currentItem.shape === diamond) {
        this.trail.splice(index, 1);
      }
    });
    this.round++;
    if (this.round >= 4) {
      this.end = true;
    } else {
      player1.decent = true;
      player1.pos = 0;
      player1.oxygen = 15;
    }
  };
}

// END GAME CLASS

randVal = (min, max) => {
  min = Math.ceil(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

draw = (img, x, y, xs = 50, ys = 50) => {
  ctx.drawImage(img, x, y, xs, ys);
};

printTrail = (trail, x, y) => {
  for (let i = 0; i < trail.length; i++) {
    draw(trail[i].shape, x, i * 60 + y);
    if (game1.end) {
      ctx.fillText(`${trail[i].value}`, x + 20, i * 60 + y + 35);
    }
  }
};

rollDie = () => {
  let i = 1;
  console.log("roll init...");
  reroll = () => {
    roll = randVal(1, 6);
    rolled = true;
    i++;
    if (i < 6) {
      setTimeout(function () {
        reroll();
      }, i * 50);
    } else {
      console.log("...roll done!");
      player1.updatePlayerPos(roll);
    }
  };
  reroll();
};

// UI
bgx = 0;
drawBG = () => {
  draw(bg, bgx, 100, 1500, 900);
  bgx--;
  if (bgx === -498) {
    bgx = 0;
  }
  bubbleInst(bubble1);
  bubbleInst(bubble2);
  bubbleInst(bubble3);

  draw(ship, 475, 70, 150, 50);
};

drawRect = (x, y, w, h, c) => {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
};

drawCirc = (color, linewidth, x, y, r) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = linewidth;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.stroke();
};

drawRoll = () => {
  ctx.fillStyle = "white";
  ctx.font = "40px sans-serif";
  ctx.fillText("Roll", 700, 900);
  ctx.fillText(`${roll}`, 800, 900);
};

let bubble1 = {
  xpos: randVal(1, 1000),
  ypos: randVal(1505, 2000),
  speed: Math.random() * 2 + 0.5,
};
let bubble2 = {
  xpos: randVal(1, 1000),
  ypos: randVal(1005, 1500),
  speed: Math.random() * 2 + 0.5,
};
let bubble3 = {
  xpos: randVal(1, 1000),
  ypos: randVal(1005, 2000),
  speed: Math.random() * 2 + 0.5,
};

bubbleInst = (bubble) => {
  bubble.ypos -= bubble.speed;
  drawCirc("lightblue", 3, bubble.xpos, bubble.ypos, 5);
  if (bubble.ypos < 90) {
    bubble.ypos = randVal(1005, 1700);
    bubble.xpos = randVal(1, 1000);
    bubble.speed = Math.random() * 2 + 0.5;
  }
};

drawOx = () => {
  draw(tank, 25, 15, 20, 50);
  ctx.fillStyle = "black";

  ctx.fillText(`${player1.oxygen}`, 60, 55);
};

drawRnd = () => {
  if (game1.end) {
    rndText = "Game Over";
  } else {
    rndText = `Round ${game1.round}`;
  }
  ctx.fillText(rndText, 465, 40);
};

rollbtn = document.getElementById("roll");
takebtn = document.getElementById("take");
accendbtn = document.getElementById("accend");
replaybtn = document.getElementById("replay");

rollbtn.onclick = function () {
  rollDie();
};

takebtn.onclick = function () {
  player1.takeTile();
};

accendbtn.onclick = function () {
  player1.accend();
  rollDie();
};

replaybtn.onclick = function () {
  init();
};

drawEvent = () => {
  // Clear and draw bg
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, cw, ch);
  drawBG();

  drawOx();
  drawRnd();

  game1.printTrail();
  player1.drawPlayer();

  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText("Boat Inv", 10, 200);
  ctx.fillText(" Inv", 150, 200);
  printTrail(player1.inv, 145, 225);
  ctx.fillStyle = "black";
  printTrail(player1.keptInv, 25, 225);
  drawRoll();

  if (rolled) {
    document.getElementById("btn-caddy").style.display = "none";
  } else {
    document.getElementById("btn-caddy").style.display = "block";
  }

  if (!player1.decent || player1.pos === 0) {
    accendbtn.style.display = "none";
  } else {
    accendbtn.style.display = "block";
  }

  if (game1.end) {
    ctx.fillStyle = "white";
    ctx.font = "40px sans-serif";
    ctx.fillText(`Total: ${player1.total}`, 35, 900);
  }

  if (game1.trail[player1.pos].shape === diamond || player1.pos === 0) {
    takebtn.style.display = "none";
  } else {
    takebtn.style.display = "block";
  }

  if (game1.end || rolled) {
    rollbtn.style.display = "none";
  } else {
    rollbtn.style.display = "block";
  }

  if (game1.end) {
    replaybtn.style.display = "block";
  } else {
    replaybtn.style.display = "none";
  }

  window.requestAnimationFrame(drawEvent);
};

init();
