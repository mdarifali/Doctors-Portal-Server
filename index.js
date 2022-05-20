const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors');
require ('dotenv').config();
const app = express()
const port = process.env.Port || 5000;


app.use(cors());
app.use(express.json())

// Mongodb Connection //

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@cluster0.eosns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        await client.connect();
        const serviceCollection = client.db('doctors-portal').collection('services');
        const bookingCollection = client.db('doctors-portal').collection('booking');

        app.get('/service', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const query = {treatment: booking.treatment, date: booking.date, patient: booking.patient}
            const exixts = await bookingCollection.findOne(query);
            if (exixts) {
                return res.send({success: false, booking: exixts});
            }
            const result = await bookingCollection.insertOne(booking);
            return res.send({success: true, result});
        })

    }
    finally{
        console.log('MongoDB Connected');
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello Doctors Portal Server')
})

app.listen(port, () => {
    console.log(`Doctors Portal app listening on port ${port}`)
})