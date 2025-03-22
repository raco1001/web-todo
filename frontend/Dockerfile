# 최신 Node.js LTS 버전 사용
FROM node:latest

# 작업 디렉토리 설정
WORKDIR /app


COPY package*.json ./

# 의존성 설치
RUN npm install

# 전체 프로젝트 파일 복사 (node_modules 제외)
COPY . .

# Vite 또는 Next.js 앱 실행
CMD ["npm", "run", "dev"]
