
let answer = Math.floor(Math.random() * 101); //隨機產生0-100(包刮0和100)的答案
let attempts = 0; //初始化嘗試次數=0
console.log(answer); //先在主控台印出答案，方便debug

const hint = document.getElementById("hint");
const time = document.getElementById("time");
const records = document.getElementById("records");

function checkGuess(){
    let timeStr = new Date().toLocaleTimeString()
    const input = document.getElementById("guess");
    const guess = Number(input.value);

    attempts++; //嘗試次數+1

    if (guess > 100 || guess < 0) {
        hint.innerHTML="hint：超出範圍，請重新輸入"; //訂個上下限，避免使用者亂來
      }

    else if (guess > answer && guess <= 100) {
        hint.innerHTML="hint：太大了，再猜猜看";
    } 
    
    else if (guess < answer && guess >= 0) {
        hint.innerHTML="hint：太小了，再猜猜看";
    } 
    
    else {
        alert("恭喜你猜對了，你總共猜了" + attempts + "次，花了" + times + "秒。");
        const li = document.createElement("li");
        li.textContent = "猜了" + attempts + "次，耗時" + times + "，" + timeStr;
        document.getElementById("records").appendChild(li);
        clearInterval(timer);
        timer = null;
        num = 0;
        answer = Math.floor(Math.random() * 100) + 1; //產生新的答案
        attempts = 0; //重置嘗試次數
        console.log(answer); //在主控台印出答案，方便debug
    }

    input.value = null;
}

let num = 0;
let times = 0;
function count() {
    num++;
    times = num / 100;
    time.innerHTML = "時間：" + times + "s";
}

let timer = null;
function startTimer() {
  if (timer !== null) return; // 避免重複啟動

  timer = setInterval(count, 10); // 每  秒執行一次
}


