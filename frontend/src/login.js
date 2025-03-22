const loginForm = document.querySelector("#login-form");

const btnJoin = document.querySelector(".btn--join");

const userId = document.querySelector(".login-form__input--userid");
const userPw = document.querySelector(".login-form__input--userpw");

window.addEventListener("DOMContentLoaded", () => {
  const savedUserId = sessionStorage.getItem("userId");
  if (savedUserId) {
    userId.value = savedUserId;
  }
});

function handleLogin(event) {
  event.preventDefault();

  const userData = {
    userName: userId.value,
    password: userPw.value,
  };

  console.log(JSON.stringify(userData));

  fetch("http://localhost:5001/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      console.log("서버 응답 상태: ", response.status);
      if (!response.ok) {
        throw new Error(`로그인 실패: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("로그인 성공, 메인 페이지로 이동");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    });
}

loginForm.addEventListener("submit", handleLogin);

function handleGoToJoin(event) {
  event.preventDefault();
  window.location.href = "join.html";
}

btnJoin.addEventListener("click", handleGoToJoin);
