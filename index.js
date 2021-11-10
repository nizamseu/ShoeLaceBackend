const express = require('express');
const app = express();
require("dotenv").config();
const cors =require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;



const user= process.env.DB_USER;
const pass =process.env.DB_PASS

//Middleware

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${user}:${pass}@cluster0.tgh4y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const run =  async ()=>{

    try{
       await client.connect();
   
       const database =client.db('shoeLace');
       const userCollection = database.collection('users');
    //    const ItemsCollection = database.collection('items');

        app.post('/addUser',async(req,res)=>{
            const userData = req.body;
            const result = await userCollection.insertOne(userData)
            res.json(result)
        })


       app.get('/',(req,res)=>{
           res.json("hello World")
       })
    }
    finally{
    //    await client.close();
    }
}


run().catch(console.dir)





app.listen(port,()=>{
    console.log("listening ");
})