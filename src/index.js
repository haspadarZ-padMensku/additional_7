module.exports = function solveSudoku(matrix) {

  function fillSuggestions(arr) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (arr[i][j] == 0 || Array.isArray(arr[i][j])) {
          arr[i][j] = [];
          for (let k = 1; k <= 9; k++) {
            if (checkRow(arr, i, j, k) &&
              checkCol(arr, i, j, k) &&
              checkBlock(arr, i, j, k)) {
              arr[i][j].push(k);
            }
          }
        }
      }
    }
  }

  function checkRow(arr, r, c, value) {
    for (let i = 0; i < 9; i++) {
      if (i == c) continue; //не проверяем исходную ячейку
      if (arr[r][i] == 0 || Array.isArray(arr[r][i])) continue;
      if (arr[r][i] == value) return false; //значит такое число уже есть
    }
    return true;
  }

  function checkCol(arr, r, c, value) {
    for (let i = 0; i < 9; i++) {
      if (i == r) continue; //не проверяем исходную ячейку
      if (arr[i][c] == 0 || Array.isArray(arr[i][c])) continue;
      if (arr[i][c] == value) return false; //значит такое число уже есть
    }
    return true;
  }

  function checkBlock(arr, r, c, value) {
    let row = Math.floor(r / 3) * 3;
    let col = Math.floor(c / 3) * 3;
    for (let i = row; i < (row + 3); i++) {
      for (let j = col; j < (col + 3); j++) {
        if (i == r && j == c) continue; //не проверяем исходную ячейку
        if (arr[i][j] == 0 || Array.isArray(arr[i][j])) continue;
        if (arr[i][j] == value) return false; //значит такое число уже есть
      }
    }
    return true;
  }

  function fillSudoku(arr) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (arr[i][j].length == 1) {
          arr[i][j] = (arr[i][j])[0];
        }
      }
    }
  }

  function checkSudoku(arr) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Array.isArray(arr[i][j])) return true;
      }
    }
    return false;
  }

  function checkSingleArr(arr) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (arr[i][j].length == 1) return true;
      }
    }
    return false;
  }

  function createArrOfMatrix(arr) { //создание массива всех возможных матриц на данной итерации
    let arrOfMatrix = [];

    outerLoop: for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Array.isArray(arr[i][j]) && !checkSingleArr(arr)) {
          for (let k = 0; k < arr[i][j].length; k++) {
            let variants = arr[i][j]; //здесь будет ссылка на массив возможных значений ячейки
            arrOfMatrix.push(arrayClone(arr)); //копия входного массива на позиции 0
            arrOfMatrix[arrOfMatrix.length - 1][i][j] = variants[k]; //в ячейку вместо масс число
          }
          break outerLoop;
        }
      }
    }
    return arrOfMatrix;
  }

  function arrayClone (arr) { //from https://wcoder.github.io/notes/simple-array-cloning-in-javascript
    var i, copy;
    
    if (Array.isArray(arr)) {
      copy = arr.slice(0);
      for (i = 0; i < copy.length; i++) {
        copy[i] = arrayClone(copy[i]);
      }
      return copy;
    } else if(typeof arr === 'object') {
      throw 'Cannot clone array containing an object!';
    } else {
      return arr;
    }
  }

  function fillByOne(arr) {
    do {
      fillSuggestions(arr);
      fillSudoku(arr);
      fillSuggestions(arr);
    }
    while (checkSudoku(arr) && checkSingleArr(arr)); //пока есть массивы, и с 1 элементом
    return arr;
  }

  function isOk(arr) { //полная проверка
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Array.isArray(arr[i][j]) ||
          arr[i][j] == 0 ||
          !checkRow(arr, i, j, arr[i][j]) ||
            !checkCol(arr, i, j, arr[i][j]) ||
            !checkBlock(arr, i, j, arr[i][j])) {
          return false;
        }
      }
    }
    return true;
  }

  function isError(arr) { //проверка на наличие повторений в промежуточной матрице
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (arr[i][j] == 0 || Array.isArray(arr[i][j])) {
          continue;
        } else {
          if (!checkRow(arr, i, j, arr[i][j]) ||
            !checkCol(arr, i, j, arr[i][j]) ||
            !checkBlock(arr, i, j, arr[i][j])) {
            return true;
          }
        }
      }
    }
    return false;
  }

  //=========================main=======================

  function mainSolve(arr) {

    arr = fillByOne(arr);

    if (isOk(arr)) {
      return arr;
    }

    if (isError(arr)) {
      return null;
    }

    let arrOfMatrix = createArrOfMatrix(arr);

    for (let i = 0; i < arrOfMatrix.length; i++) {
      let res = mainSolve(arrOfMatrix[i]);
      if (res !== null) {
        return res;
      }
      if (res == null) {
        continue;
      }
    }
  }

  return mainSolve(matrix);
}
