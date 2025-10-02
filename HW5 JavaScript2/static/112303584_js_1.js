
let answer = Math.floor(Math.random() * 101); //隨機產生0-100(包刮0和100)的答案
let attempts = 0; //初始化嘗試次數=0
console.log(answer); //先在主控台印出答案，方便debug

const hint = document.getElementById("hint");

function checkGuess(){
    const guess = Number(document.getElementById("guess").value);
    //宣告常數guess(使用者的輸入不能被更改)，透過getElementById找id="guesss"，並把這個"物件"的value先Number再存入guess
    
    attempts++; //嘗試次數+1

    if (guess > 100 || guess < 0) {
        hint.innerHTML="hint:超出範圍，請重新輸入"; //訂個上下限，避免使用者亂來
      }

    else if (guess > answer && guess <= 100) {
        hint.innerHTML="hint:太大了，再猜猜看";
    } 
    
    else if (guess < answer && guess >= 0) {
        hint.innerHTML="hint:太小了，再猜猜看";
    } 
    
    else {
        alert("恭喜你猜對了，你總共猜了"+attempts+"次。");
        answer = Math.floor(Math.random() * 100) + 1; //產生新的答案
        attempts = 0; //重置嘗試次數
        console.log(answer); //在主控台印出答案，方便debug
    }
}