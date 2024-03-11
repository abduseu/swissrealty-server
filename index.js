const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.rkpusfk.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();
        const database = client.db('swissrealty_db')
        const properties = database.collection('properties')


        /* PROPERTIES START */
        //properties >> Create
        app.post('/properties', async (req, res) => {
            const property = req.body

            const result = await properties.insertOne(property)
            res.send(result)
        })
        //properties >> Read
        app.get('/properties', async (req, res) => {
            const result = await properties.find().toArray()
            res.send(result)
        })
        //properties/_id >> Read one
        app.get('/properties/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await properties.findOne(filter)
            res.send(result)
        })


        /* PROPERTIES END */


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
    res.send('Welcome to express-server')
})

app.listen(port, () => {
    console.log(`express-server is running on ${port}`)
})