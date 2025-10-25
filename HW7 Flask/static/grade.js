document.addEventListener('DOMContentLoaded', () => {
    const gradeForm = document.getElementById('gradeForm');
    const deleteForm = document.getElementById('deleteForm');

    gradeForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const student_id = document.getElementById('student_id').value.trim();
        const score = parseInt(document.getElementById('score').value);

        if (!/^\d+$/.test(student_id)) {
            alert("Student ID must be numeric.");
            return;
        }

        if (isNaN(score) || score < 0 || score > 100) {
            alert("Score must be between 0 and 100.");
            return;
        }

        const payload = { name, student_id, score };

        const res = await fetch('/submit_grade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (result.duplicate) {
            if (confirm(result.message)) {
                payload.force_update = true;
                const updateRes = await fetch('/submit_grade', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const updateResult = await updateRes.json();
                alert(updateResult.message);
                if (updateResult.success) location.reload();
            }
        } else {
            alert(result.message);
            if (result.success) location.reload();
        }
    });

    deleteForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const student_id = document.getElementById('delete_id').value.trim();

        if (!/^\d+$/.test(student_id)) {
            alert("Student ID must be numeric.");
            return;
        }

        const res = await fetch('/delete_grade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id })
        });

        const result = await res.json();
        alert(result.message);
        if (result.success) location.reload();
    });
});