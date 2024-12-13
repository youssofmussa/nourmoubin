import { openModal, closeModal } from './modal.js';  // Import the modal functions
// Data Structure
let data = {
    classes: JSON.parse(localStorage.getItem("classes")) || [],
};

// Utility Functions
function saveData() {
    localStorage.setItem("classes", JSON.stringify(data.classes));
}

// DOM Elements
const classesContainer = document.getElementById("class-list");
const studentDetails = document.getElementById("student-details");
const recitationTable = document.querySelector("#recitations tbody");
const addClassButton = document.createElement("button");
addClassButton.textContent = "+ Add Class";
addClassButton.classList.add("add-btn");

function loadClasses() {
    classesContainer.innerHTML = "";
    data.classes.forEach((cls, index) => {
        const classCard = document.createElement("div");
        classCard.classList.add("card");
        classCard.innerHTML = `
            <div class="class-name">${cls.name}</div>
            <div class="card-buttons">
                <button class="edit-btn" onclick="editClass(${index})">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteClass(${index})">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        `;

        classCard.addEventListener("click", (e) => {
            if (e.target.tagName !== "BUTTON" && !e.target.closest(".card-buttons")) {
                loadStudents(index);
            }
        });
        classesContainer.appendChild(classCard);
    });

    classesContainer.appendChild(addClassButton);
}


// Add Class
addClassButton.addEventListener("click", () => {
    openModal(
        'Add Class',
        `<label for="new-class-name">Class Name:</label>
         <input id="new-class-name" type="text" class="modal-input" />`,
        () => {
            const className = document.getElementById("new-class-name").value.trim();
            if (className) {
                data.classes.push({ name: className, students: [] });
                saveData();
                loadClasses();
                showSnackbar("Class added successfully!");
            } else {
                showSnackbar("Class name cannot be empty!");
            }
        }
    );
});
window.addClassButton = addClassButton;

function editClass(classIndex) {
    const currentName = data.classes[classIndex].name;

    openModal(
        "Edit Class Name",
        `
        <div class="modal-inputs">
            <label for="edit-class-name">Class Name:</label>
            <input id="edit-class-name" type="text" value="${currentName}" class="modal-input" />
        </div>
        `,
        () => {
            const newName = document.getElementById("edit-class-name").value.trim();
            if (newName) {
                data.classes[classIndex].name = newName;
                saveData();
                loadClasses();
                showSnackbar("Class name updated successfully!", "success");
            } else {
                showSnackbar("Class name cannot be empty!", "error");
            }
        }
    );
}

function showSnackbar(message, type = "success") {
    const snackbar = document.createElement("div");
    snackbar.classList.add("snackbar", type);
    snackbar.textContent = message;

    document.body.appendChild(snackbar);

    setTimeout(() => {
        snackbar.classList.add("show");
    }, 100);

    setTimeout(() => {
        snackbar.classList.remove("show");
        setTimeout(() => snackbar.remove(), 300);
    }, 3000);
}

window.editClass = editClass;





// Delete Class
function deleteClass(classIndex) {
    openModal(
        'Confirm Deletion',
        'Are you sure you want to delete this class?',
        () => {
            data.classes.splice(classIndex, 1); // Remove the class from the array
            saveData(); // Save updated data to localStorage
            loadClasses(); // Reload classes to reflect the change
            showSnackbar("Class deleted successfully!");
        }
    );
}


function loadStudents(classIndex) {
    document.getElementById("classes").style.display = "none";
    document.getElementById("students").style.display = "block";
    studentsContainer.innerHTML = "";
    const addStudentButton = document.createElement("button");
    addStudentButton.textContent = "+ Add Student";
    addStudentButton.classList.add("add-btn");
    addStudentButton.addEventListener("click", () => addStudent(classIndex));
    data.classes[classIndex].students.forEach((student, studentIndex) => {
        const studentCard = document.createElement("div");
        studentCard.classList.add("card");
        studentCard.innerHTML = `
            <div class="student-name">${student.name} (${student.branch})</div>
            <div class="card-buttons">
                <button class="edit-btn" onclick="editStudent(${classIndex}, ${studentIndex})">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteStudent(${classIndex}, ${studentIndex})">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        `;

        studentCard.addEventListener("click", (e) => {
            if (e.target.tagName !== "BUTTON" && !e.target.closest(".card-buttons")) {
                showStudentDetails(classIndex, studentIndex);
            }
        });
        studentsContainer.appendChild(studentCard);
    });
    studentsContainer.appendChild(addStudentButton);
}


