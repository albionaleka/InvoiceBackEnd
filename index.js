const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const Invoice = require('./models/invoice');
app.use(express.json());

app.use(cors());
// app.use(express.static('dist'));

const userRouter = require('./api/User');

app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.get('/api/invoices', async (req, res) => {
    await Invoice.find({}).then(invoices => {
        res.json(invoices.map(invoice => invoice.toJSON()));
    }).catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving invoices');
    });
});

app.get('/api/invoices/:id', async (req, res) => {
    const id = req.params.id;
    await Invoice.findById(id).then(invoice => {
        if (invoice) {
            res.json(invoice.toJSON());
        } else {
            res.status(404).send('Invoice not found');
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving invoice');
    });
});

app.delete('/api/invoices/:id', (request, response, next) => {
    Invoice.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end();
    }).catch (error => next(error));
});

app.post('/api/invoices', async (req, res) => {
    const invoice = new Invoice(req.body);
    await invoice.save().then(savedInvoice => {
        res.status(201).json(savedInvoice.toJSON());
    }).catch(err => {
        console.error(err);
        res.status(400).send('Error saving invoice');
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}. http://localhost:${PORT}`);
});