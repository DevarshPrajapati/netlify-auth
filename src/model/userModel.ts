import mongoose from "mongoose";

interface Iuser {
    firstName:string,
    lastName:string,
    email:string,
    image:string,
    password:string,
    mobileNo:string,
    role:number,
    token:string
}

const userSchema = new mongoose.Schema<Iuser>({

    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        // required:true,
    },
    password:{
        type:String,
        required:true
    },
    mobileNo:{
        type:String,
        required:true
    },
    role:{
        type:Number
    },
    token: {
        type: String || null,
      },

},
{timestamps:true}
)

const userModel = mongoose.model<Iuser>("user",userSchema)

export default userModel