// Add Student
function addStudent(classIndex) {
    openModal(
        'Add Student',
        `<label for="new-student-name">Student Name:</label>
         <input id="new-student-name" type="text" class="modal-input" />
         <label for="new-student-branch">Branch (Friday/Saturday):</label>
         <input id="new-student-branch" type="text" class="modal-input" />`,
        () => {
            const studentName = document.getElementById("new-student-name").value.trim();
            const branch = document.getElementById("new-student-branch").value.trim();
            if (studentName && branch) {
                const newStudent = {
                    name: studentName,
                    branch: branch,
                    recitations: [],
                };
                data.classes[classIndex].students.push(newStudent);
                saveData();
                loadStudents(classIndex);
                showSnackbar("Student added successfully!");
            } else {
                showSnackbar("All fields are required!");
            }
        }
    );
}
window.addStudent = addStudent;

function editStudent(classIndex, studentIndex) {
    const student = data.classes[classIndex].students[studentIndex];
    const { name: currentName, branch: currentBranch } = student;

    openModal(
        'Edit Student Details',
        `<label for="edit-student-name">Student Name:</label>
         <input id="edit-student-name" type="text" value="${currentName}" class="modal-input" />
         <label for="edit-student-branch">Branch (Friday/Saturday):</label>
         <input id="edit-student-branch" type="text" value="${currentBranch}" class="modal-input" />`,
        () => {
            const newName = document.getElementById("edit-student-name").value.trim();
            const newBranch = document.getElementById("edit-student-branch").value.trim();

            if (newName && newBranch) {
                student.name = newName;
                student.branch = newBranch;
                saveData();
                loadStudents(classIndex);
                showSnackbar("Student details updated successfully!");
            } else {
                showSnackbar("All fields are required!");
            }
        }
    );
}

window.editStudent = editStudent;


// Delete Student
function deleteStudent(classIndex, studentIndex) {
    openModal(
        'Confirm Deletion',
        'Are you sure you want to delete this student?',
        () => {
            data.classes[classIndex].students.splice(studentIndex, 1); // Remove the student
            saveData(); // Save updated data to localStorage
            loadStudents(classIndex); // Reload students to reflect the change
            showSnackbar("Student deleted successfully!");
        }
    );
}


window.deleteStudent = deleteStudent;

// Show Student Details
function showStudentDetails(classIndex, studentIndex) {
    document.getElementById("students").style.display = "none";
    studentDetails.style.display = "block";
    const student = data.classes[classIndex].students[studentIndex];
    document.getElementById("student-name").textContent = `${student.name} (${student.branch})`;

    // Add a table header with the "Actions" column
    recitationTable.innerHTML = `
        <tr>
            <th>Date</th>
            <th>Surah</th>
            <th>From</th>
            <th>To</th>
            <th>Actions</th> <!-- New "Actions" column -->
        </tr>
    `;

    // Populate the table rows
    student.recitations.forEach((rec, recIndex) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${rec.date}</td>
            <td>${rec.surah}</td>
            <td>${rec.from}</td>
            <td>${rec.to}</td>
            <td>
                <div class="card-buttons">
                    <button class="edit-btn" onclick="editRecitation(${classIndex}, ${studentIndex}, ${recIndex})">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteRecitation(${classIndex}, ${studentIndex}, ${recIndex})">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        recitationTable.appendChild(row);
    });

    // Hook up "Add Recitation" button
    document.getElementById("add-recitation").onclick = () => addRecitation(classIndex, studentIndex);
}



