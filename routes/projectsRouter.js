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



module.exports = router