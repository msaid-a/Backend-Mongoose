const express = require('express')
const router = new express.Router()


// T A S K 
const Task = require('../models/taskModels')
const User = require('../models/userModels')

const cors = require('cors')

// Create Task
router.post('/tasks/:userid' ,async(req,res) => {
    
    try {
        let user = await User.findById(req.params.userid)
        let task =  new Task ({
         ...req.body,
            owner : user._id
        })
        // simpan _id task yang baru ke array task pada user 
        user.tasks.push(task._id)
        // sipan user dan task ke database
        await user.save()
        await task.save()
        res.send({
            owner : {
                name : user.name,
                id : user._id,  
            },
            creteredTask : {
                description : task.description,
                id : task._id,
                owner : task.owner
            }

        })
        
    } catch (error) {
        res.send(error.message)
    }
  
})



// Update
// router.options('/tasks/:taskid',)
router.patch('/tasks/:taskid', async(req, res) => {
    let update = Object.keys(req.body)
    let allowedUpdates= ['description', 'completed']
    let result = update.every(update => allowedUpdates.includes(update))
    
    if(!result){
        return res.send({err: 'Invalid'})
    }

    try {
        let task = await Task.findById(req.params.taskid)
        update.forEach(val => {
            task[val] = req.body[val]
        });
        await task.save()
        res.send(task)
    } catch (error) {
        res.send(error.message)
    }

})

// read all own task 
router.get('/tasks/:userid' , async (req, res) => {
    try {
        let user = await User.find({_id: req.params.userid}).populate({path:'tasks'}).exec()
        res.send(user[0].tasks)
    } catch (error) {
        res.send(error.message)
    }
})


// Delete Task
router.delete('/tasks/:taskid', async(req, res) =>{
    try {
        let task = await Task.findByIdAndDelete(req.params.taskid)
        // res.send({deletedTask : task})
        
        // Delete deltetedTask id, menghapus id task yang sudah di hapus 
        let user = await User.findById(task.owner)
        let index = user.tasks.indexOf(req.params.taskid)
        user.tasks.splice(index,1)
        await user.save()
        res.send({deletedTask: task})


    } catch (error) {
        res.send(error.message)
    }
})

// Read Avatar 




module.exports = router