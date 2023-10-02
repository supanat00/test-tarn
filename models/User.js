const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide Username']
    },
    password: {
        type: String,
        required: [true, 'Please provide Password']
    },
    role: {
        type: String,
        required: [true, 'Please select Role']
    },
    company_name:{
        type: String,
    },
    name: {
        type: String,
        required: [true, 'Please provide Name']
    },
    surname: {
        type: String,
        required: [true, 'Please provide Surname']
    },
    email: {
        type: String,
        required: [true, 'Please provide Email']
    },
    phone: {
        type: String,
        required: [true, 'Please provide Phone']
    },
    identification_number:{
        type: String,
        requiredL: [true, 'Please provide Identification_number']
    },
    line_id:{
        type: String,
        required:[true, 'Please provide Line ID']
    },
    address:{
        type: String,
        required:[true, 'Please provide Address']
    },
    district:{
        type: String,
        required:[true, 'Please provide District']
    },
    subdistrict:{
        type: String,
        required:[true, 'Please provide Subdistrict']
    },
    province:{
        type: String,
        required:[true, 'Please provide Province']
    },
    postal_code:{
        type: String,
        required:[true, 'Please provide Postal code']
    },
    card_number:{
        type: String,
    },
    bank_number:{
        type: String,
        required:[true, 'Please select your file']
    },
    company_file:{
        type: String
    },
})

UserSchema.pre('save' , function(next){
    const user = this
    bcrypt.hash(user.password , 10).then(hash => {
        user.password = hash;
        next();
    }).catch(err => {
        console.error(err);
    })
})

const User = mongoose.model('User' , UserSchema)
module.exports =User