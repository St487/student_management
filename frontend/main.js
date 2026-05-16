function addStudentLocalStorage() {
    let matric = document.getElementById('matric').value;
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let semester = document.getElementById('semester').value;
    let dob = document.getElementById('dob').value;
    let program = document.getElementById('program').value;
    let genderElement = document.querySelector('input[name="gender"]:checked');
    let gender = genderElement ? genderElement.value : '';  
    let hobbies = Array.from(document.querySelectorAll('input[name="hobbies"]:checked')).map(el => el.value);

    if (!matric || !name || !email || !semester || !dob || !program || !gender || hobbies.length === 0) {
        alert('Please fill in all fields and select at least one hobby.');
        return;
    }

    if (!/^\d+$/.test(matric)) {
        alert('Matric number must contain numbers only');
        return;
    }

    if (semester < 1 || semester > 8) {
        alert('Semester must be between 1 and 8');
        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    const student = {
        matric: matric,
        name: name,
        email: email,
        semester: semester,
        dob: dob,
        program: program,
        gender: gender,
        hobbies: hobbies
    };

    localStorage.setItem('student', JSON.stringify(student));

    alert('Student information saved to local storage!');

    addStudent();

}

function addStudent() {
    let student_data = localStorage.getItem('student');
    let student = JSON.parse(student_data);
    
    fetch('http://localhost/student_management/add_student.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert(data.message);
            clearForm();
        } else {
            alert('Error adding student: ' + data.message);
        }
    })
    .catch(error => {
        alert('Error adding student: ' + error);
    });

}

function clearForm() {
    document.getElementById('matric').value = '';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('semester').value = '';
    document.getElementById('dob').value = '';
    document.getElementById('program').value = '';
    const genderElements = document.querySelectorAll('input[name="gender"]');
    genderElements.forEach(el => el.checked = false);
    const hobbyElements = document.querySelectorAll('input[name="hobbies"]');
    hobbyElements.forEach(el => el.checked = false);
}

function viewStudents() {
    fetch('http://localhost/student_management/get_student.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        let table = document.getElementById("studentTableBody");
        table.innerHTML = "";

        data.forEach(student => {
            addStudentToTable(student);
        });
    })
    .catch(error => {
        alert("Error fetching students: " + error);
    });

}

function addStudentToTable(student) {
    let table = document.getElementById("studentTableBody");

    let row = document.createElement("tr");

    let hobbies = student.hobbies;

    hobbies = hobbies.split(",");

    row.innerHTML = `
        <td>${student.matric_number}</td>
        <td>${student.full_name}</td>
        <td>${student.email}</td>
        <td>${student.semester}</td>
        <td>${student.date_of_birth}</td>
        <td>${student.gender}</td>
        <td>${student.program}</td>
        <td>${hobbies.join(", ")}</td>
        <td>
            <button id="delete" class="btn btn-sm btn-danger" onclick="deleteData(${student.id})" >Delete</button>
        </td>
    `;

    table.appendChild(row);
}

function deleteData(id){
    fetch('http://localhost/student_management/delete_student.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert(data.message);
            viewStudents();
        } else {
            alert('Error delete student: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching students:', error);
    });
}

function searchStudent(){
    let input = document.getElementById("search").value.toLowerCase();

    let table = document.querySelector("table");
    
    let rows = table.querySelectorAll("#studentTableBody tr");

    rows.forEach((row, index) => {
        let matric = row.cells[0].textContent.toLowerCase();
        let name = row.cells[1].textContent.toLowerCase();

        if (
            matric.includes(input) ||
            name.includes(input)
        ) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    })
}

function toggleSearchIcon(){
    let search = document.getElementById("search").value;

    let icon = document.getElementById("searchIcon");

    if (search.length > 0) {
        icon.className = "bi bi-x-lg";
    } else {
        icon.className = "bi bi-search";
    }
}

function clearSearch() {

    let input = document.getElementById("search");

    input.value = "";

    toggleSearchIcon();

    searchStudent();
}

window.onload = function () {
    viewStudents();
};