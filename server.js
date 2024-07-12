const express = require("express");
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const authRoutes = require("./app/routes/authRoutes");
const initializeSocket = require("./app/socket/socketHandler");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", authRoutes);
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
initializeSocket(server);

server.listen(3000, () => {
  console.log("running on 3000");
});
