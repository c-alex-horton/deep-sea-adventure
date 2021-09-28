var triangle = new Image();

var circle = new Image();

var square = new Image();

var playerImg = new Image();

var blank = new Image();

var diamond = new Image();

var canvas = document.getElementById("gameWindow");
var ctx = canvas.getContext("2d");

let cw = canvas.width;
let ch = canvas.height;

ctx.fillStyle = "lightblue";

function init() {
  triangle.src = "resources/images/SVG/Triangle.svg"; // Set source path
  circle.src = "resources/images/SVG/Circle.svg"; // Set source path
  square.src = "resources/images/SVG/Square.svg"; // Set source path
  playerImg.src = "resources/images/SVG/Player.svg"; // Set source path
  diamond.src = "resources/images/SVG/Diamond.svg"; // Set source path
  player1.updatePlayerPos();
  window.requestAnimationFrame(drawEvent);
}

// ----------GAME CODE----------

// Game Variables
let rolled = false;
let roll = 0;
let decent = true;

class Player {
  constructor() {
    this.inv = [];
    this.pos = 0;
    this.air = 15;
    this.decent = true;
  }

  updatePlayerPos = (a = 0) => {
    if (!this.decent) {
      a -= this.inv.length;
      a = a < 0 ? 0 : a;
      a = a * -1;
    }
    let newPos = a + this.pos;
    if (newPos >= trail.length - 1) {
      newPos = trail.length - 1;
      this.decent = false;
    }
    if (newPos < 0) {
      newPos = 0;
    }

    this.pos = newPos;
  };

  takeTile = () => {
    if (trail[this.pos].pickup) {
      this.inv.push(trail[this.pos]);
      trail[this.pos] = {
        pickup: false,
        shape: diamond,
      };
    }
  };

  accend = () => {
    this.decent = false;
  };

  drawPlayer = () => {
    draw(playerImg, 400, this.pos * 60 + 50);
  };
}
const player1 = new Player();

class Game {}

randVal = (min, max) => {
  min = Math.ceil(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

draw = (img, x, y) => {
  // img.addEventListener('load', function() {
  ctx.drawImage(img, x, y, 50, 50);

  //}, false);
};

const treasureList = [
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

let trail = [];

initTrail = (treasure) => {
  trail.push({
    shape: blank,
  });
  for (let a = 0; a < treasure.length; a++) {
    for (let b = 0; b < treasure[a].amount; b++) {
      trail.push({
        value: randVal(treasure[a].valueMin, treasure[a].valueMax),
        shape: treasure[a].shape,
        pickup: true,
      });
    }
  }
};

initTrail(treasureList);

printTrail = (trail, x, y) => {
  for (let i = 0; i < trail.length; i++) {
    draw(trail[i].shape, x, i * 60 + y);
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
drawRect = (x, y, w, h, c) => {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
};

drawRoll = () => {
  //  if (rolled) {
  ctx.fillText(`${roll}`, 600, 100);
  //  }
};

drawEvent = () => {
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, cw, ch);
  printTrail(trail, 500, 50);
  player1.drawPlayer();

  drawRect(10, 10, 100, 50, "white");
  ctx.fillStyle = "black";
  ctx.font = "40px serif";

  printTrail(player1.inv, 35, 80);
  drawRoll();

  window.requestAnimationFrame(drawEvent);
};

init();

rollbtn = document.getElementById("roll");
takebtn = document.getElementById("take");
accendbtn = document.getElementById("accend");

rollbtn.onclick = function () {
  rollDie();
};

takebtn.onclick = function () {
  player1.takeTile();
};

accendbtn.onclick = function () {
  player1.accend();
};
