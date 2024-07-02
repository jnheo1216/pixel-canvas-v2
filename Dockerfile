FROM node:20

# 앱 디렉터리 생성
WORKDIR /usr/src/app

# 앱 종속성 설치
COPY package*.json ./
RUN npm install

# 앱 소스 복사
COPY . .

# 앱이 3000번 포트에서 실행됨을 알림
EXPOSE 3000

# 앱 실행
CMD [ "npm", "run", "dev" ]