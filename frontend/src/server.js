import express from "express";
import { createServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5173;

app.use(cors());
app.use(express.json());

(async () => {
  // Vite 개발 서버 생성
  const vite = await createServer({
    server: { middlewareMode: true },
  });

  // HTML 라우팅 (Vite의 transformIndexHtml 적용)
  app.get("/", async (req, res) => {
    const filePath = path.join(__dirname, "../login.html");
    let html = fs.readFileSync(filePath, "utf-8");
    html = await vite.transformIndexHtml(req.originalUrl, html);
    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  });

  app.get("/join", async (req, res) => {
    const filePath = path.join(__dirname, "../join.html");
    let html = fs.readFileSync(filePath, "utf-8");
    html = await vite.transformIndexHtml(req.originalUrl, html);
    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  });

  app.get("/login", async (req, res) => {
    const filePath = path.join(__dirname, "../login.html");
    let html = fs.readFileSync(filePath, "utf-8");
    html = await vite.transformIndexHtml(req.originalUrl, html);
    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  });

  // ✅ 회원가입 엔드포인트 추가
  app.post("/auth/join", (req, res) => {
    console.log("회원가입 요청 받음:", req.body);

    // 간단한 응답 (백엔드 저장 로직 필요하면 여기에 추가)
    res.json({ message: "회원가입 성공", user: req.body });
  });

  // Vite 미들웨어 적용
  app.use(vite.middlewares);

  // 404 처리
  app.use((req, res) => {
    res.status(404).send("Page not found");
  });

  // 서버 실행
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
})();
