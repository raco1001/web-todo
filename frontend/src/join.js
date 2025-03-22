const joinForm = document.querySelector("#join-form");

const userId = document.querySelector(".join-form__input--userid");
const userPw = document.querySelector(".join-form__input--userpw");
const checkPw = document.querySelector(".join-form__input--checkpw");

const errClass = "join-form__input--err";
const errMsg = document.querySelector(".join-form__input--err-message");

function handleJoin(event) {
  event.preventDefault();

  if (userPw.value !== checkPw.value) {
    errMsg.style.display = "block";
    userPw.classList.add(errClass);
    checkPw.classList.add(errClass);
    return;
  }

  const userData = {
    userName: userId.value,
    password: userPw.value,
  };

  console.log(userData);
  fetch("/api/auth/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response) {
        throw new Error(`회원가입 실패: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      sessionStorage.setItem("userId", userData.userName);
      alert(`회원가입에 성공했습니다. 아이디: ${userData.userName}`);
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    });
}

joinForm.addEventListener("submit", handleJoin);

function handleInputChange() {
  const errStatus = errMsg.style.display;

  if (errStatus === "block") {
    errMsg.style.display = "none";
    userPw.classList.remove(errClass);
    checkPw.classList.remove(errClass);
  }
}

userPw.addEventListener("input", handleInputChange);
checkPw.addEventListener("input", handleInputChange);
