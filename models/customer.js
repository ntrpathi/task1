const mongoose = require('mongoose')

const customer = new mongoose.Schema({
    FirstName:{
        type:String,
        required:true,
    },

    LastName:{
        type:String,
        required:true,
    },

    company:{
        type:String,
        rerquired:true,
    },
    user:{
        type:mongoose.Types.ObjectId,
        rerquired:true,
    },
    products:{
        type:String,
        required:true
    }
})

const Customer = mongoose.model('customer',customer);
module.exports = Customer;