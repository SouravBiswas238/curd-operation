const express = require('express')
const app = express()
const port = process.env.PORT || 5000;


const connectionString = process.env.DATABASE_URL;

const corse = require('cors');
require('dotenv').config();

app.use(corse());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vkcbcgk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        await client.connect(connectionString);
        const articleCollection = client.db("Article").collection("Articles");

        // post user information
        app.post('/article', async (req, res) => {
            const newTask = req.body;
            const result = await articleCollection.insertOne(newTask);
            res.send({ success: true, result });
        });

        // get all tasks
        app.get('/article', async (req, res) => {
            const query = {};
            const cursor = articleCollection.find(query);
            articles = await cursor.toArray();
            res.send(articles);
        });

        // delete Single task
        app.delete('/article/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await articleCollection.deleteOne(query);
            res.send(result);
        });

        app.put('/article/:id', async (req, res) => {
            const id = req.params.id;
            const editArticle = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: editArticle,
            };
            const result = await articleCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})