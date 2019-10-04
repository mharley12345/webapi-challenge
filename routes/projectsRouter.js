const express = require("express");

const Project = require("../data/helpers/projectModel");
const actionsRouter = require("../routes/actionsRouter");
const router = express.Router();

//Getting all Projects
router.get("/", (req, res) => {
  Project.get()
    .then(project => res.status(200).json(project))
    .catch(() => {
      res.status(500).json({ errorMessage: "Couldn't retrieve all Projects" });
    });
});

//Getting a specific project
router.get("/:id", validateProjectId, (req, res) => {
  Project.get(req.params.id).then(project =>
    res
      .status(200)
      .json(project)
      .catch(() =>
        res
          .status(500)
          .json({ errorMessage: "Couldnt sent the specific project" })
      )
  );
});

//Getting all actions for a project
router.get("/:id/actions", validateProjectId, (req, res) => {
  Project.getProjectActions(req.params.id)
    .then(actions => res.status(200).json(actions))
    .catch(() =>
      res
        .status(500)
        .json({ errorMessage: "Error with getting all actions for a project" })
    );
});

//Adding a new project
router.post("/", validateProjectResource, (req, res) => {
  Project.insert(req.body)
    .then(add => res.status(201).json({ Created: add }))
    .catch(() =>
      res
        .status(500)
        .json({ errorMessage: "Error with adding new project to database" })
    );
});

//Deleting a project
router.delete("/:id", validateProjectId, (req, res) => {
  Project.remove(req.params.id)
    .then(deleted => res.status(200).json({ recordsDeleted: deleted }))
    .catch(() =>
      res
        .status(500)
        .json({ errorMessage: "Error in removing specific project" })
    );
});

//Updating a project
router.put("/:id", [validateProjectId, validateProjectResource], (req, res) => {
  Project.update(req.params.id, req.body)
    .then(update => res.status(202).json({ projectUpdated: update }))
    .catch(() =>
      res
        .status(500)
        .json({ errorMessage: "Error updating the specific Project" })
    );
});

//Middleware will check if invalid project no is used so routing will stop
router.use("/:id/actions", validateProjectId, actionsRouter);

//custom middleware to test incoming resources
function validateProjectResource(req, res, next) {
  if (req.body.name === undefined) {
    res.status(400).json({
      errorMessage: "Make sure your project has name field"
    });
  } else if (req.body.description === undefined) {
    res.status(400).json({
      errorMessage: "Make sure your project has description field"
    });
  } else {
    next();
  }
}
function validateProjectId(req, res, next) {
  Project.get(req.params.id)
    .then(project => {
      if (project) {
        next();
      } else {
        res.status(400).json({ errorMessage: "Invalid Project ID" });
      }
    })
    .catch(() =>
      res.status(500).json({ errorMessage: "Error with accessing Projects" })
    );
}
module.exports = router;