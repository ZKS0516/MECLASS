from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('userlogin.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({'success': False, 'message': 'Please enter both username and password'})

    with sqlite3.connect('users.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT password FROM teachers WHERE username = ?", (username,))
        row = cursor.fetchone()

    if not row:
        return jsonify({'success': False, 'message': 'Account not found'})  # 帳號錯誤

    if row[0] != password:
        return jsonify({'success': False, 'message': 'Incorrect password'})  # 密碼錯誤

    return jsonify({
        'success': True,
        'message': 'Login successful',
        'redirect': f'/dashboard/teacher?username={username}'
    })


@app.route('/dashboard/teacher')
def teacher_dashboard():
    teacher_name = request.args.get('username', 'teacher')
    with sqlite3.connect('users.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name, student_id, score FROM grades ORDER BY CAST(student_id AS INTEGER) ASC")
        grades = [{'name': row[0], 'student_id': row[1], 'score': row[2]} for row in cursor.fetchall()]
    return render_template('gradeinput.html', teacher_name=teacher_name, grades=grades)

@app.route('/submit_grade', methods=['POST'])
def submit_grade():
    data = request.get_json()
    name = data.get('name', '').strip()
    student_id = data.get('student_id', '').strip()
    score = data.get('score')
    force_update = data.get('force_update', False)

    if not name or not student_id or score is None:
        return jsonify({'success': False, 'message': 'Please fill in all fields'})

    if not student_id.isdigit():
        return jsonify({'success': False, 'message': 'Student ID must be numeric'})

    if not isinstance(score, int) or score < 0 or score > 100:
        return jsonify({'success': False, 'message': 'Score must be between 0 and 100'})

    try:
        with sqlite3.connect('users.db') as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM grades WHERE student_id = ?", (student_id,))
            existing = cursor.fetchone()

            if existing and not force_update:
                return jsonify({
                    'success': False,
                    'duplicate': True,
                    'message': 'Duplicate ID detected. Do you want to update the name and score?'
                })

            if existing and force_update:
                cursor.execute("UPDATE grades SET name = ?, score = ? WHERE student_id = ?", (name, score, student_id))
            else:
                cursor.execute("INSERT INTO grades (name, student_id, score) VALUES (?, ?, ?)", (name, student_id, score))

            conn.commit()
        return jsonify({'success': True, 'message': 'Grade saved successfully'})
    except sqlite3.OperationalError as e:
        return jsonify({'success': False, 'message': f'Database error: {str(e)}'})

@app.route('/delete_grade', methods=['POST'])
def delete_grade():
    data = request.get_json()
    student_id = data.get('student_id', '').strip()

    if not student_id.isdigit():
        return jsonify({'success': False, 'message': 'Student ID must be numeric'})

    try:
        with sqlite3.connect('users.db') as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM grades WHERE student_id = ?", (student_id,))
            existing = cursor.fetchone()

            if not existing:
                return jsonify({'success': False, 'message': 'Student ID not found. No data deleted.'})

            cursor.execute("DELETE FROM grades WHERE student_id = ?", (student_id,))
            conn.commit()

        return jsonify({'success': True, 'message': 'Grade deleted successfully'})
    except sqlite3.OperationalError as e:
        return jsonify({'success': False, 'message': f'Database error: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True)