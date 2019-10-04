const express = require('express')
const projectsDB = require('../data/helpers/projectModel')

const router = express.Router()

router.get('/',(req,res)=>{
    projectsDB.get()
    .then(project =>{
        res.status(200).json({ projects: project})
    })
    .catch(err =>{
        res.status(500).json({ errorMessage:`${err}`})
    })
})
router.post('/',(req,res) =>{
    const body = req.body;
   
     projectsDB.insert(body)
    .then(project => {
        res.status(201).json({ newProject: project })
    })
    .catch(err => {
        res.status(500).json({ message: `${err}` })
    })
});
router.put("/:id", (req,res) =>{
    projectsDB.update(req.params.id,req.body)
    .then(()=>{
        projectsDB.get(req.params.id)
        .then(action=>{
            res.status(200).json(action)
        })
    })
    .catch(err => {
        res.status(500).json({ errorMessage: `${err}` })
    })
})

router.delete('/:id',(req,res)=>{
    projectsDB.remove(req.params.id)
    .then(() => {
        res.status(200).json({ deleted : req.project})
    })
    .catch(err => {
        res.status(500).json({ errorMessage: `${err}` })
    })
})

module.exports = router