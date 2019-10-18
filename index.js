const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routers/userRouters')
const taskRouter = require('./routers/taskRouter')


const app = express()
const port = process.env.PORT || 2019 // Port Heroku atau Localhost
const URL = 'mongodb+srv://said:Indonesiaku!@bdg-mongoose-pj0ka.mongodb.net/bdg-mongoose?retryWrites=true&w=majority'

mongoose.connect(URL, {
    // Menguunakan parse baru
    useNewUrlParser : true,
    // menggunakan method baru 'Create Index' untuk membuat index setiap kaliinput sebuah data
    useCreateIndex : true,
    // Menggunakan method baru untuk prosess findOneAndUpdate()
    useFindAndModify : true,
    // Menggunakan engine mongodb baru
    useUnifiedTopology: true
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('/', (req,res)=>{
    res.send(`<h1> API Running at ${port}</h1>`)
})



app.listen(port, () => {console.log('Api Runing di port ' + port)})