const express = require('express')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
// U S E R
const User = require('../models/userModels')
var cors = require('cors');


// multer configuration
const upload = multer({
    limits:{
        fileSize: 1000000 //1MB Bytes
    },
    fileFilter(req, file , callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)){
            callback(new Error ('Format file harus jpg/jpeg/png'))
        }

        callback(null, true)
    }
})


// upload avatar
router.post('/users/avatar/:userid', upload.single('avatar'), async (req,res) =>{
    // file gambar akan ada di 'req.file.buffer'
    try {        
        let buffer = await sharp(req.file.buffer).resize({width:250}).png().toBuffer()
        let user = await User.findById(req.params.userid)
        user.avatar = buffer
        await user.save()
        res.send('success')
    } catch (error) {
        res.send(error.message)
    }
}, (err,req,res, next) => {
    res.send({
        err: err.message
    })
})

// Create one User
router.post('/users', async(req,res) => {
try {
    const user = new User(req.body)
    await user.save()
} catch (error) {
    res.send({ error:error.errors[Object.keys(error.errors)[0]].message})
}

})

// reade One User
router.get('/users/:userid' ,async (req,res)=> {
    try{
        const resp = await User.findById(req.params.userid)
        res.send({
            resp,
            avatar : `http://localhost:2019/users/avatar/${req.params.userid}`
        })
    }catch(err){
        res.send(err)
    }
})

// read All user
router.get('/users',  async (req,res)=> {
    try{
        const resp = await User.find({})
        res.send(resp)
    }catch(err){
        res.send(err)
    }
})


// Delete one by id
router.delete('/users/:userid', async (req,res)=> {
    try{
        const resp = await User.deleteOne({_id : req.params.userid})
        res.send(resp)
    }catch(err){
        res.send(err)
    }
})




// update Profile

router.patch('/users/:userid', upload.single ('avatar') ,async (req,res)=> {
    let update = Object.keys(req.body) //[name, email, ...]
    const allowedUpdates = ['name', 'email', 'password', 'age']

    if(!req.file){
        update.splice(update.indexOf('avatar',1))
    }
    
    let hasil = update.every(update => {
        return allowedUpdates.includes(update)
    })

    if(!hasil){
        return res.send(hasil)
    }

    try{
        // Ger user untuk edit
        let user = await User.findById(req.params.userid)
        // update untuk name, password, email, age
        if(req.body.password == ''){
             update.splice(update.indexOf('password'),1)
        }
        update.forEach(val => {
            user[val] =req.body[val]
        })

        // // edit data untuk image
        if(Object.keys(req).includes('file')){
            let buffer = await sharp(req.file.buffer).resize({width:250}).png().toBuffer()
            user.avatar = buffer
        }
        await user.save()
        res.send(user)
    }catch(err){
        res.send(err.message)
    }
})

// ES 5 : callback
// ES 6 : Promise -> catch then
// ES 7 : Async Await


// Login 
router.post('/users/login', cors(), async(req,res)=>{
    try {
        let result = await User.login(req.body.email, req.body.password)
        res.send({
                data : result,
                condition : "berhasil login ",
            })
    } catch (error) {
        res.send({error: error.message})
    }
})


// Read avatar 
router.get('/users/avatar/:userid', async (req,res) => {
    try {
        let user = await User.findById(req.params.userid)

        // Secara default contenct-type adalah json, kita ubah menjadu image
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.send(error)
    }
})


module.exports = router