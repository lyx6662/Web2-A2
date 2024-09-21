var express = require('express');
var app = express();
var A2API = require("./controllerAPI/api-controller");
app.use("/api/A2people", A2API);
app.listen(3060);
console.log("Server up and running on port 3060");
