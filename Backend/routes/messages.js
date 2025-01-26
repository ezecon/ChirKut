const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../Cloudinary.js');
const Items = require('../models/messages.js');

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new product
router.post('/',  async (req, res) => {
    const { receiver, message, sender } = req.body;

    try {
        const item = new Items({
            receiver, message, sender
        });
        const newItem = await item.save();
        res.status(200).json({ message: "Message sent", newItem });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const items = await Items.find();
        res.status(200).json({ success: true, data: items });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await Items.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.status(200).json({ success: true, data: item });
    } catch (err) {
        console.error(err); // More descriptive logging
        res.status(500).json({ success: false, message: "Server Error" });
    }
});




module.exports = router;
