const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

// GET DATA
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    }
    catch(err) {
        console.log(err.message);
    }
});

// ADD DATA
router.post('/', async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description
        });

        await product.save();
        res.status(201).json(product);
    }
    catch (err) {
        console.log(err.message);
    }
});

// EDIT DATA
router.patch('/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        
        if (req.body.name) {
            product.name = req.body.name;
        }
        if (req.body.price) {
            product.price = req.body.price;
        }
        if (req.body.description) {
            product.description = req.body.description;
        }

        await product.save();

        res.json(product);
    }
    catch(err) {
        console.log(err.message);
    }
});

// DELETE DATA
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        await product.remove();
        res.json({message: "Data has been deleted."});
    }
    catch(err) {
        console.log(err.message);
    }
}); 

module.exports = router;