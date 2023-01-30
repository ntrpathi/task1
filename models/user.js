const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
dotenv.config({path:'../config.env'})
const jwt = require("jsonwebtoken")
const userRegister = new mongoose.Schema({
    FirstName:{
        type:String,
        required:true,
    },

    LastName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
    },

    phone:{
        type:Number,
        required:true,
    },

    password:{
        type:String,
        required:true,
    },

    cPassword:{
        type:String,
        required:true
    },

    customers:[{
        C1:{
            type:String,
            required:true
        }
    }],

    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

// To hash password

userRegister.pre('save',async function(next){
    console.log('hi from inside')
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12)
        this.cPassword = await bcrypt.hash(this.cPassword,12)
    }
    next();
})


//To generate token

userRegister.methods.generateAuthToken = async function  (){
    try{
        let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;

    }catch(err){
        console.log(err)
    }
}

const users = mongoose.model('User1',userRegister);
module.exports = users;