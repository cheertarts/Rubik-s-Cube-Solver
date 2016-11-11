
var Core = require("./core.js");
var Kociemba = require("./kociemba.js");

var randomSeed = (new Date()).getTime();

function random() {
  var x = Math.sin(randomSeed++) * 10000;
  return x - Math.floor(x);
}

function genScramble() {
  var moves = [
    'U', 'U\'', 'U2',
    'D', 'D\'', 'D2',
    'R', 'R\'', 'R2',
    'L', 'L\'', 'L2',
    'F', 'F\'', 'F2',
    'B', 'B\'', 'B2',
  ]
  var alg;
  while (true) {
    alg = [];
    for (var i = 1; i <= 20; ++i) {
      alg.push(moves[Math.floor(random() * 17)]);
    }
    if (Core.simplestForm(alg) === true) {
      break;
    }
  }
  return alg;
}

function expandChar(character) {
  if (['0','1','2','3','4','5','6','7','8','9'].includes(character)) {
    return Number(character);
  } else if (character === 'A') {
    return 10;
  } else if (character === 'B') {
    return 11;
  }
}

function shrinkData(value) {
  if (value < 10) {
    return String(value);
  } else if (value === 10) {
    return "A";
  } else if (value === 11) {
    return "B";
  }
}

// In the format: N.N.N.N.N.N.N.N.N.N.N.N:N.N.N.N.N.N.N.N
// or             00.10.20.30.40.50.60.70.80.90.A0.B0:10.20.30.40.50.60.70
// Where N means null, A means 10 and B means 11.
function expandCubeDef(cubeDef) {
  cubeDef = cubeDef.split(":");
  cubeDef[0] = cubeDef[0].split(".");
  cubeDef[1] = cubeDef[1].split(".");
  var cubeTable = [];

  for (var i = 0; i < 2; ++i) {
    cubeTable[i] = [];
    for (var j = 0; j < cubeDef[i].length; ++j) {
      if (cubeDef[i][j] === 'N') {
        cubeTable[i][j] = null;
      } else {
        cubeTable[i][j] = [expandChar(cubeDef[i][j][0]), expandChar(cubeDef[i][j][1])];
      }
    }
  }
  return new Core.Cube(cubeTable[0], cubeTable[1]);
}

function shrinkCubeDef(cube) {
  var cubeTable = [];
  var cubeDef = [];
  cubeTable[0] = cube.edges;
  cubeTable[1] = cube.corners;

  for (var i = 0; i < 2; ++i) {
    cubeDef[i] = [];
    for (var j = 0; j < cubeTable[i].length; ++j) {
      if (cubeTable[i][j] === null) {
        cubeDef[i][j] = "N";
      } else {
        cubeDef[i][j] = shrinkData(cubeTable[i][j][0]).concat(shrinkData(cubeTable[i][j][1]));
      }
    }
  }
  
  cubeDef[0] = cubeDef[0].join(".");
  cubeDef[1] = cubeDef[1].join(".");
  cubeDef = cubeDef.join(":");
  return cubeDef;
}

var mode;
var arg = "";
for (var i = 0; i < process.argv.length; ++i) {
  if (process.argv[i] === 'node') {
    continue;
  }
  if (process.argv[i][0] === '/') {
    continue;
  }
  if (process.argv[i] === '-s' || process.argv[i] === '--scramble') {
    mode = 'scramble';
    continue;
  }
  if (process.argv[i] === '-c' || process.argv[i] === '--cube') {
    mode = 'cube';
    continue;
  }
  if (process.argv[i] === '-t' || process.argv[i] === '--scramble-to-cube') {
    mode = 'convert';
    continue;
  }
  if (process.argv[i] === '-r' || process.argv[i] === '--cross') {
    mode = 'cross';
    continue;
  }
  arg = arg.concat(process.argv[i]).concat(" ");
}

arg = arg.slice(0, -1).replace(/i/g, '\'');

if (mode === undefined) {
  console.log("-s - generates 20 scrambles.\n-c - solves a cube.\n-t - converts scramble to cube notation.");
}

if (mode === 'scramble') {
  for (var i = 1; i <= 20; ++i) {
    console.log(String(i).concat(": ").concat(genScramble().join(" ")));
  }
}

if (mode === 'cube') {
  console.log(Core.findSimpleSolution(expandCubeDef(arg)).join(" "));
}

if (mode === 'convert') {
  console.log(arg);
  var cube = new Core.Cube(undefined, undefined, arg.split(" "));
  console.log(shrinkCubeDef(cube));
}

if (mode === 'cross') {
  console.log(arg);
  var cube = new Core.Cube(undefined, undefined, arg.split(" "));
  var cross = cube.subset(new Core.Cube(
    Core.emptyList(8).concat([[8, 0], [9, 0], [10, 0], [11, 0]]),
    Core.emptyList(8)));
  console.log(Core.findSimpleSolution(cross).join(" "));
}

