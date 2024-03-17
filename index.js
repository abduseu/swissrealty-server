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
        const users = database.collection('users')
        const wishlist = database.collection('wishlist')
        const offer_request = database.collection('offer_request')


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
        //properties/_id >> update one
        app.put('/properties/:id', async (req, res) => {
            const id = req.params.id
            const property = req.body

            const filter = { _id: new ObjectId(id) }
            const updatedProperty = {
                $set: { ...property }
            }
            const options = { upsert: true }

            const result = await properties.updateOne(filter, updatedProperty, options)
            res.send(result)
        })
        //properties/_id >> Delete
        app.delete('/properties/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await properties.deleteOne(filter)
            res.send(result)
        })

        //agent-listings?email= >> Read query
        app.get('/agent-listings', async (req, res) => {
            const email = req.query.email;
            const filter = { agent_email: email };
            const result = await properties.find(filter).toArray();
            res.send(result);
        });

        /* PROPERTIES END */
        /* START USERS */


        //Users >> Create (upsert)
        app.post('/users', async (req, res) => {
            const user = req.body;

            const query = { email: user.email }
            const existingUser = await users.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await users.insertOne(user);
            res.send(result);
        });

        //Users >> read all
        app.get('/users', async (req, res) => {
            const result = await users.find().toArray()
            res.send(result)
        })

        //Users >> read one
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id

            const filter = { email: id }
            const result = await users.findOne(filter)
            res.send(result)
        })

        //Users >> update one (change role)
        app.put('/manage-users/:id', async (req, res) => {
            const id = req.params.id
            const changeRole = req.body

            const filter = { _id: new ObjectId(id) }
            const updatedUser = {
                $set: {
                    role: changeRole.role
                }
            }
            const result = await users.updateOne(filter, updatedUser)

            res.send(result)
        })


        /* USERS END */
        /* WISHLIST START */


        //Wishlist >> Create
        app.post('/wishlist', async (req, res) => {
            const wishlistt = req.body

            const result = await wishlist.insertOne(wishlistt)
            res.send(result)
        })

        //Wishlist?_id >> Read query
        app.get('/wishlist', async (req, res) => {
            const email = req.query.email;
            const filter = { email: email };
            const result = await wishlist.find(filter).toArray();
            res.send(result);
        });

        //Wishlist/_id >> Delete
        app.delete('/wishlist/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await wishlist.deleteOne(filter)
            res.send(result)
        })


        /* WISHLIST END */
        /* OFFER_REQUEST START */


        //offer_request >> Create
        app.post('/offer-request', async (req, res) => {
            const offer = req.body

            const result = await offer_request.insertOne(offer)
            res.send(result)
        })
        //offer_request >> Read
        app.get('/offer-request', async (req, res) => {
            const result = await offer_request.find().toArray()
            res.send(result)
        })
        //offer_request >> update one (change status)
        app.put('/offer-request/:id', async (req, res) => {
            const id = req.params.id
            const changeStatus = req.body

            const filter = { _id: new ObjectId(id) }
            const updatedOffer_request = {
                $set: {
                    status: changeStatus.status
                }
            }
            const result = await offer_request.updateOne(filter, updatedOffer_request)
            res.send(result)
        })

        
        /* OFFER_REQUEST END */




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