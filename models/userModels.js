const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({




    username: {
        type : String,
        unique : true,
        required :true,
        set : (val) => { return val.replace(/ /g, '') },// val = data dari user, menghapus semua spasi
        validate(val){
            // 
            val = parseInt(val)
            // akan bernilai true jika inputan user sbuah angka
            if(!isNaN(val)){
                throw new Error("Username Harus Merupakan sebuah string")
            }
        }
        
    },
    name : {
        type : String,
        required :true, //Wajib di isi
        trim : true, // menghapus spasi di awal dan di akhir kalimay
        validate(val){
            // 
            val = parseInt(val)
            // akan bernilai true jika inputan user sbuah angka
            if(!isNaN(val)){
                throw new Error("Name Harus Merupakan sebuah string")
            }
        }
    },
    email : {
        type : String,
        unique : true,
        required : true,
        trim: true,
        lowercase: true,
        validate(val){
            // validasi email atau bukan
            // isEmail akan return antara true atau false
            let result = validator.isEmail(val)
            if(!result){
                throw new Error("is not email")
            }
        }
    },
    password : {
        type: String,
        required: true,
        trim :true,
        minlength: 7, //minimal karakter
        validate(val){
            if(val.toLowerCase().includes("password")){
                throw new Error("Password tidak boleh mengandung kata 'password'")
            }
        }
    },
    age : {
        type: Number,
        set: val => parseInt(val),
        default : 0 //jika user tidak menginput informasi   
    },
    avatar :{ //menyimpan image dalam bentuk binary
        type:Buffer
    },
    tasks : [{
        type : mongoose.Types.ObjectId,
        ref : 'Task'
    }]
},{
    timestamps: true
})

// toJSON adalah function uang akan running sebelum object res
userSchema.methods.toJSON = function (){
    // untuk mengakses user
    let user = this.toObject()
    delete user.password
    delete user.tasks
    delete user.avatar
    return user
}



// membuat funtion yang akan di jalakan sebelum proses use.save
userSchema.pre('save', async function(next){
    // mengubah password yang di input dari user kedalam bentuk lain
   let user = this
   if (!this.isModified("password")) {
       return next();
   }
    return user.password = await bcrypt.hash(user.password, 8)
    // Hash Password

    // Untuk kemudian menjalankan save 
    next()
})

// membuat login function
userSchema.statics.login = async(email,password) =>{

    // mencari user berdasarkan email
    let user = await User.findOne({email})


    // jika user tidak di temukan 
    if(!user){
        throw new Error("User atau Password Salah")
    }

    // Bandingkan password input dari input user dengan yang ada di database
    // result = true/false
    let result = await bcrypt.compare(password, user.password)

    if(!result){
        throw new Error("User atau Password Salah")
    }
    return user
}


userSchema.plugin(uniqueValidator, {message: "{PATH} '{VALUE}' sudah digunakan"})
// {PATH} adalah field yang ngalami duplicate

const User = mongoose.model('User', userSchema)

module.exports = User