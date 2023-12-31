const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6vyreuj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productsCollection = client.db('productsDB').collection('products');
    const mycartsCollection = client.db('productsDB').collection('mycarts');

    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.findOne(query);
      res.send(result);
    })

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      console.log(id, product);
      const filter = { _id: new ObjectId(id) }

      const options = { upsert: true }
      const updatedProduct = {
        $set: {
          photoUrl: product.photoUrl,
          name: product.name,
          brand: product.brand,
          type: product.type,
          price: product.price,
          rating: product.rating
        }
      }
      const result = await productsCollection.updateOne(filter, updatedProduct, options);
      res.send(result);
    })

    //add to cart
    app.get('/mycarts', async (req, res) => {
      const cursor = mycartsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/mycarts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await mycartsCollection.findOne(query);
      res.send(result);
    })

    app.post("/mycarts", async (req, res) => {
      const cart = req.body;
      const result = await mycartsCollection.insertOne(cart);
      res.send(result);
    })

    app.delete('/mycarts/:id', async(req, res) =>{
      const id = req.params.id;
      console.log("please delete from database", id);
      const query = {_id: new ObjectId(id)}

      const result = await  mycartsCollection.deleteOne(query);
      res.send(result);
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("FASHION BRAND SHOP SERVER IS RUNNING...")
})

app.listen(port, () => {
  console.log(`Fashion Brand Shop Server is running: ${port}`)
})