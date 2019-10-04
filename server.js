const express = require('express');
const cors = require('cors')
const projectsRouter = require('./routes/projectsRouter')
const server = express();
server.use(cors())
server.use(express.json());
server.use('/projects', projectsRouter)

module.exports = server