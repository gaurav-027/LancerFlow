import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName : {
        type : String
    },
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type: String,
        required : true
    },
    bio : {
        type : String
    },
    isEmailVerified : {
        type : Boolean,
        default : false
    },
    emailVerificationCode : {
        type : String
    },
    emailVerificationExpiresAt : {
        type : Date
    }
})

const user = mongoose.model("User",userSchema);

export default user;
