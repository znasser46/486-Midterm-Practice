import 'dotenv/config'; 
import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';




const app = express();
const uri = process.env.MONGO_URI; 



app.use(express.json());
app.use(express.static('public'));

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function connectToMongo() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
connectToMongo();


app.get('/', (req, res) => {
})


app.post('/api/names', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (name == null) {
      return res.status(400).json({ error: 'Missing required field' });
    }

    const db = client.db('cis486');
    const collection = db.collection('zacharyNames');
    
    const nameRecord = {
      name,
      timestamp: new Date()
    };

    const result = await collection.insertOne(nameRecord);
    res.json({ message: 'name recorded!', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record name' });
  }
});


app.get('/api/names', async (req, res) => {
  try {
    const db = client.db('cis486');
    const collection = db.collection('zacharyNames');
    
    const names = await collection.find({}).toArray();
    res.json(names);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get name records' });
  }
});


app.put('/api/names/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const db = client.db('cis486');
    const collection = db.collection('zacharyNames');
    
    //Updates the collection with the revised information 
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name,
      updatedAt: new Date() } }
    );
    
    //Sends error if there are no records that match
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'name record not found' });
    }
    
    res.json({ message: 'Name updated!' });
  } catch (error) {
    //console.error('Error updating budget:', error);
    res.status(500).json({ error: 'Failed to update name' });
  }
});

app.delete('/api/names/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = client.db('cis486');
    const collection = db.collection('zacharyNames');
    
    //deletes the record based on the id
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    //sends error if there are no matching budgets
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'name not found' });
    }
    
    res.json({ message: 'name deleted!' });
  } catch (error) {
    //console.error('Error deleting budget:', error);
    res.status(500).json({ error: 'Failed to delete name' });
  }
});

//starts the server. 
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})