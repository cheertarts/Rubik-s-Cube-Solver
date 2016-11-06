
const cycleOrientation = {
  edge: [1, 0],
  cornerc: [1, 2, 0],
  cornercc: [2, 0, 1]
};

const moveData = {
  'U'  : [[0, 1, 2, 3], [0, 1, 2, 3], 'c', false, false],
  'U\'': [[0, 1, 2, 3], [0, 1, 2, 3], 'cc', false, false],
  'U2' : [[0, 1, 2, 3], [0, 1, 2, 3], 'h', false, false],
  'D'  : [[8, 9, 10, 11], [4, 5, 6, 7], 'c', false, false],
  'D\'': [[8, 9, 10, 11], [4, 5, 6, 7], 'cc', false, false],
  'D2' : [[8, 9, 10, 11], [4, 5, 6, 7], 'h', false, false],
  'R'  : [[1, 6, 9, 5], [2, 1, 6, 5], 'c', false, true],
  'R\'': [[1, 6, 9, 5], [2, 1, 6, 5], 'cc', false, true],
  'R2' : [[1, 6, 9, 5], [2, 1, 6, 5], 'h', false, false],
  'L'  : [[3, 4, 11, 7], [0, 3, 4, 7], 'c', false, true],
  'L\'': [[3, 4, 11, 7], [0, 3, 4, 7], 'cc', false, true],
  'L2' : [[3, 4, 11, 7], [0, 3, 4, 7], 'h', false, false],
  'F'  : [[2, 5, 8, 4], [3, 2, 5, 4], 'c', true, true],
  'F\'': [[2, 5, 8, 4], [3, 2, 5, 4], 'cc', true, true],
  'F2' : [[2, 5, 8, 4], [3, 2, 5, 4], 'h', false, false],
  'B'  : [[0, 7, 10, 6], [1, 0, 7, 6], 'c', true, true],
  'B\'': [[0, 7, 10, 6], [1, 0, 7, 6], 'cc', true, true],
  'B2' : [[0, 7, 10, 6], [1, 0, 7, 6], 'h', false, false]
};

function cycleFour(array, fourIs, offset) {
  var fixedArray = [];
  var i, iOffset;

  for (i = 0; i < 4; ++i) {
    fixedArray[i] = array[fourIs[i]];
  }

  for (i = 0; i < 4; ++i) {
    iOffset = i + offset;

    while (iOffset > 3) {
      iOffset -= 4;
    }
    while (iOffset < 0) {
      iOffset += 4;
    }

    array[fourIs[i]] = fixedArray[iOffset];
  }
}

function emptyList(size) {
  var list = [];
  for (var i = 0; i < size; ++i) {
    list[i] = null;
  }
  return list;
}

class Cube {

  constructor(edges, corners, scramble) {
    if (edges === undefined) {
      this.edges = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
                    [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0]];
    } else {
      this.edges = edges;
    }

    if (corners === undefined) {
      this.corners = [[0, 0], [1, 0], [2, 0], [3, 0],
                      [4, 0], [5, 0], [6, 0], [7, 0]];
    } else {
      this.corners = corners;
    }

