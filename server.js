const express = require("express");
const projectsRouter = require("./routes/projectsRouter");

const server = express();
server.use(express.json());

function logger(req, res, next) {
  console.log(`${new Date().toISOString()} ${req.method} to ${req.url}`);
  next();
}
server.use(logger);
server.use("/projects", projectsRouter);

server.get("/", (req, res) => {
  res.send(`<h2>WEB API SPRINT</h2>`);
});

//custom middleware
module.exports = server;