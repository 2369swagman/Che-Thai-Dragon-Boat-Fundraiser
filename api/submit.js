const { MongoClient } = require('mongodb');

// Cache the database connection
let cachedDb = null;

async function connectToDatabase(uri) {
    if (cachedDb) {
        return cachedDb;
    }
    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db('Fundraisers');
    cachedDb = db;
    return db;
}

module.exports = async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const data = req.body;

        // Basic validation
        if (!data.fullName || !data.email || !data.netId || !data.quantity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Connect to MongoDB
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        const db = await connectToDatabase(uri);
        const collection = db.collection('CheThaiOrders');

        // Insert the order
        const result = await collection.insertOne({
            ...data,
            createdAt: new Date()
        });

        return res.status(200).json({ 
            success: true, 
            message: 'Order submitted successfully',
            orderId: result.insertedId 
        });

    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
