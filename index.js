const express = require("express");
const bodyParser = require("body-parser");
const ogrenciController = require("./Controllers/ogrenciController.js");
const bolumController = require("./Controllers/bolumController.js");
const haftalikRapor = require("./haftalikRapor.js");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", ogrenciController);

app.use("/", bolumController);

app.listen(port, () => {
  console.log("Server running on port", { port });
  haftalikRapor.haftalikRapor();
});
