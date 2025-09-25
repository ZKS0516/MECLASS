
let answer = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
console.log(answer);

function checkGuess(){
    const guess = Number(document.getElementById("guess").value);
    attempts++;
    if (guess > 100 || guess < 0) {
        alert("超出範圍，請重新輸入");
        return;
      }

    else if (guess > answer && guess <= 100) {
        alert("太大了，再猜猜看");
        return;
    } 
    
    else if (guess < answer && guess >= 0) {
        alert("太小了，再猜猜看");
        return;
    } 
    
    else {
        alert("恭喜你猜對了，你總共猜了"+attempts+"次。");
        answer = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        console.log(answer);
    }
}