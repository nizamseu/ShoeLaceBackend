const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');


const user= process.env.DB_USER;
const pass =process.env.DB_PASS

const uri = `mongodb+srv://${user}:${pass}@cluster0.tgh4y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const run =  async ()=>{

    try{
       await client.connect();
       console.log("mongo");


       app.get('/',(req,res)=>{
           res.json("hello World")
       })
    }
    finally{
    //    await client.close();
    }
}


run().catch(console.dir)




app.get('/',(req,res)=>{
    res.send("Hello world")
})

app.listen(port,()=>{
    console.log("listening ");
})