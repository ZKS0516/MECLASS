import sqlite3
import re


conn = sqlite3.connect("data/users.db")
cursor = conn.cursor()

# 檢查email格式
def is_valid_email(email):
    return re.match(r'^[\w\.-]+@gmail\.com$', email) # 允許英文大小寫與數字(\w) 點號(.) 減號(-)，至少一個字元(+)

# 檢查密碼格式
def is_valid_password(pw):
    errors = []
    if len(pw) < 8:
        errors.append("密碼必須超過8個字元")
    if not re.search(r'[A-Z]', pw) or not re.search(r'[a-z]', pw):
        errors.append("密碼必須包含英文大小寫")
    if not re.search(r'[\W_]', pw):
        errors.append("密碼必須包含特殊字元")
    if re.search(r'(012|123|234|345|456|567|678|789)', pw):
        errors.append("密碼不可為連號")
    return errors

# 註冊模式
def sign_up():
    name = input("請輸入姓名：").strip()
    while True:
        email = input("請輸入 Email：").strip()
        if not is_valid_email(email):
            print("Email 格式不符，重新輸入")
        else:
            break

    while True:
        pw = input("請輸入密碼：").strip()
        errors = is_valid_password(pw)
        if errors:
            print("密碼不符合規則：")
            for err in errors:
                print("ERROR：", err)
            print("請重新輸入")
        else:
            break

    print(f"save {name} | {email} | {pw} | Y / N ?")
    confirm = input().strip().upper()
    if confirm == 'Y':
        cursor.execute("SELECT * FROM user_data WHERE email = ?", (email,))
        if cursor.fetchone():
            print("此 Email 已存在，是否更新此 Email 資訊？")
            update = input("Y / N：").strip().upper()
            if update == 'Y':
                cursor.execute("UPDATE user_data SET name=?, password=? WHERE email=?", (name, pw, email))
                conn.commit()
                print("資料已更新")
            elif update == 'N':
                print("已取消註冊")
        else:
            cursor.execute("INSERT INTO user_data VALUES (?, ?, ?)", (name, email, pw))
            conn.commit()
            print("註冊成功")
    elif confirm == 'N':
        print("已取消註冊")

# 登入模式
def sign_in():
    name = input("請輸入姓名：").strip()
    email = input("請輸入 Email：").strip()
    cursor.execute("SELECT * FROM user_data WHERE email = ? AND name = ?", (email, name))
    result = cursor.fetchone()
    if not result:
        print("名字或 Email 錯誤")
        return

    while True:
        pw = input("請輸入密碼：").strip()
        if pw != result[2]:
            print("密碼錯誤，忘記密碼 Y / N ?")
            choice = input().strip().upper()
            if choice == 'Y':
                sign_up()
                return
            elif choice == 'N':
                continue
        else:
            print("登入成功")
            break

# 主流程入口
def main():
    while True:
        mode = input("(a) sign up / (b) sign in / (q) quit：").strip().lower()
        if mode == 'a':
            sign_up()
        elif mode == 'b':
            sign_in()
        elif mode == 'q':
            print("感謝你使用本系統")
            break
        else:
            print("請輸入 a 或 b 或 q")

main()
