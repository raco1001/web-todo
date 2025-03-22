export const modal = document.querySelector(".modal");

// 팀 만들기 버튼 핸들러
export const btnOpenCreateTeamModal = document.querySelector(
  ".todo-sidebar__btn--create-team"
);
export const modalCreateTeam = document.querySelector(".modal__create-team");

export function handleCreateTeamModal() {
  modal.style.display = "flex";
  modalCreateTeam.style.display = "flex";
}

// 닫기 버튼 핸들러
export const btnClose = document.querySelectorAll(".modal__btn--close");

export function handleClose(event) {
  const currentModal = event.target.closest("section");
  if (currentModal) {
    modal.style.display = "none";
    currentModal.style.display = "none";
  }
}
