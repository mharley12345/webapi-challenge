const express = require('express');
const cors = require('cors')
const projectsRouter = require('./routes/projectsRouter')
const actionsRouter = require('./routes/actionsRouter')
const server = express();
server.use(cors())
server.use(express.json());
server.use('/projects',projectsRouter)
server.use('/actions', actionsRouter)

module.exports = server