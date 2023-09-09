const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:4200', // Update the allowed origin
}));

const uri = "mongodb+srv://ajithaj:Ajithaj001@cluster0.13t6iqx.mongodb.net/?retryWrites=true&w=majority";
const dbName = "portfolio";
const collectionName = "portfoliocollection";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Terminate the application on database connection error
    }
}

// Middleware to handle connecting to the database before handling requests
app.use((req, res, next) => {
    req.db = client.db(dbName);
    next();
});

// GET method to retrieve data from the collection
app.get('/data/portfolio', async(req, res) => {
    const collection = req.db.collection(collectionName);

    try {
        const query = {}; // You can specify a query here if needed
        const documents = await collection.find(query).toArray();
        res.json(documents);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
});

// POST method to insert data into the collection
app.post('/data/portfolio', async(req, res) => {
    const collection = req.db.collection(collectionName);

    try {
        const dataToInsert = req.body; // Assuming you send JSON data in the request body
        const result = await collection.insertOne(dataToInsert);
        res.status(201).json({ message: "Data inserted successfully", insertedId: result.insertedId });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "An error occurred while inserting data" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Connect to the database when the server starts
connectToDatabase();