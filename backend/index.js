const express = require("express");
require("./models/db");
require("dotenv").config();
const userRouter = require("./routes/user");

const User = require("./models/user");

const app = express();

// app.use((req, res, next) => {
//   req.on("data", (chunk) => {
//     const data = JSON.parse(chunk);
//     req.body = data
//   });
//   next();
// });

app.use(express.json());
app.use(userRouter);

// const test = async (email, password) => {
//   const user = await User.findOne({ email: email });
//   const result = await user.comparePassword(password);
//   console.log(result);
// };

// test("dahamkaushik1234a@gmail.com", "dahamS123");

app.get("/test", (req, res) => {});

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(8000, () => {
  console.log("Prot is listening");
});
