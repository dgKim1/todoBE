const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const app = express();
app.use(express.json());
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI_PROD;
app.use(
  cors({
    origin: "http://localhost:3000", // 개발용 프론트 주소만 허용
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", indexRouter);

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((err) => {
    console.log("DB connnection failed", err);
  });

app.listen(process.env.PORT || 5000, () => {
  console.log(`server on ${process.env.PORT}`);
});

//1.회원가입
// 유저가 이메일, 패스워드, 유저이름 입력해서 보냄
// 받은 정보를 저장함(데이터베이스 모델 필요)
//패스워드를 암호화 시켜서 저장

//1. 라우터
//2. 모델
//3.데이터를 저장 (이미 가입된 유저 유무, 패스워드 암호화)
//4. 응답을 보낸다
