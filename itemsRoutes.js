const express = require('express');
const router = express.Router();
const items = require('./fakeDb');

// GET /items - render a list of shopping items
router.get('/', (req, res) => {
    return res.json(items);
});

// POST /items - accept JSON data and add to shopping list
router.post('/', (req, res) => {
    const { name, price } = req.body;
    
    // Basic validation
    if (!name || price === undefined) {
        return res.status(400).json({ error: "Name and price are required" });
    }
    
    const newItem = { name, price: parseFloat(price) };
    items.push(newItem);
    
    return res.status(201).json({ added: newItem });
});

// GET /items/:name - display a single item's name and price
router.get('/:name', (req, res) => {
    const item = items.find(item => item.name === req.params.name);
    
    if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }
    
    return res.json(item);
});

// PATCH /items/:name - modify a single item's name and/or price
router.patch('/:name', (req, res) => {
    const itemIndex = items.findIndex(item => item.name === req.params.name);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found" });
    }
    
    const { name, price } = req.body;
    
    // Update the item with new values
    if (name !== undefined) {
        items[itemIndex].name = name;
    }
    if (price !== undefined) {
        items[itemIndex].price = parseFloat(price);
    }
    
    return res.json({ updated: items[itemIndex] });
});

// DELETE /items/:name - delete a specific item from the array
router.delete('/:name', (req, res) => {
    const itemIndex = items.findIndex(item => item.name === req.params.name);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found" });
    }
    
    items.splice(itemIndex, 1);
    return res.json({ message: "Deleted" });
});

module.exports = router;
