const express = require('express')

const projDB = require('../data/helpers/projectModel')
const actDB = require('../data/helpers/actionModel')

const router = express.Router()

// @@@@@@@@@@ Custom Middleware @@@@@@@@@@
function validateProjectId(req, res, next) {
    const { id } = req.params

    projDB.get(id)
    .then(userId => {
        if (userId) next()
        else res.status(400).json({ message: "invalid project id" })
    })
    .catch(err => res.status(500).json({ message: "error validating project id" }))
}

function validateProject(req, res, next) {
    const proj = req.body

    if (!proj) res.status(404).json({ message: "missing project data" })
    else if (!proj.name || !proj.description) res.status(404).json({ message: "missing required project name or description" })
    else if (proj && proj.name && proj.description) next()
}

function validateAction(req, res, next) {
    const action = req.body

    if (!action) res.status(404).json({ message: "missing action data" })
    else if (!action.notes || !action.description) res.status(404).json({ message: "missing required action notes or description" })
    else if (action && action.notes && action.description) next()
}

// @@@@@@@@@@ GET request @@@@@@@@@@
//Get all projects
router.get('/', (req,res) => {
    projDB.get()
    .then(projects => res.json(projects))
    .catch(err => res.status(500).json({ message: "error retrieving projects" }))
})

//Get specific projects w/ actions
router.get('/:id', validateProjectId, (req,res) => {
    const { id } = req.params

    projDB.get(id)
    .then(project => res.json(project))
    .catch(err => res.status(500).json({ message: "error retrieving specific project" }))
})

//Get only the actions of a specific project
router.get('/:id/actions', validateProjectId, (req,res) => {
    const { id } = req.params

    projDB.getProjectActions(id)
    .then(projectActions => res.json(projectActions))
    .catch(err => res.status(500).json({ message: "error retrieving specific project" }))
})

// @@@@@@@@@@ POST request @@@@@@@@@@
router.post('/', validateProject, (req,res) => {
    const newProject = req.body

    projDB.insert(newProject)
    .then(proj => res.status(201).json(proj))
    .catch(err => res.status(500).json({ message: "error adding project" }))
})

router.post('/:id', validateProjectId, validateAction, (req,res) => {
    const { id } = req.params
    const newAction = { project_id: id, ...req.body }

    actDB.insert(newAction)
    .then(act => res.status(201).json(act))
    .catch(err => res.status(500).json({ message: "error adding action to project" }))
})

// @@@@@@@@@@ DELETE request @@@@@@@@@@
router.delete('/:id', validateProjectId, (req,res) => {
    const { id } = req.params

    projDB.get(id)
    .then(delProject => {
        projDB.remove(id)
        .then(proj => res.json(delProject))
        .catch(err => res.status(500).json({ message: "error deleting project" }))
    })
    .catch(err => res.status(500).json({ message: "error retrieving project for deletion" }))
})

// @@@@@@@@@@ PUT request @@@@@@@@@@
router.put('/:id', validateProjectId, validateProject, (req,res) => {
    const { id } = req.params
    const updateProject = req.body

    projDB.update(id, updateProject)
    .then(proj => res.json(proj))
    .catch(err => res.status(500).json({ message: "error retrieving project to update" }))
})

module.exports = router