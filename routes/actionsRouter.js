const express = require("express");

const Actions = require("../data/helpers/actionModel");

const router = express.Router();

//Getting specific action by ID
router.get("/:id", validateActionId, (req, res) => {
  Actions.get(req.params.id)
    .then(action => res.status(200).json(action))
    .catch(() =>
      res.status(500).json({ errorMessage: "Couldnt sent the action project" })
    );
});

//Post a new action to a project
router.post("/", validateActionResource, (req, res) => {
  Actions.insert(req.body)
    .then(add => res.status(201).json({ Created: add }))
    .catch(() =>
      res
        .status(500)
        .json({ errorMessage: "Error with adding new action to database" })
    );
});

//Delete an action from a project
router.delete("/:id", validateActionId, (req, res) => {
  Actions.remove(req.params.id)
    .then(deleted => res.status(200).json({ recordsDeleted: deleted }))
    .catch(() =>
      res
        .status(500)
        .json({ errorMessage: "Error in removing specific project" })
    );
});

//Update action for a project
router.put("/:id", [validateActionId, validateActionResource], (req, res) => {
  Actions.update(req.params.id, req.body)
    .then(update => res.status(202).json({ projectUpdated: update }))
    .catch(() =>
      res
        .status(500)
        .json({ errorMessage: "Error updating the specific Project" })
    );
});

//Custom middleware for testing incoming resources
function validateActionId(req, res, next) {
  Actions.get(req.params.id)
    .then(action => {
      if (action) {
        next();
      } else {
        res.status(400).json({ errorMessage: "Invalid Action ID" });
      }
    })
    .catch(() =>
      res.status(500).json({ errorMessage: "Error with accessing Actions" })
    );
}
function validateActionResource(req, res, next) {
  if (req.body.project_id === undefined) {
    res.status(400).json({
      errorMessage: "Make sure your action has a project_id"
    });
  } else if (req.body.description === undefined) {
    res.status(400).json({
      errorMessage: "Make sure your action has description field"
    });
  } else if (req.body.notes === undefined) {
    res
      .status(404)
      .json({ errorMessage: "Make sure your action has a notes field" });
  } else if (req.body.description.length > 128) {
    res.status(404).json({
      errorMessage:
        "Woah there, description has too many characters, keep it under 128 characters"
    });
  } else {
    next();
  }
}

module.exports = router;