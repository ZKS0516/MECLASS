document.write('<input type="text" id="inputBox" readonly><br>') //把程式碼寫進html，叫他生出一個輸入框，並且無法手動編輯(readonly)

for (let i = 0; i <= 9; i++) {
    document.write("<button style='width:50px; height:50px; font-size:20px;' onclick='textNumber(" + i + ")'>" + i + "</button>");
    //用for迴圈印出0-9的按鈕，按下後呼叫函數textNumber
    if (i % 3 == 2){
        document.write("<br>") //每印出三個換行
    }
}

document.write("<button style='width:100px; height:50px; font-size:20px;' onclick='clearInput()'>clear</button><br>");
//印出clear按鈕，按下後呼叫函數cleanInput

const symbols = Array("+", "-", "*", "/", "(", ")") //把運算符號存進陣列裡，方便列印
for (let i = 0; i < symbols.length; i++) {
    document.write("<button style='width:50px; height:50px; font-size:20px;' onclick='textSymbol(" + i + ")'>" + symbols[i] + "</button>");
    //用for迴圈印出運算符號按鈕，按下後呼叫函數textSymbol
}

document.write("<button style='width:100px; height:50px; font-size:20px;' onclick='calculate()'>=</button><br>");
//印出=按鈕，按下後呼叫函數count

function textNumber(num) {
    const input = document.getElementById("inputBox");
    //宣告物件input(用const避免被重新定義)，透過getElementById找id="inputBox"，並把物件存入input

    input.value += num; //把數字新增到物件input的value裡
}

function clearInput() {
    const input = document.getElementById("inputBox");
    //宣告物件input(用const避免被重新定義)，透過getElementById找id="inputBox"，並把物件存入input
    
    input.value = ""; //透過getElementById找id="inputBox"，並把該物件的value清空
}

function textSymbol(num) {
    const input = document.getElementById("inputBox");
    //宣告物件input(用const避免被重新定義)，透過getElementById找id="inputBox"，並把物件存入input
    
    input.value += symbols[num]; //把運算符號新增到物件input的value裡
}

function calculate(){
    const input = document.getElementById("inputBox");  
    //宣告物件input(用const避免被重新定義)，透過getElementById找id="inputBox"，並把物件存入input
    
    try {
        let result = new Function("return " + input.value)();
        /*我問GPT怎麼把字串變成算式，他教我用new Function，因為new Function的()裡本來就是放字串，
        所以他會把input.value裡的字串轉成算式並return計算結果存入result*/

        alert(input.value + "=" + result);
        input.value = result; //把輸入框裡的value(算式)改成result(計算結果)

        //原本沒有這塊，後來測試時打了2個+發現掛了，才新增了try catch
    } catch (error) {
        alert("算式有誤，請重新輸入！");
        //當算式有問題時，new Function會丟出error，抓到error後警告算式有誤
    }
}

/*new Function和document.write很像，兩者的()內都是字串，都會把字串轉乘其他形式
document.write是把字串內容寫進html，寫什麼就做什麼事，是程式碼就運行，是文字就直接顯示
new Function是新增一個function並把字串內容寫進去，例如

const sum = new Function("a", "b", "return a + b;"); 就等同於

function sum(a, b) {
    return a + b;
}
又學到新東西了*/