    if (scramble !== undefined) {
      this.algorithm(scramble);
    }
  }

  genBasicTurn(edgePositions, cornerPositions, turnType) {
    var offset;
    if (turnType === 'c') {
      offset = -1;
    } else if (turnType === 'cc') {
      offset = 1;
    } else if (turnType === 'h') {
      offset = 2;
    }

    cycleFour(this.edges, edgePositions, offset);
    cycleFour(this.corners, cornerPositions, offset);
  }

  genOrientedTurn(edgePositions, cornerPositions, turnType, edgeO, cornerO) {
    var i;
    var pos;

    if (edgeO === true) { for (i = 0; i < 4; ++i) {
        pos = this.edges[edgePositions[i]];
        if (pos !== null) {
          pos[1] = cycleOrientation.edge[pos[1]];
        }
      }
    }

    if (cornerO === true) {
      for (i = 0; i < 4; ++i) {
        pos = this.corners[cornerPositions[i]];
        if (pos !== null) {
          if (i === 0 || i === 2) {
            pos[1] = cycleOrientation.cornerc[pos[1]];
          } else if (i === 1 || i === 3) {
            pos[1] = cycleOrientation.cornercc[pos[1]];
          }
        }
      }
    }

    this.genBasicTurn(edgePositions, cornerPositions, turnType);
  }

  faceTurn(turn) {
    this.genOrientedTurn.apply(this, moveData[turn]);
  }

  algorithm(alg) {
    for (var i = 0; i < alg.length; ++i) {
      this.faceTurn(alg[i]);
    }
  }

  isEqual(cube) {
    var i;

    for (i = 0; i < 12; ++i) {
      if (this.edges[i] !== null && cube.edges[i] !== null) {
        if (this.edges[i][0] !== null && cube.edges[i][0] !== null) {
          if (this.edges[i][0] !== cube.edges[i][0]) {
            return false;
          }
        }
        if (this.edges[i][1] !== null && cube.edges[i][1] !== null) {
          if (this.edges[i][1] !== cube.edges[i][1]) {
            return false;
          }
        }
      }

      if (i < 8) {
        if (this.corners[i] !== null && cube.corners[i] !== null) {
          if (this.corners[i][0] !== null && cube.corners[i][0] !== null) {
            if (this.corners[i][0] !== cube.corners[i][0]) {
              return false;
            }
          }
          if (this.corners[i][1] !== null && cube.corners[i][1] !== null) {
            if (this.corners[i][1] !== cube.corners[i][1]) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  copy() {
    var edges = [];
    var corners = [];
    var i;

    for (i = 0; i < 12; ++i) {
      if (this.edges[i] === null) {
        edges[i] = null;
      } else {
        edges[i] = [];
        edges[i][0] = this.edges[i][0];
        edges[i][1] = this.edges[i][1];
      }
      if (i < 8) {
        if (this.corners[i] === null) {
          corners[i] = null;
        } else {
          corners[i] = [];
          corners[i][0] = this.corners[i][0];
          corners[i][1] = this.corners[i][1];
        }
      }
    }
    return new Cube(edges, corners);
  }

  subset(solvedSubset) {
    var cube = new Cube(emptyList(12), emptyList(8));
    var i;
    var j;

    for (i = 0; i < 12; ++i) {
      if (solvedSubset.edges[i] !== null) {
        for (j = 0; j < 12; ++j) {
          if (this.edges[j][0] === solvedSubset.edges[i][0]) {
            cube.edges[j] = [];
            cube.edges[j][0] = this.edges[j][0];
            cube.edges[j][1] = this.edges[j][1];
          }
        }
      }
    }

    for (i = 0; i < 8; ++i) {
      if (solvedSubset.corners[i] !== null) {
        for (j = 0; j < 8; ++j) {
          if (this.corners[j][0] === solvedSubset.corners[i][0]) {
            cube.corners[j] = [];
            cube.corners[j][0] = this.corners[j][0];
            cube.corners[j][1] = this.corners[j][1];
          }
        }
      }
    }
    return cube;
  }

}

function rotateAlgorithmY(alg, rotationType) {
  var rotate = {
    'c': {
      'U': 'U', 'D': 'D', 'R': 'B',
      'L': 'F', 'F': 'R', 'B': 'L',
    },
    'cc': {
      'U': 'U', 'D': 'D', 'R': 'F',
      'L': 'B', 'F': 'L', 'B': 'R',
    },
    'h': {
      'U': 'U', 'D': 'D', 'R': 'L',
      'L': 'R', 'F': 'B', 'B': 'F',
    },
  };
  var newAlg = [];
  var i;

  for (i = 0; i < alg.length; ++i) {
    if (alg[i].length > 1) {
      newAlg.push(rotate[rotationType][alg[i][0]].concat(alg[i][1]));
    } else {
      newAlg.push(rotate[rotationType][alg[i][0]]);
    }
  }
  return newAlg;
}

function onlyContains(array, value) {
  for (var i = 0; i < array.length; ++i) {
    if (array[i] !== value) {
      return false;
    }
  }
  return true;
}

function oneItemArray(item, length) {
  var array = [];
  for (var i = 0; i < length; ++i) {
    array.push(item);
  }
  return array;
}

function simplestForm(alg) {
  var group = {'U': 1, 'D': 1, 'R': 2, 'L': 2, 'F': 3, 'B': 3}
  for (var i = 1; i < alg.length; ++i) {
    if (alg[i][0] === alg[i - 1][0]) {
      return false;
    }
  }
  for (var i = 2; i < alg.length; ++i) {
    if (group[alg[i - 1][0]] === group[alg[i - 2][0]]
        && group[alg[i][0]] === group[alg[i - 1][0]]) {
      return false;
    }
  }
  return true;
}

function getNextAlgorithm(alg) {
  var cycle = {
    "U": "U'", "U'": "U2", "U2": "D",
    "D": "D'", "D'": "D2", "D2": "R",
    "R": "R'", "R'": "R2", "R2": "L",
    "L": "L'", "L'": "L2", "L2": "F",
    "F": "F'", "F'": "F2", "F2": "B",
    "B": "B'", "B'": "B2", "B2": null,
  };
  var algorithm;

  if (cycle[alg[alg.length - 1]] !== null) {
    algorithm = alg.slice(0, -1).concat(cycle[alg[alg.length - 1]]);
  } else if (onlyContains(alg, "B2") === false) {
    algorithm = getNextAlgorithm(alg.slice(0, -1)).concat("U");
  } else {
    algorithm = oneItemArray("U", alg.length + 1);
  }

  if (simplestForm(algorithm) === false) {
    algorithm = getNextAlgorithm(algorithm);
  }
  return algorithm;
}

function checkSolution(solution, scrambledCube) {
  var cube = scrambledCube.copy();
  cube.algorithm(solution);
  return cube.isEqual(new Cube());
}

function findSimpleSolution(scrambledCube, limit, checkSolutionFunction) {
  var currentAlg = ["U"];
  var i;

  if (checkSolutionFunction === undefined) {
    checkSolutionFunction = checkSolution;
  }
  if (checkSolutionFunction([], scrambledCube)) {
    return [];
  }

  while (true) {
    if (checkSolutionFunction(currentAlg, scrambledCube)) {
      return currentAlg;
    }
    if (limit != undefined && currentAlg.length > limit) {
      return null;
    }
    currentAlg = getNextAlgorithm(currentAlg);
  }
}

module.exports = {
  moveData: moveData,
  emptyList: emptyList,
  Cube: Cube,
  rotateAlgorithmY: rotateAlgorithmY,
  simplestForm: simplestForm,
  getNextAlgorithm: getNextAlgorithm,
  checkSolution: checkSolution,
  findSimpleSolution: findSimpleSolution,
};

// vim: set ts=2 sts=2 sw=2 et:
