let Sudu = (function() {
  let gennerateArr = function () {
    let arr = new Array(9);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(9);
      arr[i].fill(0, 0, 9);
    }
    return arr
  }
  
  let init = function(firstRow) {
    for (let i = 0; i < firstRow.length; i++) {
      while (true) {
        let rand = Math.floor(Math.random() * 9 + 1);
        if (firstRow.indexOf(rand) === -1) {
          firstRow[i] = rand;
          break;
        }
      }
    }
  }
  let judge = function(row, column, num, sudu) {
    //judge row
    for (let i = 0; i < column; i++) {
      if (sudu[row][i] === num) {
        return false;
      }
    }
    //judge column
    for (let i = 0; i < row; i++) {
      if (sudu[i][column] === num) {
        return false;
      }
    }
    //judge local
    let count = column % 3 + row % 3 * 3;
    while (count--) {
      if (sudu[row - row % 3 + Math.floor(count / 3)][column - column % 3 + count % 3] === num) {
        return false;
      }
    }
    return true;
  }
  
  let gennerateShudu = function() {
	 
    let sudu = gennerateArr();
    init(sudu[0]);
    let filltime = 0;
    for (let i = 1; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        filltime = 0;
        while(filltime < 10) {
          let num = Math.floor(Math.random() * 9 + 1);
          if (judge(i, j, num, sudu)) {
            sudu[i][j] = num;
            break;
          } else {
            filltime++;
          }
        }
        if (filltime >= 10) {
          if (j === 0) {
            i--;
            j = 8;
          } else {
            j--;
            j--;
          }
        }
      }
    }
    return sudu;
  }
  
 
  let checkRow = function(row, column, num, curSudu) {
    for (let i = 0; i < 9; i++) {
      if (curSudu[row][i] == 0) {
        continue;
      }
      if (curSudu[row][i] == num && i != column) {
        return false;
      }
    }
    return true;
  }
  
  let checkColumn = function(row, column, num, curSudu) {
    for (let i = 0; i < 9; i++) {
      if (curSudu[i][column] == 0) {
        continue;
      }
      if (curSudu[i][column] == num && i != row) {
        return false;
      }
    }
    return true;
  }
  
  let checkNine = function (row, column, num, curSudu) {
    let j = Math.floor(row / 3) * 3;
    let k = Math.floor(column / 3) * 3;
    // 循环比较
    for (let i = 0; i < 8; i++) {
      if (curSudu[j + Math.floor(i / 3)][k + i % 3] == 0) {
        continue;
      }
      if (curSudu[j + Math.floor(i / 3)][k + Math.round(i % 3)] == num && row != j + Math.floor(i / 3) && column != k + Math.round(i % 3)) {
        return false;
      }
    }
    return true;
  }
  return {
    gennerateShudu: gennerateShudu,
    judge: judge,
    checkRow: checkRow,
    checkColumn: checkColumn,
    checkNine: checkNine
  };
})()