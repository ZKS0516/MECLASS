document.addEventListener("DOMContentLoaded", () => { //「初始化事件監聽器」，當整個 HTML 文件載入完成後，就執行裡面的程式碼。

  const $ = (sel, root = document) => root.querySelector(sel); //抓第一個符合條件的元素
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel)); //抓所有符合條件的元素，並存成陣列
  //透這兩個函式直接抓取網頁元素，便於操作

  const moneyToNumber = (s) => parseInt(String(s).replace(/\$|,/g, ""), 10) || 0; //把金額字串轉成純數字，用正規表達式移除 $ 和 ,（千分位符號）。
  const numberToMoney = (n) => `$${(n || 0).toLocaleString()}`; //把數字轉成格式化金額字串，將數字格式化成當地語系的千分位格式

  // 你的表頭順序：勾選 / 名稱 / 圖片 / 庫存 / 單價 / 數量 / 小計
  const getStockEl = (row) => row.querySelector("td:nth-child(4) h4, td:nth-child(4)");
  const getStock = (row) => parseInt(getStockEl(row)?.innerText || "0", 10) || 0;
  const setStock = (row, v) => { const el = getStockEl(row); if (el) el.innerText = v; };
});
