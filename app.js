const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const app = express();
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI_PROD;
app.use(
  cors({
    origin: "http://localhost:3000", // 개발용 프론트 주소만 허용
    credentials: true,
  })
);

app.use(bodyParser.json());
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
