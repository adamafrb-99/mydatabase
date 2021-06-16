if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => {
console.log(error);
});
db.once('open', () => {
console.log("Connected to database");
});

const productRoute = require('./routes/product');

app.use('/api/product', productRoute);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});