import mongoose from "mongoose";
import dotenv from "dotenv/config";

export async function connectToDB(){
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Atlas Bhi Connect Ho Gaya Bhai..!")
    } catch (error) {
        console.log(error)
    }
}