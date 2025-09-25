document.write('<input type="text" id="inputBox"><br>')

for (let i = 0; i <= 9; i++) {
    document.write("<button style='width:50px; height:50px; font-size:20px;' onclick='textNumber(" + i + ")'>" + i + "</button>");

    if (i % 3 == 2){
        document.write("<br>")
    }
}

document.write("<button style='width:100px; height:50px; font-size:20px;' onclick='clearInput()'>clear</button><br>");

const symbols = Array("+", "-", "*", "/", "(", ")")
for (let i = 0; i < symbols.length; i++) {
    document.write("<button style='width:50px; height:50px; font-size:20px;' onclick='textSymbols(" + i + ")'>" + symbols[i] + "</button>");
}

document.write("<button style='width:100px; height:50px; font-size:20px;' onclick='count()'>=</button><br>");

function textNumber(num) {
    const input = document.getElementById("inputBox");
    input.value += num;
}

function clearInput() {
    document.getElementById("inputBox").value = "";
}

function textSymbols(num) {
    const input = document.getElementById("inputBox");
    input.value += symbols[num];
}

function count(){
    const input = document.getElementById("inputBox");    
    let result = new Function("return " + input.value)();
    alert(input.value + "=" + result);
    input.value = result;
}