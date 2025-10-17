import sqlite3
import re

def is_valid_email(email):
    return re.match(r'^[\w\.-]+@gmail\.com$', email) # 允許英文大小寫與數字(\w) 點號(.) 減號(-)，至少一個字元(+)

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