from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('userlogin.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'No login data received'})

    username = data.get('username')
    password = data.get('password')

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM teachers WHERE username = ?", (username,))
    row = cursor.fetchone()
    conn.close()

    if row and row[0] == password:
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'redirect': '/dashboard/teacher'
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Invalid username or password'
        })

@app.route('/dashboard/teacher')
def teacher_dashboard():
    teacher_name = request.args.get('username', 'teacher')
    return render_template('gradeinput.html', teacher_name=teacher_name)

if __name__ == '__main__':
    app.run(debug=True)