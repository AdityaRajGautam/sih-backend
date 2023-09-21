import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phone:{
    type:String,
    requried:true
},
address:{
  type:{},
  requried:true
},
  userType: {
    type: String,
    default: 'user',
  },
},{timestamps:true});


export default mongoose.model("users",userSchema)