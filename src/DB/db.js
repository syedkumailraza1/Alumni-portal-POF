const express = require('express')

const mongoose = require('mongoose');
const env = require('dotenv').config()
const DB_NAME = process.env.DB_NAME

const DBConnection = async ()=>{
    console.log(`${process.env.MONGODB_URI}/${DB_NAME}`);
    
        try {
           const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
           
            console.log(`\n Database Connected Successfully!! DB Host ${connectionInstance.connection.host}`);
            
          
        } catch (error) {
            console.log("Error occur while connection DB: ",error);
            
        }

}

module.exports = DBConnection