// Updated Function to Open Modal on Add Recitation Click
function addRecitation(classIndex, studentIndex) {
    openModal(
        'Add Recitation',
        `
        <div class="modal-body">
            <label for="recitation-date">Date</label>
            <input id="recitation-date" type="date" class="modal-input" />
            <label for="recitation-surah">Surah Name</label>     <input id="recitation-surah" type="text" placeholder="Enter Surah Name" class="modal-input" />
            <label for="recitation-from">From Ayah</label>       <input id="recitation-from" type="text" placeholder="Enter Start Ayah" class="modal-input" />
                        <label for="recitation-to">To Ayah</label>            <input id="recitation-to" type="text" placeholder="Enter End Ayah" class="modal-input" />
        </div>
        `,
        () => {
            // Get modal inputs
            const newDate = document.getElementById("recitation-date").value;
            const newSurah = document.getElementById("recitation-surah").value;
            const newFrom = document.getElementById("recitation-from").value;
            const newTo = document.getElementById("recitation-to").value;

            // Validate inputs
            if (newDate && newSurah && newFrom && newTo) {
                const newRecitation = {
                    date: newDate,
                    surah: newSurah,
                    from: newFrom,
                    to: newTo,
                };

                // Add recitation to the student
                data.classes[classIndex].students[studentIndex].recitations.push(newRecitation);
                saveData(); // Save to localStorage
                showStudentDetails(classIndex, studentIndex); // Refresh UI
                showSnackbar("Recitation added successfully!");
            } else {
                showSnackbar("All fields are required!", "error");
            }
        }
    );
}

// Hook the "Add Recitation" button click



window.addRecitation = addRecitation;
// Edit Recitation
// Edit Recitation
function editRecitation(classIndex, studentIndex, recIndex) {
    const rec = data.classes[classIndex].students[studentIndex].recitations[recIndex];

    openModal(
        'Edit Recitation',
        `
        <div class="modal-body">
            <label for="recitation-date">Date:</label>
            <input id="recitation-date" type="date" value="${rec.date}" class="modal-input" />
            
            <label for="recitation-surah">Surah Name:</label>
            <input id="recitation-surah" type="text" value="${rec.surah}" class="modal-input" />
            
            <label for="recitation-from">From Ayah:</label>
            <input id="recitation-from" type="text" value="${rec.from}" class="modal-input" />
            
            <label for="recitation-to">To Ayah:</label>
            <input id="recitation-to" type="text" value="${rec.to}" class="modal-input" />
        </div>
        `,
        () => {
            // Get updated values from modal inputs
            const updatedDate = document.getElementById("recitation-date").value;
            const updatedSurah = document.getElementById("recitation-surah").value.trim();
            const updatedFrom = document.getElementById("recitation-from").value.trim();
            const updatedTo = document.getElementById("recitation-to").value.trim();

            // Validate inputs
            if (updatedDate && updatedSurah && updatedFrom && updatedTo) {
                // Update recitation object
                rec.date = updatedDate;
                rec.surah = updatedSurah;
                rec.from = updatedFrom;
                rec.to = updatedTo;

                saveData(); // Save changes to localStorage
                showStudentDetails(classIndex, studentIndex); // Refresh student details
                showSnackbar("Recitation updated successfully!");
            } else {
                showSnackbar("All fields are required!", "error");
            }
        }
    );
}

window.editRecitation = editRecitation;



// Delete Recitation
function deleteRecitation(classIndex, studentIndex, recIndex) {
    openModal(
        'Confirm Deletion',
        'Are you sure you want to delete this recitation?',
        () => {
            data.classes[classIndex].students[studentIndex].recitations.splice(recIndex, 1);
            saveData(); // Save updated data to localStorage
            showStudentDetails(classIndex, studentIndex); // Reload student details to reflect the change
            showSnackbar("Recitation deleted successfully!");
        }
    );
}
window.deleteRecitation = deleteRecitation;
window.deleteClass = deleteClass;

// Back Buttons
document.getElementById("back-to-classes").addEventListener("click", () => {
    document.getElementById("students").style.display = "none";
    document.getElementById("classes").style.display = "block";
});

document.getElementById("back-to-students").addEventListener("click", () => {
    studentDetails.style.display = "none";
    document.getElementById("students").style.display = "block";
});

// Initialize Application
loadClasses();
