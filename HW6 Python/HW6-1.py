import sqlite3
import re


conn = sqlite3.connect('data/ID_data.db') # 連線物件，用它來提交變更、關閉連線等
cursor = conn.cursor() # 游標物件，執行 SQL 查詢、插入、刪除等操作

# 建立 twid_meta 表格（英文字母 → 數字代碼 + 縣市）.exetute 是sqlite3模組裡游標物件(cursor)的方法，它的功能是：執行一條 SQL 指令
cursor.execute("""
CREATE TABLE IF NOT EXISTS twid_meta (
    letter TEXT PRIMARY KEY,
    code INTEGER,
    city TEXT
)
""")

twid_data = {
    'A': (10, '臺北市'), 'B': (11, '臺中市'), 'C': (12, '基隆市'), 'D': (13, '臺南市'),
    'E': (14, '高雄市'), 'F': (15, '新北市'), 'G': (16, '宜蘭縣'), 'H': (17, '桃園市'),
    'I': (34, '嘉義市'), 'J': (18, '新竹縣'), 'K': (19, '苗栗縣'), 'L': (20, '臺中縣'),
    'M': (21, '南投縣'), 'N': (22, '彰化縣'), 'O': (35, '新竹市'), 'P': (23, '雲林縣'),
    'Q': (24, '嘉義縣'), 'R': (25, '臺南縣'), 'S': (26, '高雄縣'), 'T': (27, '屏東縣'),
    'U': (28, '花蓮縣'), 'V': (29, '臺東縣'), 'W': (32, '金門縣'), 'X': (30, '澎湖縣'),
    'Y': (31, '陽明山'), 'Z': (33, '連江縣')
}

cursor.executemany("""
INSERT OR IGNORE INTO twid_meta (letter, code, city) VALUES (?, ?, ?)
""", [(k, v[0], v[1]) for k, v in twid_data.items()])
conn.commit()

# 🧪 格式檢查：只接受 9 碼格式（尚未補齊驗證碼）
def is_format_valid(twid):
    return bool(re.match(r'^[A-Z][0-9]{8}$', twid)) and twid[1] in ('1', '2', '8', '9')

# 🧮 補上第10碼（驗證碼）
def calculate_check_digit(twid9):
    cursor.execute("SELECT code FROM twid_meta WHERE letter = ?", (twid9[0].upper(),))
    result = cursor.fetchone()
    if not result:
        return None
    code = result[0]
    digits = [code // 10, code % 10] + [int(x) for x in twid9[1:]]
    weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    total = sum(d * w for d, w in zip(digits, weights))
    for check_digit in range(10):
        if (total + check_digit) % 10 == 0:
            return twid9 + str(check_digit)
    return None

# ✅ 真偽判斷（完整10碼）
def is_valid_twid(twid):
    if len(twid) != 10 or not twid[0].isalpha() or not twid[1:].isdigit():
        return False

    # 查代碼
    cursor.execute("SELECT code FROM twid_meta WHERE letter = ?", (twid[0].upper(),))
    result = cursor.fetchone()
    if not result:
        return False
    code = result[0]
    print(code)

    # 拆成兩位數字
    digits = [code // 10, code % 10] + [int(x) for x in twid[1:]]

    # 權重
    weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]

    # 加總
    total = sum(d * w for d, w in zip(digits, weights))
    return total % 10 == 0


# 🧠 含意解析：性別、縣市、國籍
def extract_gender(code):
    return {
        '1': '男性',
        '2': '女性',
        '8': '男性',
        '9': '女性'
    }.get(code)

def extract_citizenship(code):
    return {
        '0': '在臺灣出生之本籍國民',
        '1': '在臺灣出生之本籍國民',
        '2': '在臺灣出生之本籍國民',
        '3': '在臺灣出生之本籍國民',
        '4': '在臺灣出生之本籍國民',
        '5': '在臺灣出生之本籍國民',
        '6': '入籍國民，原為外國人',
        '7': '入籍國民，原為無戶籍國民',
        '8': '入籍國民，原為港澳居民',
        '9': '入籍國民，原為大陸地區人民'
    }.get(code)

def extract_country(letter):
    cursor.execute("SELECT city FROM twid_meta WHERE letter = ?", (letter.upper(),))
    result = cursor.fetchone()
    return result[0] if result else None

# 🧹 清理、補齊、解析並更新資料表
cursor.execute("SELECT ID FROM ID_table")
raw_ids = [row[0] for row in cursor.fetchall()]

# 只處理 9 碼資料
raw_9 = [twid for twid in raw_ids if len(twid) == 9]
invalid_ids = [twid for twid in raw_9 if not is_format_valid(twid)]
valid_ids = [twid for twid in raw_9 if is_format_valid(twid)]

# 刪除格式錯誤資料
if invalid_ids:
    print("❌ 格式錯誤的身分證字號：")
    for bad in invalid_ids:
        print("  -", bad)
    cursor.executemany("DELETE FROM ID_table WHERE ID = ?", [(bad,) for bad in invalid_ids])
    conn.commit()
    print(f"🧹 已刪除 {len(invalid_ids)} 筆格式錯誤資料")

# 補齊驗證碼並更新 ID 欄位
fixed = []
for raw in valid_ids:
    full = calculate_check_digit(raw)
    if full:
        fixed.append((full, raw))

for full_id, raw_id in fixed:
    cursor.execute("UPDATE ID_table SET ID = ? WHERE ID = ?", (full_id, raw_id))
conn.commit()
print(f"✅ 已補齊並更新 {len(fixed)} 筆身分證字號")

# 解析含意並更新 gender、country、citizenship 欄位
cursor.execute("SELECT ID FROM ID_table")
twids = [row[0] for row in cursor.fetchall()]
updated = 0

for twid in twids:
    gender = extract_gender(twid[1])
    citizenship = extract_citizenship(twid[2])
    country = extract_country(twid[0])
    if gender and citizenship and country:
        cursor.execute("""
            UPDATE ID_table
            SET gender = ?, citizenship = ?, country = ?
            WHERE ID = ?
        """, (gender, citizenship, country, twid))
        updated += 1

conn.commit()
print(f"✅ 已解析並更新 {updated} 筆身份欄位")

# 🔍 查詢互動功能
while True:
    user_input = input("請輸入身分證字號（輸入 q 離開）：").strip().upper()
    if not user_input:
        print("⚠️ 請勿輸入空白，請重新輸入")
        continue
    if user_input.lower() == 'q':
        print("👋 離開查詢模式")
        break
    elif len(user_input) != 10:
        print("❌ 請輸入完整 10 碼身分證字號")
        continue
    elif not is_valid_twid(user_input):
        print("❌ 非法身分證字號：格式錯誤或驗證碼不正確")
        continue
    else:
        gender = extract_gender(user_input[1])
        citizenship = extract_citizenship(user_input[2])
        country = extract_country(user_input[0])
        print("✅ 合法身分證字號")
        print(f"{user_input} → {country}、{gender}、{citizenship}")

twid = "F130410529"
print("格式正確：" , re.match(r'^[A-Z][0-9]{9}$', twid) is not None)
print("驗證通過：" , is_valid_twid(twid))


