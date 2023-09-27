let levelBlank = {
  "初级": 15,
  "中级": 30,
  "高级": 45
}
let sudu; //保存完整数独表的二维数组
let curSudu; //保存当前游戏的数独表的二维数组
let status = 0; //0：准备  1：游戏中
let time; //保存游戏开始的时间或者游戏所用时间
//randomBlank
//params: level 难度级别
//return blanks 所有空格的坐标
let randomBlank = function(level) {
  let blankNum = levelBlank[level];
  let blanks = [];
  for (let i = 0; i < blankNum; i++) {
    let blank = {
      row: Math.floor(Math.random() * 9),
      column: Math.floor(Math.random() * 9)
    }
    let isIn = false;
    for (let j = 0; j < blanks.length; j++) {
      if (blank.row === blanks[j].row && blank.column === blanks[j].column) {
        isIn = true;
        break;
      }
    }
    if (!isIn) {
      blanks.push(blank);
    } else {
      i--;
    }
  }
  return blanks;
}
//showSudu
//params: 
//return 
//开始游戏，生成完整数独表的二维数组，保存在sudu中，初始化curSudu，渲染数独游戏界面
let showSudu = function () {
  let level = document.getElementsByClassName("select")[0].value;
  let blankIndexs = randomBlank(level);
  try {
    sudu = Sudu.gennerateShudu();
	console.log(sudu);
    status = 1;
    
    curSudu = new Array(9);
    for (let i = 0; i < sudu.length; i++) {
      curSudu[i] = [];
      for (let j = 0; j < sudu[i].length; j++) {
        curSudu[i].push(sudu[i][j]);
      }
    }
    let board = document.getElementsByClassName("game")[0];
    let inputs = board.children;
    for (let i = 0; i < blankIndexs.length; i++) {
      let row = blankIndexs[i].row;
      let column = blankIndexs[i].column;
      curSudu[row][column] = 0;
    }
    for (let i = 0; i < curSudu.length; i++) {
      
      for (let j = 0; j < curSudu[i].length; j++) {
        inputs[j*9+i].id = i + "&" + j;
        if (curSudu[i][j] != 0) {
          inputs[j*9+i].value = curSudu[i][j];
          inputs[j*9+i].readOnly = "readonly";
          inputs[j*9+i].style.backgroundColor = "";
        } else {
          inputs[j*9+i].value = "";
          inputs[j*9+i].readOnly = "";
          inputs[j*9+i].style.backgroundColor = "white";
          inputs[j*9+i].addEventListener("change", handleChange);
        }
      }
    }
    time = new Date().getTime();
  }
  catch (e) {
    console.log(e);
  }
}
//handleChange
//params: e 空格的值发生改变的事件
//return 
//当空格填入的值发生改变时，对值进行监测，检查是否冲突，进行提示
let handleChange = function(e) {
  let element = e.currentTarget;
  let indexs = element.id.split("&");
  curSudu[indexs[0]][indexs[1]] = element.value == '' ? 0 : element.value;
  let tip = document.getElementsByClassName("cur_situation")[0].children[0];
  if (!(Sudu.checkRow(indexs[0], indexs[1], element.value, curSudu) && Sudu.checkColumn(indexs[0], indexs[1], element.value, curSudu) && Sudu.checkNine(indexs[0], indexs[1], element.value, curSudu))) {
    tip.innerHTML = "\n第" + indexs[0] + "行第" + indexs[1] + "列冲突！";
    element.style.backgroundColor = "#f34949";
  } else {
    tip.innerHTML = "";
    element.style.backgroundColor = "white";
  }
}
//isAnswerRight
//params: 
//return boolean 提交的答案是否正确
let isAnswerRight = function() {
  for (let i = 0; i < sudu.length; i++) {
    for (let j = 0; j < sudu[i].length; j++) {
      if (curSudu[i][j] != sudu[i][j]) {
        return false;
      }
    }
  }
  return true;
}
//isAnswerFull
//params: 
//return boolean 提交的数独表是否已经填满
let isAnswerFull = function () {
  for (let i = 0; i < curSudu.length; i++) {
    for (let j = 0; j < curSudu[i].length; j++) {
      if (curSudu[i][j] == 0) {
        return false;
      }
    }
  }
  return true;
}
//submitAnswer
//params: 
//return 
//提交答案时的总处理函数
let submitAnswer = function() {
  if (status != 1) {
    alert("请选择关卡，开始游戏！");
  } else if (!isAnswerFull()) {
    alert("请填满空格！！");
  } else if (isAnswerRight() && status == 1) {
    time = ((new Date().getTime() - time) / 1000 / 60).toFixed(2);
    let tip = document.getElementsByClassName("cur_situation")[0].children[0];
    tip.innerHTML = "请选择关卡，继续游戏！"
    status = 0;
    showElement("username-box");
    let timeLable = document.getElementsByClassName("time")[0];
    timeLable.innerHTML = time;
    let inputs = document.getElementsByClassName("game")[0].children;
    Array.from(inputs).forEach(element => {
      element.value = "";
      element.style.backgroundColor = "#8ca0ff";
      element.readOnly = "readonly";
    });
  } else if (!isAnswerRight()) {
    alert("游戏失败！");
  }
}
//showElement
//params: className 需要展示的DOM元素的class样式选择器
//return 
//在浏览器界面中展示某个Dom元素
let showElement = function(className) {
  document.getElementsByClassName(className)[0].style.display = "block";
  document.getElementsByClassName("game")[0].style.opacity = 0.5;
  document.getElementsByClassName("info")[0].style.opacity = 0.5;
}
//hideElement
//params: className 需要隐藏的DOM元素的class样式选择器
//return 
//在浏览器界面中隐藏某个Dom元素
let hideElement = function(className) {
  document.getElementsByClassName(className)[0].style.display = "none";
  document.getElementsByClassName("game")[0].style.opacity = 1;
  document.getElementsByClassName("info")[0].style.opacity = 1;
}
//submitGrade
//params
//return 
//提交成绩
let submitGrade = function() {
  storeGrade();
  hideElement("username-box");
}
//closeChart
//params
//return 
//关闭通过界面
let closeChart = function(e) {
  hideElement("username-box")
}
//openChart
//params
//return 
//打开成绩榜单
let openChart = function() {
  showElement("rank-chart");
  let rankLis = document.getElementsByClassName("rank-li")[0].children;
  let ranks = getRank();
  for (let i = 0; i < ranks.length; i++) {
    rankLis[i].getElementsByClassName("username")[0].innerHTML = ranks[i].username;
    rankLis[i].getElementsByClassName("user-time")[0].innerHTML = ranks[i].time;
  }
  for (let i = ranks.length; i < 10; i++) {
    rankLis[i].getElementsByClassName("username")[0].innerHTML = '';
    rankLis[i].getElementsByClassName("user-time")[0].innerHTML = '';
  }
  let maxGrade = getMaxGrade();
  document.getElementsByClassName('b-username')[0].innerHTML = maxGrade.username;
  document.getElementsByClassName('b-time')[0].innerHTML = maxGrade.time;
}
//getRank
//params
//return ranks 最近的十次成绩
//得到最近的十次成绩
let getRank = function() {
  let rankStr = '';
  let ranks = [];
  if (localStorage.getItem('rank')) {
    rankStr = localStorage.getItem('rank');
    let rankArr = rankStr.split('||');
    for (let i = 0; i < rankArr.length; i++) {
      let tmp = rankArr[i].split('&');
      ranks.push({
        username: tmp[0].split('=')[1],
        time: tmp[1].split('=')[1]
      });
    }
  }
  return ranks;
}
//getMaxGrade
//params
//return maxGrade
//得到最好的一次成绩
let getMaxGrade = function() {
  let maxGradeStr = '';
  if (localStorage.getItem('maxGrade')) {
    maxGradeStr = localStorage.getItem('maxGrade');
  }
  let maxGrade = {
    username: '',
    time: ''
  };
  if (maxGradeStr) {
    let arr = maxGradeStr.split('&');
    let user = arr[0].split('=');
    let time = arr[1].split('=');
    maxGrade.username = user[1];
    maxGrade.time = time[1];
  }
  return maxGrade;
}
//storeRank
//params rank 新保存的成绩
//return 
//保存刚刚提交的成绩，得到最好的一次成绩并保存
let storeRank = function(rank) {
  let ranks = getRank();
  ranks.unshift(rank);
  for (let i = 0; i < ranks.length - 10; i++) {
    ranks.pop();
  }
  let rankStr = "";
  for (let i = 0; i < ranks.length; i++) {
    if (rankStr) {
      rankStr += `||username=${ranks[i].username}&time=${ranks[i].time}`
    } else {
      rankStr = `username=${ranks[i].username}&time=${ranks[i].time}`
    }
  }
  let maxGrade = getMaxGrade();
  for (let i = 0; i < ranks.length; i++) {
    if (ranks[i].time < maxGrade.time) {
      maxGrade = ranks[i];
    }
  }
  let maxGradeStr = `username=${maxGrade.username}&time=${maxGrade.time}`;
  localStorage.setItem('maxGrade', maxGradeStr);
  localStorage.setItem('rank', rankStr);
}
//storeGrade
//params
//return 
//处理得到最终成绩并保存
let storeGrade = function() {
  let username = document.getElementsByClassName("username")[0].value;
  let user = {
    username: username,
    time: time
  }
  storeRank(user);
}

	const worker = new Worker('worker.js');

// 监听Web Worker的消息事件
worker.onmessage = function(event) {
  const sudu = event.data;
  console.log(sudu); // 处理生成的数独数据
};

// 向Web Worker发送消息
worker.postMessage('start');


