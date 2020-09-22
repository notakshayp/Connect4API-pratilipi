const express = require("express");
var http = require("http");
const app = express();

app.set("port", process.env.PORT || 2131);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

http.createServer(app).listen(app.get("port"), function () {
  console.log("Express server listing on port " + app.get("port"));
});
