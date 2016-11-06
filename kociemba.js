
var Core = require("./core.js");

exports.findSolution = function (scrambledCube) {
  solution = Core.findSimpleSolution(scrambledCube, function (solution, scrambled) {
    var orientedCube = new Core.Cube(
      [[null, 0], [null, 0], [null, 0],
       [null, 0], [null, 0], [null, 0],
       [null, 0], [null, 0], [null, 0],
       [null, 0], [null, 0], [null, 0]],
      [[null, 0], [null, 0], [null, 0],
       [null, 0], [null, 0], [null, 0],
       [null, 0], [null, 0]]);
    var cube = scrambled.copy();
    var inPosition = false;
    var i, j, k;
    cube.algorithm(solution);

    if (cube.isEqual(orientedCube) === true) {
      for (i = 0; i < 12; ++i) {
        if (cube.edges[i] !== null && cube.edges[i][0] !== null) {
          inPosition = false;
          for (j = 0; j < 4; ++j) {
            if (cube.edges[i][0] === Core.moveData['U'][0][j]
                || cube.edges[i][0] === Core.moveData['D'][0][j]) {
              for (k = 0; k < 4; ++k) {
                if (i === Core.moveData['U'][0][k]
                    || i === Core.moveData['D'][0][k]) {
                  inPosition = true;
                }
              }
            }
          }
          if (inPosition === false) {
            return false;
          }
        }
      }
      for (i = 0; i < 8; ++i) {
        if (cube.corners[i] !== null && cube.corners[i][0] !== null) {
          inPosition = false;
          for (j = 0; j < 4; ++j) {
            if (cube.corners[i][0] === Core.moveData['U'][1][j]
                || cube.corners[i][0] === Core.moveData['D'][1][j]) {
              for (k = 0; k < 4; ++k) {
                if (i === Core.moveData['U'][1][k]
                    || i === Core.moveData['D'][1][k]) {
                  inPosition = true;
                }
              }
            }
          }
        }
        if (inPosition === false) {
          return false;
        }
      }
      return true;
    }
    return false;
  });
  var cube = scrambledCube.copy();
  cube.algorithm(solution);
  solution = solution.concat(Core.findSimpleSolution(cube));
  return solution;
}

