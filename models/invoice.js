const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URI;

mongoose.set('strictQuery', false);
mongoose.set('debug', true);

const connect = async () => {
    try {
        await mongoose.connect(url)
        console.log("Connected to MongoDB")
    } catch (err) {
        console.log("There was an error connecting to the database.", err)
    }
}

connect();

const invoiceSchema = new mongoose.Schema({
    id: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: Date,
    billing: {
        name: String,
        address: String,
        email: String,
        number: String
    },
    billTo: {
        address: String,
        email: String,
        number: String
    },
    client: String,
    description: String,
    amount: Number,
    status: String,
    tax: Number,
    items: [
        {
            id: Number,
            name: String,
            quantity: Number,
            price: Number,
            total: Number
        }
    ]
});

invoiceSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Invoice', invoiceSchema);