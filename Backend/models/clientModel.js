import mongoose, { Schema } from "mongoose";

const clientSchema = new mongoose.Schema({
    clientName: {
      type: String,
      required: true,
    },

    clientCompany: {
      type: String,
    },

    clientPhone: {
      type: String,
      required : true
    },

    clientEmail: {
      type: String,
      required: true,
      unique : true
    },

    clientStatus : {
      type : String
    },
    
    clientOwner : {
      type : Schema.Types.ObjectId,
      ref : "User"
    }
})

const client = mongoose.model("Client",clientSchema);

export default client;