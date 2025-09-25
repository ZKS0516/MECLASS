document.write('<input type="text" id="inputBox"><br>')

for (let i = 0; i <= 9; i++) {
    document.write("<button style='width:50px; height:50px; font-size:20px;' onclick='textNumber(" + i + ")'>" + i + "</button>");

    if (i % 3 == 2){
        document.write("<br>")
    }
}



function textNumber(num) {
    const input = document.getElementById("inputBox");
    input.value += num;
}