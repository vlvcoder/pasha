import { students } from "./data.js";

// (1)
// Вывести в консоль список студентов students

// (2)
// Создать функцию showStudent(student), выводящую всю информацию о студенте в одну строку

// (3)
// Вывести в консоль список students, использую showStudent(student)

// (4)
// Написать функцию searchBySurname(list) поиска студента по фамилии

// const tableStudents = document.getElementById('tableStudents');
const tbody = tableStudents.querySelector('#tableStudents>tbody');
const sortMarkers = tableStudents.querySelectorAll('.sort-marker');

const showStudents = () => {
    tbody.innerHTML = '';
    students.forEach((student, ind) => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <th>${ind + 1}</th>
            <td>${student.surname} ${student.name}</td>
            <td>${student.age}</td>
            <td>${student.faculty}</td>
            <td>${student.course}</td>
            <td class="${student.score >= 4 ? 'text-success' : 'text-warning'}">${student.score}</td>
            <td>
                <a href="#" class="btn-edit text-primary" title="Редактировать">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg></a>
                <span>&nbsp;</span>
                <a href="#" class="btn-remove text-danger" title="Удалить"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg></a>
            </td>
        `;
        newRow.querySelector('.btn-remove').addEventListener('click', () => showDeleteModal(ind));
        newRow.querySelector('.btn-edit').addEventListener('click', () => showEditModal(ind));
        tbody.appendChild(newRow);
    });
};

let sortField = null;

const showSortMarkers = () => {
    sortMarkers.forEach(marker => {
        marker.classList.add('hidden');
    });

    if (sortField) {
        const sortMarker = tableStudents.querySelector(`.sort-marker-${sortField}`);
        if (sortMarker) {
            sortMarker.classList.remove('hidden');
        }
    }
};

const sortLinks = document.querySelectorAll('.sortLink');

sortLinks.forEach(a => {
    a.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        sortField = a.dataset.field;
        refresh();
    });
});

const refresh = () => {
    if (sortField) {
        students.sort((a, b) => {
            if (typeof a[sortField] === 'string') {
                return a[sortField].localeCompare(b[sortField]);
            }
            return a[sortField] - b[sortField];
        });
    }
    showSortMarkers();
    showStudents();
};

document.getElementById('btnNew').addEventListener('click', () => showEditModal(-1));

// Функция для отображения модального окна создания / редактирования
// Создание: index = -1; Редактирование: index >= 0
const showEditModal = (index) => {
    event.preventDefault();

    const student = index >= 0 ? students[index] : { surname: '', name: '' };

    if (!student) {
        console.error('Студент не найден');
        return;
    }

    // Заголовок диалога
    document.getElementById('editStudentModalLabel').textContent = index >= 0 ? 'Редактирование студента' : 'Добавление студента';

    // Заполняем поля формы данными студента
    document.getElementById('editSurname').value = student.surname;
    document.getElementById('editName').value = student.name;
    document.getElementById('editAge').value = student.age;
    document.getElementById('editFaculty').value = student.faculty;
    document.getElementById('editCourse').value = student.course;
    document.getElementById('editScore').value = student.score;

    // Сохраняем индекс редактируемого студента
    const saveBtn = document.getElementById('saveStudentBtn');
    saveBtn.dataset.index = index;

    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('editStudentModal'));

    // Устанавливаем фокус после того, как модальное окно полностью откроется
    const modalElement = document.getElementById('editStudentModal');
    modalElement.addEventListener('shown.bs.modal', function onShown() {
        document.getElementById('editSurname').focus();
        // Удаляем обработчик, чтобы не срабатывал повторно
        modalElement.removeEventListener('shown.bs.modal', onShown);
    });

    modal.show();
};

// Обработчик сохранения изменений
document.getElementById('saveStudentBtn').addEventListener('click', function () {
    const index = parseInt(this.dataset.index);

    if (isNaN(index)) {
        alert('Ошибка: не выбран студент для редактирования');
        return;
    }

    // Получаем данные из формы
    const updatedStudent = {
        surname: document.getElementById('editSurname').value.trim(),
        name: document.getElementById('editName').value.trim(),
        age: parseInt(document.getElementById('editAge').value),
        faculty: document.getElementById('editFaculty').value,
        course: parseInt(document.getElementById('editCourse').value),
        score: parseFloat(document.getElementById('editScore').value)
    };

    // Валидация данных
    if (!updatedStudent.surname || !updatedStudent.name || !updatedStudent.faculty) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }

    if (updatedStudent.age < 16 || updatedStudent.age > 30) {
        alert('Возраст должен быть от 16 до 30 лет');
        return;
    }

    if (updatedStudent.course < 1 || updatedStudent.course > 6) {
        alert('Курс должен быть от 1 до 6');
        return;
    }

    if (updatedStudent.score < 0 || updatedStudent.score > 5) {
        alert('Средний балл должен быть от 0 до 5');
        return;
    }

    // Обновляем данные студента
    if (index >= 0) {
        students[index] = updatedStudent;
    } else {
        students.push(updatedStudent);
    }

    // Закрываем модальное окно
    const modal = bootstrap.Modal.getInstance(document.getElementById('editStudentModal'));
    modal.hide();

    // Обновляем таблицу
    refresh();
});

let deleteIndex = -1;

// Функция открытия диалога удаления
export function showDeleteModal(index) {
    event.preventDefault();
    const student = students[index];
    if (!student) {
        console.error('Студент не найден');
        return;
    }

    // Сохраняем индекс
    deleteIndex = index;

    // Заполняем информацию о студенте
    document.getElementById('deleteStudentInfo').innerHTML = `
        <strong>${student.surname} ${student.name}</strong>
    `;
    document.getElementById('deleteStudentGroup').textContent =
        `${student.faculty}, ${student.course} курс`;

    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('deleteStudentModal'));
    modal.show();
}

// Обработчик подтверждения удаления
document.getElementById('confirmDeleteBtn').addEventListener('click', (event) => {
    event.preventDefault();
    students.splice(deleteIndex, 1);

    // Закрываем модальное окно
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteStudentModal'));
    modal.hide();
    
    refresh();
});

refresh();
