import {
  loadTodos,
  todoForm,
  handleCreateTodo,
  todoList,
  doneList,
  handleCheckboxClick,
  handleEditTodo,
  handleCompleteEdit,
  handleDeleteTodo,
  handleCancelEdit,
} from "./todo.js";
import { btnCreateTeam, handleCreateTeam } from "./sidebar.js";
import {
  btnOpenCreateTeamModal,
  handleCreateTeamModal,
  btnClose,
  handleClose,
} from "./modal.js";

window.addEventListener("DOMContentLoaded", () => {
  const userId = sessionStorage.getItem("userId");
  if (userId) {
    loadTodos(userId); 
  } else {
    alert("로그인 후 이용해주세요.");
    window.location.href = "login.html";
  }
});

todoForm.addEventListener("submit", handleCreateTodo);

todoList.addEventListener("change", (event) => {
  if (event.target.classList.contains("todo-main__checkbox-progress")) {
    handleCheckboxClick(event);
  }
});

doneList.addEventListener("change", (event) => {
  if (event.target.classList.contains("todo-main__checkbox-progress")) {
    handleCheckboxClick(event);
  }
});

todoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("todo-main__btn--edit")) {
    handleEditTodo(event);
  } else if (event.target.classList.contains("todo-main__btn--edited")) {
    handleCompleteEdit(event);
  } else if (event.target.classList.contains("todo-main__btn--delete")) {
    handleDeleteTodo(event);
  } else if (event.target.classList.contains("todo-main__btn--cancel")) {
    handleCancelEdit(event);
  }
});

doneList.addEventListener("click", (event) => {
  if (event.target.classList.contains("todo-main__btn--delete")) {
    handleDeleteTodo(event);
  }
});

btnCreateTeam.addEventListener("click", handleCreateTeam);

btnOpenCreateTeamModal.addEventListener("click", handleCreateTeamModal);

btnClose.forEach((btn) => {
  btn.addEventListener("click", handleClose);
});
