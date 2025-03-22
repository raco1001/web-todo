// 팀 만들기 핸들러
export const btnCreateTeam = document.querySelector(".modal__btn--create-team");

export function handleCreateTeam(event) {
  event.preventDefault();

  const teamNameInput = document.querySelector(".modal__input--create-team");
  const teamName = teamNameInput.value;

  modalCreateTeam.style.display = "none";
  modal.style.display = "none";
  teamNameInput.value = "";

  addTeamTodo(teamName);
}

// 사이드바에 팀 할 일 메뉴 추가
export function addTeamTodo(teamName) {
  const sidebarList = document.querySelector(".todo-sidebar__menu");

  const li = document.createElement("li");
  li.classList.add("todo-sidebar__menu-item");
  sidebarList.appendChild(li);

  const btnMenu = document.createElement("button");
  btnMenu.type = "button";
  btnMenu.classList.add("todo-sidebar__btn", "todo-sidebar__btn--team-todo");
  btnMenu.textContent = `팀 ${teamName}의 할 일 목록`;
  li.appendChild(btnMenu);

  const btnMore = document.createElement("span");
  btnMore.classList.add("todo-sidebar__more-icon");
  btnMenu.appendChild(btnMore);

  const dropDownMenu = document.createElement("ul");
  dropDownMenu.classList.add("todo-sidebar__dropdown");
  btnMenu.appendChild(dropDownMenu);

  const dropDownItem1 = document.createElement("li");
  dropDownItem1.classList.add("todo-sidebar__dropdown-item");
  dropDownMenu.appendChild(dropDownItem1);

  const btnInviteMenu = document.createElement("button");
  btnInviteMenu.classList.add(
    "todo-sidebar__dropdown__btn",
    "todo-sidebar__dropdown__btn-invite"
  );
  dropDownItem1.appendChild(btnInviteMenu);
  btnInviteMenu.textContent = "초대하기";

  const dropDownItem2 = document.createElement("li");
  dropDownItem2.classList.add("todo-sidebar__dropdown-item");
  dropDownMenu.appendChild(dropDownItem2);

  const btnDeleteMenu = document.createElement("button");
  btnDeleteMenu.classList.add(
    "todo-sidebar__dropdown__btn",
    "todo-sidebar__dropdown__btn-delete"
  );
  dropDownItem2.appendChild(btnDeleteMenu);
  btnDeleteMenu.textContent = "삭제하기";

  // 드롭다운 메뉴를 열고 닫는 토글
  btnMore.addEventListener("click", (event) => {
    event.stopPropagation();

    const li = event.currentTarget.closest(".todo-sidebar__menu-item");
    const dropDownMenu = li.querySelector(".todo-sidebar__dropdown");

    // 기존에 열린 메뉴가 있으면 닫기
    const showingMenu = document.querySelectorAll(
      ".todo-sidebar__dropdown.show"
    );
    showingMenu.forEach((menu) => {
      if (menu !== dropDownMenu) {
        menu.classList.remove("show");
      }
    });

    dropDownMenu.classList.toggle("show");
  });

  // 팀 멤버 초대하는 모달창 열기
  btnInviteMenu.addEventListener("click", () => {
    modal.style.display = "flex";
    const modalInvite = document.querySelector(".modal__invite");
    modalInvite.style.display = "flex";
  });

  // 팀 메뉴 삭제하기
  btnDeleteMenu.addEventListener("click", () => {
    li.remove();
    dropDownMenu.style.display = "none";
  });

  // 아무데나 누르면 메뉴 닫기
  document.addEventListener("click", (event) => {
    const openMenu = document.querySelector(".todo-sidebar__dropdown.show");
    if (openMenu && !openMenu.contains(event.target)) {
      openMenu.classList.remove("show");
    }
  });
}
