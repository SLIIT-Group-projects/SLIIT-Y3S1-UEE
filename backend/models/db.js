const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://sajitha_dilumina:sajitha2002@userdb.5yrhu.mongodb.net/userDB?retryWrites=true&w=majority&appName=userDB",
    {}
  )
  .then(() => {
    console.log("mongoDB is connected");
  })
  .catch((err) => console.log(err.message));
