const express = require("express");
const { createServer } = require("vite");
const path = require("path");

const app = express();
const port = 3000;

(async () => {
  // Vite 개발 서버 생성
  const vite = await createServer({
    server: { middlewareMode: true },
  });

  // Vite 미들웨어 사용
  app.use(vite.middlewares);

  // 정적 파일 제공
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.static(path.join(__dirname, "src")));

  // HTML 파일 제공
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
  });

  app.get("/join", (req, res) => {
    res.sendFile(path.join(__dirname, "join.html"));
  });

  app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
  });

  // 404 처리
  app.use((req, res) => {
    res.status(404).send("Page not found");
  });

  // 서버 실행
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
})();
