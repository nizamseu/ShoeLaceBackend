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
       const userReviewsCollection = database.collection('userReviews');
       const ProductsCollection = database.collection('products');
       const userOrderCollection = database.collection('orders');
    //    const ItemsCollection = database.collection('items');

    // add user to DB
        app.post('/addUser',async(req,res)=>{
            const userData = req.body;
            const result = await userCollection.insertOne(userData)
            res.json(result)
        })



        //make an Admin
        app.put('/makeAdmin',async(req,res)=>{
            const email = req.body.email;
            const filter = {email:email}
            const updateUserType={
                $set:{
                    userType:'admin',
                }
            }
        const result= await userCollection.updateOne(filter,updateUserType)

            res.send(result)
        })

// add review 

app.post('/review',async(req,res)=>{
    const data= req.body;
    const result = await userReviewsCollection.insertOne(data)
    res.json(result)
})




// Load review 

app.get('/review',async(req,res)=>{
    const result =  userReviewsCollection.find({})
    const users = await result.toArray();
    res.json(users)
})



// add order
app.post('/order',async(req,res)=>{
    const data= req.body;
    console.log(data);
    const result = await userOrderCollection.insertOne(data)
    console.log(result);
    res.json(result)
})

// add new product
app.post('/addProduct',async(req,res)=>{
    const data= req.body;
    const result = await ProductsCollection.insertOne(data)
    res.json(result)
})
// load All product
app.get('/products',async(req,res)=>{
    const result =  ProductsCollection.find({})
    const users = await result.toArray();
    res.json(users)
})


// delete single Products 
app.delete('/product/:id',async(req,res)=>{      
    const id = req.params.id;
    const result = await ProductsCollection.deleteOne({_id:ObjectId(id)});
    res.json(result)
    
})


// Find single Item 
app.get('/product/:id',async(req,res)=>{
           
    const id = req.params.id;
    console.log(id);
    const query = {_id:ObjectId(id)}
    const result = await ProductsCollection.findOne(query);
    res.send(result)
    
})

// Find products using email 

        app.get('/userOrders/:email',async(req,res)=>{
            const email = req.params.email;
            const result =  userOrderCollection.find({'email':email});
            const usersData = await result.toArray();
            res.send(usersData)
        })



// delete single Products 
app.delete('/deleteOrder/:id',async(req,res)=>{      
    const id = req.params.id;
    const result = await userOrderCollection.deleteOne({_id:ObjectId(id)});
    res.json(result)
    
})


app.get('/orders',async(req,res)=>{
    const result =  userOrderCollection.find({})
    const users = await result.toArray();
    res.json(users)
})



app.patch('/updateOrderStatus/:id',async(req,res)=>{
    const id=req.params.id;
 
    const value=req.body.status;
    const filter = {_id:id}
    const updateStatus={
        $set:{status:value}
    }
    if(id && value){
        const result = await userOrderCollection.updateOne(filter,updateStatus)
        res.send(result.modifiedCount>0)
    }
     else res.send(false)  
    })



//    find user Type 
app.get('/users/:email',async(req,res)=>{
    const email = req.params.email;
    console.log(email);
    const result = await userCollection.findOne({'email':email});
   
    // const usersData = await result.toArray();
    console.log(result);
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