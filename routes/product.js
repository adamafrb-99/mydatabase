const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

// FILE MANAGEMENT
const fs = require('fs');
const uploadConfig = require('../middleware/upload');
const filePath = 'uploads/products';
const upload = uploadConfig(filePath);

// GET DATA
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    }
    catch(err) {
        res.json({message: err.message});
    }
});

// GET SPECIFIC DATA BY ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    }
    catch(err) {
        res.json({message: err.message});
    }
});

// ADD DATA
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.file.filename
        });

        await product.save();
        res.status(201).json(product);
    }
    catch (err) {
        res.json({message: err.message});
    }
});

// EDIT DATA
router.patch('/:id', upload.single('image'), async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        
        if (req.body.name) product.name = req.body.name;
        if (req.body.price) product.price = req.body.price;
        if (req.body.description) product.description = req.body.description;
        if (req.file) {
            fs.unlink(`public/${filePath}/${product.image}`, (err) => {
                if (err) {
                    console.log(err.message);
                }
            });

            product.image = req.file.filename;
        } 

        await product.save();
        res.json(product);
    }
    catch(err) {
        res.json({message: err.message});
    }
});

// DELETE DATA
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        fs.unlink(`public/${filePath}/${product.image}`, (err) => {
            if (err) {
                console.log(err.message);
            }
        });
        
        await product.remove();
        res.json({message: "Data has been deleted."});
    }
    catch(err) {
        res.json({message: err.message});
    }
}); 

module.exports = router;