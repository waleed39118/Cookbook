const mongoose = require('mongoose'); 

// Creating application schema 
const applicationSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    }, 

     title: {
        type: String,
        required: true
    }, 

     notes: {
        type: String,
    }, 

    postingLink: {
        type: String,
    }, 

    status: {
        type: String,
        enum: ['interested', 'applied', 'interviewing', 'rejected', 'accepted']  // enum is (one of the values needs to be there from these) it wont accept anthing else 
    }

})

const userSchema = new mongoose.Schema({ 
    
    username: {
        type: String, 
        required: true
    }, 
    password: {
        type: String, 
        required: true
    },
    applications: [applicationSchema] // Using the schema that we created earlier (embedded)

});

const User = mongoose.model("User", userSchema);
module.exports = User;