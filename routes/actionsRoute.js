const express = require('express')

const projDB = require('../data/helpers/projectModel')
const actDB = require('../data/helpers/actionModel')

const router = express.Router()

// @@@@@@@@@@ Custom Middleware @@@@@@@@@@
function validateActionId(req, res, next) {
    const { id } = req.params

    actDB.get(id)
    .then(actId => {
        if (actId) next()
        else res.status(400).json({ message: "invalid action id" })
    })
    .catch(err => res.status(500).json({ message: "error validating action id" }))
}

function validateAction(req, res, next) {
    const action = req.body

    if (!action) res.status(404).json({ message: "missing action data" })
    else if (!action.notes || !action.description || !action.project_id) res.status(404).json({ message: "missing required action notes, description, or project_id" })
    else if (action && action.notes && action.description && action.project_id) {
        projDB.get(action.project_id)
        .then(cleared => {
            if (cleared) next()
            else res.status(400).json({ message: "invalid project id" })
        })
        .catch(err => res.status(500).json({ message: "error validating project id" }))
    }
}

// @@@@@@@@@@ GET requests @@@@@@@@@@
//Get all actions
router.get('/', (req,res) => {
    actDB.get()
    .then(actions => res.json(actions))
    .catch(err => res.status(500).json({ message: "error retrieving actions" }))
})

//Get specific action
router.get('/:id', validateActionId, (req,res) => {
    const { id } = req.params

    actDB.get(id)
    .then(action => res.json(action))
    .catch(err => res.status(500).json({ message: "error retrieving specific action" }))
})

// @@@@@@@@@@ POST request @@@@@@@@@@
router.post('/', validateAction, (req, res) => {
    const newAction = req.body

    actDB.insert(newAction)
    .then(act => res.status(201).json(act))
    .catch(err => res.status(500).json({ message: "error adding action" }))
})

// @@@@@@@@@@ DELETE request @@@@@@@@@@
router.delete('/:id', validateActionId, (req, res) => {
    const { id } = req.params

    actDB.get(id)
    .then(delAction => {
        actDB.remove(id)
        .then(proj => res.json(delAction))
        .catch(err => res.status(500).json({ message: "error deleting action" }))
    })
    .catch(err => res.status(500).json({ message: "error retrieving action for deletion" }))
})

// @@@@@@@@@@ PUT request @@@@@@@@@@
router.put('/:id', validateActionId, validateAction, (req,res) => {
    const { id } = req.params
    const updateAction = req.body

    actDB.update(id, updateAction)
    .then(act => res.json(act))
    .catch(err => res.status(500).json({ message: "error retrieving action to update" }))
})

module.exports = router