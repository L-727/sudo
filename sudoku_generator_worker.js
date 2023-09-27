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
  
self.onmessage = function(e) {  
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
  self.postMessage(sudu);  
};
 
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
/*////////////////////////////////////////////////////////////////////////////////////////////////////*/







const { ThreadPoolExecutor } = require('thread-pool-executor');  
  
// 生成一个9x9的数独矩阵  
function gennerateArr() {  
  return Array.from({ length: 9 }, () => Array(9).fill(0));  
}  
  
// 初始化数独矩阵的第一行和第一列  
function init(sudu) {  
  sudu[0][0] = 1;  
  for (let i = 1; i < 9; i++) {  
    sudu[0][i] = i + 1;  
    sudu[i][0] = i + 1;  
  }  
}  
  
// 判断当前位置是否可以填入数字  
function judge(i, j, num, sudu) {  
  // 检查当前位置是否已经有数字  
  if (sudu[i][j] !== 0) {  
    return false;  
  }  
  // 检查当前数字是否在当前行已经出现过  
  for (let k = 0; k < 9; k++) {  
    if (sudu[i][k] === num) {  
      return false;  
    }  
  }  
  // 检查当前数字是否在当前列已经出现过  
  for (let k = 0; k < 9; k++) {  
    if (sudu[k][j] === num) {  
      return false;  
    }  
  }  
  // 检查当前数字是否在当前3x3方格已经出现过  
  let row = Math.floor(i / 3) * 3;  
  let col = Math.floor(j / 3) * 3;  
  for (let m = row; m < row + 3; m++) {  
    for (let n = col; n < col + 3; n++) {  
      if (sudu[m][n] === num) {  
        return false;  
      }  
    }  
  }  
  return true;  
}  
  
// 生成一个数独矩阵  
 let gennerateShudu = function() {  
  const sudu = gennerateArr();  
  init(sudu[0]);  
  const filltime = new Array(9).fill(0);  
  const executor = new ThreadPoolExecutor({ maxConcurrentTasks: 9 });  
  for (let i = 1; i < 9; i++) {  
    for (let j = 0; j < 9; j++) {  
      executor.execute(() => {  
        let num = Math.floor(Math.random() * 9 + 1);  
        if (judge(i, j, num, sudu)) {  
          sudu[i][j] = num;  
        } else {  
          filltime[j]++;  
          if (filltime[j] >= 10) {  
            if (j === 0) {  
              i--;  
              j = 8;  
            } else {  
              j--;  
              j--;  
            }  
          } else {  
            executor.execute(() => gennerateShudu()); // 重新生成当前位置的数字，递归调用gennerateShudu函数直到填满为止。注意这里需要再次创建线程池，否则会出现死循环。  
          }  
        }  
      });  
    }  
  }  
  executor.shutdown(); // 关闭线程池，等待所有任务执行完毕。由于最大并发任务数设置为9，所以这里等待的时间应该很短。如果需要等待更长时间，可以将最大并发任务数设置得更大。



///////////////
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