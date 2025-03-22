export const todoForm = document.querySelector("#todo-main__todo-create-form");
export const todoInput = document.querySelector(
  ".todo-main__input--create-todo"
);
export const todoEmpty = document.querySelector(".todo-main__progress-empty");
export const doneEmpty = document.querySelector(".todo-main__done-empty");

export const btnEditTodo = document.querySelector(".todo-main__btn--edit");
export const btnDeleteTodo = document.querySelector(".todo-main__btn--delete");

export const todoList = document.querySelector(".todo-main__list--progress");
export const doneList = document.querySelector(".todo-main__list--done");

// 로컬 스토리지에서 할 일 불러오기
export function loadTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || {
    todo: [],
    done: [],
  };
  todos.todo.forEach((todoText) => addTodoToList(todoText, false));
  todos.done.forEach((todoText) => addTodoToList(todoText, true));

  updateEmptyMessage(todoList, todoEmpty);
  updateEmptyMessage(doneList, doneEmpty);
}

// 할 일 추가
export function addTodoToList(todoText, isDone) {
  const li = document.createElement("li");
  li.classList.add("todo-main__list-item");

  const divDetail = document.createElement("div");
  divDetail.classList.add("todo-main__list-item-detail");
  li.appendChild(divDetail);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("todo-main__checkbox-progress");
  checkbox.checked = isDone;
  divDetail.appendChild(checkbox);

  const todoDetail = document.createElement("p");
  todoDetail.classList.add("todo-main__list-text");
  todoDetail.textContent = todoText;
  divDetail.appendChild(todoDetail);

  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("todo-main__buttons");
  li.appendChild(buttonGroup);

  const btnEditTodo = document.createElement("button");
  btnEditTodo.type = "button";
  btnEditTodo.classList.add("todo-main__btn", "todo-main__btn--edit");
  btnEditTodo.textContent = "수정";
  buttonGroup.appendChild(btnEditTodo);

  const btnDeleteTodo = document.createElement("button");
  btnDeleteTodo.type = "button";
  btnDeleteTodo.classList.add("todo-main__btn--delete");
  btnDeleteTodo.textContent = "삭제";
  buttonGroup.appendChild(btnDeleteTodo);

  if (isDone) {
    doneList.appendChild(li);
  } else {
    todoList.appendChild(li);
  }

  btnDeleteTodo.addEventListener("click", () => {
    li.remove();
    saveTodos();
  });

  checkbox.addEventListener("click", handleCheckboxClick);
}

