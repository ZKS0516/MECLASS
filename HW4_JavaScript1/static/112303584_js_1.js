
let answer = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

function checkGuess(){
    const guess = Number(document.getElementById("guess").value);
    attempts++;
    if (guess === answer) {
        alert("恭喜你猜對了，你總共猜了"+attempts+"次。");
        return;
      }

    if (guess > answer && guess <= 100) {
        alert("太大了，再猜猜看");
    } 
    
    else if (guess < answer && guess >= 0) {
        alert("太小了，再猜猜看");
    } 

    else {
        alert("輸入錯誤，請重新輸入");
    }
}