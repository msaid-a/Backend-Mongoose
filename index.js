const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routers/userRouters')
const taskRouter = require('./routers/taskRouter')
const cors = require('cors');


const app = express()
const port = process.env.PORT || 2019 // Port Heroku atau Localhost
const URL = 'mongodb+srv://said:Indonesiaku!@bdg-mongoose-pj0ka.mongodb.net/bdg-mongoose?retryWrites=true&w=majority'
const URL_local = 'mongodb://localhost:27017/bdg-mongoose'

mongoose.connect(URL_local, {
    // Menguunakan parse baru
    useNewUrlParser : true,
    // menggunakan method baru 'Create Index' untuk membuat index setiap kaliinput sebuah data
    useCreateIndex : true,
    // Menggunakan method baru untuk prosess findOneAndUpdate()
    useFindAndModify : true,
    // Menggunakan engine mongodb baru
    useUnifiedTopology: true
})

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


app.get('/', (req,res)=>{
    res.send(`<h1> API Running at ${port}</h1>`)
})



app.listen(port, () => {console.log('Api Runing di port ' + port)})