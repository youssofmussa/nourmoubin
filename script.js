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
addClassButton.textContent = "+ إضافة فصل";
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
        'إضافة فصل',
        `<label for="new-class-name">اسم الفصل:</label>
         <input id="new-class-name" type="text" class="modal-input" />`,
        () => {
            const className = document.getElementById("new-class-name").value.trim();
            if (className) {
                data.classes.push({ name: className, students: [] });
                saveData();
                loadClasses();
                showSnackbar("تم إضافة الفصل بنجاح!");
            } else {
                showSnackbar("اسم الفصل لا يمكن أن يكون فارغًا!");
            }
        }
    );
});
window.addClassButton = addClassButton;

function editClass(classIndex) {
    const currentName = data.classes[classIndex].name;

    openModal(
        "تعديل اسم الفصل",
        `
        <div class="modal-inputs">
            <label for="edit-class-name">اسم الفصل:</label>
            <input id="edit-class-name" type="text" value="${currentName}" class="modal-input" />
        </div>
        `,
        () => {
            const newName = document.getElementById("edit-class-name").value.trim();
            if (newName) {
                data.classes[classIndex].name = newName;
                saveData();
                loadClasses();
                showSnackbar("تم تحديث اسم الفصل بنجاح!", "success");
            } else {
                showSnackbar("اسم الفصل لا يمكن أن يكون فارغًا!", "error");
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
        'تأكيد الحذف',
        'هل أنت متأكد أنك تريد حذف هذا الفصل؟',
        () => {
            data.classes.splice(classIndex, 1); // Remove the class from the array
            saveData(); // Save updated data to localStorage
            loadClasses(); // Reload classes to reflect the change
            showSnackbar("تم حذف الفصل بنجاح!");
        }
    );
}


function loadStudents(classIndex) {
    document.getElementById("classes").style.display = "none";
    document.getElementById("students").style.display = "block";
    studentsContainer.innerHTML = "";
    const addStudentButton = document.createElement("button");
    addStudentButton.textContent = "+ إضافة طالب";
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
        'إضافة طالب',
        `<label for="new-student-name">اسم الطالب:</label>
         <input id="new-student-name" type="text" class="modal-input" />
         <label for="new-student-branch">الفرع (الجمعة/السبت):</label>
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
                showSnackbar("تم إضافة الطالب بنجاح!");
            } else {
                showSnackbar("جميع الحقول مطلوبة!");
            }
        }
    );
}
window.addStudent = addStudent;

function editStudent(classIndex, studentIndex) {
    const student = data.classes[classIndex].students[studentIndex];
    const { name: currentName, branch: currentBranch } = student;

    openModal(
        'تعديل بيانات الطالب',
        `<label for="edit-student-name">اسم الطالب:</label>
         <input id="edit-student-name" type="text" value="${currentName}" class="modal-input" />
         <label for="edit-student-branch">الفرع (الجمعة/السبت):</label>
         <input id="edit-student-branch" type="text" value="${currentBranch}" class="modal-input" />`,
        () => {
            const newName = document.getElementById("edit-student-name").value.trim();
            const newBranch = document.getElementById("edit-student-branch").value.trim();

            if (newName && newBranch) {
                student.name = newName;
                student.branch = newBranch;
                saveData();
                loadStudents(classIndex);
                showSnackbar("تم تحديث بيانات الطالب بنجاح!");
            } else {
                showSnackbar("جميع الحقول مطلوبة!");
            }
        }
    );
}

window.editStudent = editStudent;


// Delete Student
function deleteStudent(classIndex, studentIndex) {
    openModal(
        'تأكيد الحذف',
        'هل أنت متأكد أنك تريد حذف هذا الطالب؟',
        () => {
            data.classes[classIndex].students.splice(studentIndex, 1); // Remove the student
            saveData(); // Save updated data to localStorage
            loadStudents(classIndex); // Reload students to reflect the change
            showSnackbar("تم حذف الطالب بنجاح!");
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
            <th>التاريخ</th>
            <th>السورة</th>
            <th>من</th>
            <th>إلى</th>
            <th>الإجراءات</th> <!-- New "Actions" column -->
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
        'إضافة تلاوة',
        `<label for="recitation-date">التاريخ:</label>
         <input id="recitation-date" type="date" class="modal-input" />
         <label for="recitation-surah">السورة:</label>
         <input id="recitation-surah" type="text" class="modal-input" />
         <label for="recitation-from">من:</label>
         <input id="recitation-from" type="text" class="modal-input" />
         <label for="recitation-to">إلى:</label>
         <input id="recitation-to" type="text" class="modal-input" />`,
        () => {
            const date = document.getElementById("recitation-date").value;
            const surah = document.getElementById("recitation-surah").value.trim();
            const from = document.getElementById("recitation-from").value.trim();
            const to = document.getElementById("recitation-to").value.trim();

            if (date && surah && from && to) {
                const recitation = { date, surah, from, to };
                data.classes[classIndex].students[studentIndex].recitations.push(recitation);
                saveData();
                showStudentDetails(classIndex, studentIndex);
                showSnackbar("تم إضافة التلاوة بنجاح!");
            } else {
                showSnackbar("جميع الحقول مطلوبة!");
            }
        }
    );
}

// Hook the "Add Recitation" button click



window.addRecitation = addRecitation;
// Edit Recitation
function editRecitation(classIndex, studentIndex, recIndex) {
    const rec = data.classes[classIndex].students[studentIndex].recitations[recIndex];
    openModal(
        'تعديل التلاوة',
        `
        <label for="edit-recitation-date">التاريخ:</label>
        <input id="edit-recitation-date" type="date" value="${rec.date}" class="modal-input" />
        <label for="edit-recitation-surah">السورة:</label>
        <input id="edit-recitation-surah" type="text" value="${rec.surah}" class="modal-input" />
        <label for="edit-recitation-from">من:</label>
        <input id="edit-recitation-from" type="text" value="${rec.from}" class="modal-input" />
        <label for="edit-recitation-to">إلى:</label>
        <input id="edit-recitation-to" type="text" value="${rec.to}" class="modal-input" />
        `,
        () => {
            const date = document.getElementById("edit-recitation-date").value;
            const surah = document.getElementById("edit-recitation-surah").value.trim();
            const from = document.getElementById("edit-recitation-from").value.trim();
            const to = document.getElementById("edit-recitation-to").value.trim();

            if (date && surah && from && to) {
                rec.date = date;
                rec.surah = surah;
                rec.from = from;
                rec.to = to;
                saveData();
                showStudentDetails(classIndex, studentIndex);
                showSnackbar("تم تحديث التلاوة بنجاح!");
            } else {
                showSnackbar("جميع الحقول مطلوبة!");
            }
        }
    );
}

window.editRecitation = editRecitation;



// Delete Recitation
function deleteRecitation(classIndex, studentIndex, recIndex) {
    openModal(
        'تأكيد الحذف',
        'هل أنت متأكد أنك تريد حذف هذه التلاوة؟',
        () => {
            data.classes[classIndex].students[studentIndex].recitations.splice(recIndex, 1);
            saveData();
            showStudentDetails(classIndex, studentIndex);
            showSnackbar("تم حذف التلاوة بنجاح!");
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