// 할 일 저장
export function saveTodos() {
  const todos = {
    todo: [],
    done: [],
  };

  document.querySelectorAll(".todo-main__list-item").forEach((li) => {
    const todoItemText = li.querySelector(".todo-main__list-text");

    if (todoItemText) {
      const text = todoItemText.textContent;
      const checkbox = li.querySelector(".todo-main__checkbox-progress");

      if (checkbox.checked) {
        todos.done.push(text);
      } else {
        todos.todo.push(text);
      }
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

// 할 일 생성 핸들러
export function handleCreateTodo(event) {
  event.preventDefault();

  const todoText = todoInput.value.trim();
  if (todoText) {
    todoEmpty.style.display = "none";
    addTodoToList(todoText, false);
    saveTodos();
    todoInput.value = "";
  }
}

// 체크박스 핸들러
export function handleCheckboxClick(event) {
  const checkbox = event.target;
  const todoItem = checkbox.closest("li");

  const beforeEditInput = todoItem.querySelector("input[type='checkbox']");
  if (beforeEditInput && beforeEditInput.type === "text") {
    return;
  }

  const btnEditTodo = todoItem.querySelector(".todo-main__btn--edit");

  if (btnEditTodo) {
    if (checkbox.checked) {
      doneList.appendChild(todoItem);
      btnEditTodo.style.display = "none";
    } else {
      todoList.appendChild(todoItem);
      btnEditTodo.style.display = "block";
    }
  }

  saveTodos();

  updateEmptyMessage(todoList, todoEmpty);
  updateEmptyMessage(doneList, doneEmpty);
}

// 할 일이 없을 때 빈 메세지 표시
export function updateEmptyMessage(list, emptyMessage) {
  emptyMessage.style.display = list.children.length === 0 ? "block" : "none";
}

// 할일 수정 핸들러
export function handleEditTodo(event) {
  const editingTodo = event.target;
  const todoItem = editingTodo.closest("li");
  const beforeEditInput = todoItem.querySelector("input[type='checkbox']");
  const todoItemText = todoItem.querySelector(".todo-main__list-text");

  todoItem.dataset.originalText = todoItemText.textContent;

  const btnEditTodo = todoItem.querySelector(".todo-main__btn--edit");
  const btnDeleteTodo = todoItem.querySelector(".todo-main__btn--delete");

  todoItem.classList.add("todo-main__list-item--edit");
  beforeEditInput.type = "text";
  beforeEditInput.classList.remove("todo-main__checkbox-progress");
  beforeEditInput.classList.add(
    "todo-main__input",
    "todo-main__input--edit-todo"
  );
  beforeEditInput.value = todoItemText.textContent;
  todoItemText.remove();

  btnEditTodo.classList.remove("todo-main__btn--edit");
  btnEditTodo.classList.add("todo-main__btn--edited", "btn--submit");
  btnEditTodo.textContent = "완료";

  btnDeleteTodo.classList.remove("todo-main__btn--delete");
  btnDeleteTodo.classList.add("todo-main__btn--cancel");
  btnDeleteTodo.textContent = "취소";
}

// 수정 완료 핸들러
export function handleCompleteEdit(event) {
  const completeEditTodo = event.target;
  const todoItem = completeEditTodo.closest("li");
  const editedInput = todoItem.querySelector("input[type='text']");
  const editedValue = editedInput.value;

  const btnCompleteEdit = todoItem.querySelector(".todo-main__btn--edited");
  const btnCancelEdit = todoItem.querySelector(".todo-main__btn--cancel");

  const div = todoItem.querySelector(".todo-main__list-item-detail");

  todoItem.classList.remove("todo-main__list-item--edit");

  editedInput.type = "checkbox";
  editedInput.classList.remove(
    "todo-main__input",
    "todo-main__input--edit-todo"
  );
  editedInput.classList.add("todo-main__checkbox-progress");

  const p = document.createElement("p");
  p.classList.add("todo-main__list-text");
  p.textContent = editedValue;
  div.appendChild(p);

  btnCompleteEdit.classList.remove("todo-main__btn--edited", "btn--submit");
  btnCompleteEdit.classList.add("todo-main__btn--edit");
  btnCompleteEdit.textContent = "수정";

  btnCancelEdit.classList.remove("todo-main__btn--cancel");
  btnCancelEdit.classList.add("todo-main__btn--delete");
  btnCancelEdit.textContent = "삭제";
}

// 수정 취소 핸들러
export function handleCancelEdit(event) {
  const cancelEditTodo = event.target;
  const todoItem = cancelEditTodo.closest("li");
  const editInput = todoItem.querySelector("input[type='text']");
  const originalText = todoItem.dataset.originalText;

  const div = todoItem.querySelector(".todo-main__list-item-detail");

  const btnCompleteEdit = todoItem.querySelector(".todo-main__btn--edited");
  const btnCancelEdit = todoItem.querySelector(".todo-main__btn--cancel");

  editInput.type = "checkbox";
  editInput.classList.remove("todo-main__input", "todo-main__input--edit-todo");
  editInput.classList.add("todo-main__checkbox-progress");
  delete editInput.value;

  const p = document.createElement("p");
  p.classList.add("todo-main__list-text");
  p.textContent = originalText;
  div.appendChild(p);

  btnCompleteEdit.classList.remove("todo-main__btn--edited", "btn--submit");
  btnCompleteEdit.classList.add("todo-main__btn--edit");
  btnCompleteEdit.textContent = "수정";

  btnCancelEdit.classList.remove("todo-main__btn--cancel");
  btnCancelEdit.classList.add("todo-main__btn--delete");
  btnCancelEdit.textContent = "삭제";
}

// 삭제 핸들러
export function handleDeleteTodo(event) {
  const deleteTodo = event.target;
  const todoItem = deleteTodo.closest("li");

  todoItem.remove();

  updateEmptyMessage(todoList, todoEmpty);
  updateEmptyMessage(doneList, doneEmpty);
}
