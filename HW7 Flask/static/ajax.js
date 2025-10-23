document.getElementById('loginForm').addEventListener('submit', function (e) {  //幫表單加上「監聽器」，當使用者按下「登入」時，就會執行裡面的 function
    e.preventDefault();

    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    
    /* 使用 fetch() 發送 AJAX 請求到 /login 路由：
    - method: 'POST' 表示這是送資料
    - headers 告訴伺服器我們送的是 JSON 格式
    - body: JSON.stringify(data) 把 data 物件轉成 JSON 字串送出*/
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json()) //等伺服器回應後，把回傳的資料轉成 JSON 格式
    .then(result => {
        alert(result.message);
        if (result.success) {
            window.location.href = result.redirect;
        }
    });
});
