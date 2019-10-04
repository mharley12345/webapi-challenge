const express = require('express')
const actionsDB = require('../data/helpers/actionModel')
const router = express.Router()


router.get('/',(req,res)=>{
    actionsDB.get()
    .then(action =>{
        res.status(200).json({ actions : action})
    })
    .catch(err =>{
        res.status(500).json({ errorMessage:`${err}`})
    })
})
router.post('/', (req,res) =>{
    const body = req.body;
    body.project_id = req.params.id
    actionsDB.insert(body)
    .then(action =>{
        res.status(201).json(action)
    })
    .catch(err => {
        res.status(500).json({ message: `${err}` })
    })
});

module.exports= router