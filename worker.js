self.onmessage = function(event) {
  if (event.data === 'start') {
    for (let k = 0; k < 9; k++) {
      let sudu = gennerateArr();
      init(sudu[0]);
      let filltime = 0;
      for (let i = 1; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          filltime = 0;
          while (filltime < 10) {
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
      self.postMessage(sudu); // 将每个生成的数独发送给主线程
    }
  }
};
