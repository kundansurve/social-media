const express = require("express");
const app = express();
const api = require("./api");
const db = require("./dbconfig");

require("dotenv").config();

db.connect(process.env.url).then(() => {
  //Handle /api with the api middleware

  app.use("/api", api);

  app.listen(3000, () => {
    console.log("App is running on 3000 port");
  });
});
