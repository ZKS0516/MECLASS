document.addEventListener("DOMContentLoaded", () => { //「初始化事件監聽器」，當整個 HTML 文件載入完成後，就執行裡面的程式碼。

    const $ = (sel, root = document) => root.querySelector(sel); //抓第一個符合條件的元素
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel)); //抓所有符合條件的元素，並存成陣列
    //透這兩個函式直接抓取網頁元素，便於操作

    const moneyToNumber = (s) => parseInt(String(s).replace(/\$|,/g, ""), 10) || 0; //把金額字串轉成純數字，用正規表達式移除 $ 和 ,（千分位符號）。
    const numberToMoney = (n) => `$${(n || 0).toLocaleString()}`; //把數字轉成格式化金額字串，將數字格式化成當地語系的千分位格式

    //表頭順序：勾選 / 名稱 / 圖片 / 庫存 / 單價 / 數量 / 小計
    const getStockEl = (row) => row.querySelector("td:nth-child(4) h4, td:nth-child(4)");
    const getStock = (row) => parseInt(getStockEl(row)?.innerText || "0", 10) || 0;
    const setStock = (row, v) => { const el = getStockEl(row); if (el) el.innerText = v; };

    //將 qty 限制在 [1, stock]（一般情況）；若 allowZero=true 則允許 0（結帳後）
    function clampQtyByStock(qty, stock, allowZero = false) {
        let v = parseInt(qty, 10);
        if (Number.isNaN(v)) v = 1;            // 非數字 → 1
        if (!allowZero && v < 1) v = 1;        // <1 → 1
        if (allowZero && v < 0) v = 0;         // 允許 0 的場合
        if (v > stock) v = stock;              // 超過庫存 → 庫存
        return v;
    }

    //總價(僅計算已勾選)
    function updateTotal() {
        let total = 0;
        $$("#cart tbody tr, tbody tr").forEach(row => {
        const cb = $('input[type="checkbox"]', row);
        if (!cb?.checked) return;
        const subEl = $(".subtotal", row);
        if (subEl) total += moneyToNumber(subEl.textContent);
        });
        const totalEl = $("#total");
        if (totalEl) totalEl.innerHTML = `<h4>${numberToMoney(total)}</h4>`;
        return total;
    }

    // 全選功能
    const masterCheck = $("#check-all");
    const getItemCheckboxes = () => $$('#cart tbody input[type="checkbox"], tbody input[type="checkbox"]');

    function syncMasterFromItems() {
        if (!masterCheck) return;
        const items = getItemCheckboxes();
        const total = items.length;
        const checked = items.filter(cb => cb.checked).length;
        masterCheck.checked = (checked === total && total > 0);
        masterCheck.indeterminate = (checked > 0 && checked < total);
    }

    if (masterCheck) {
        masterCheck.addEventListener("change", () => {
        getItemCheckboxes().forEach(cb => cb.checked = masterCheck.checked);
        updateTotal();
        syncMasterFromItems();
        });
    }
});
