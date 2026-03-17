const express = require("express");
const router = express.Router();
const Choreography = require("../models/Choreography");

// Create a new choreography
router.post('/', async (req, res) => {
    try {
        const newChoreo = new Choreography({
            title: req.body.title,
            videoUrl: req.body.videoUrl,
            style: req.body.style,
            difficulty: req.body.difficulty,
            status: req.body.status,
            notes: req.body.notes
        });
        
        const savedChoreo = await newChoreo.save();
        
        res.status(201).json(savedChoreo);
        
    }
    catch (error) {
        res.status(500).json({message: error.message });
    }
});

// Get all choreographies
router.get('/', async (req, res) => {
    try {
        const choreos = await Choreography.find().sort({ createdAt: -1 });
        res.json(choreos);
    }
    catch (error) {
        res.status(500).json({message: error.message });
    }
});

// Get a specific choreography by ID
router.get('/:id', async (req, res) => {
    try {
        const choreo = await Choreography.findById(req.params.id);
        if (!choreo) {
            return res.status(404).json({ message: 'Choreography not found' });
        }
        res.json(choreo);
    }
    catch (error) {
        res.status(500).json({message: error.message });
    }
});

// Update a choreography by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedChoreo = await Choreography.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedChoreo) {
            return res.status(404).json({ message: 'Choreography not found' });
        }
        res.json(updatedChoreo);
    }
    catch (error) {
        res.status(500).json({message: error.message });
    }
});

// Delete a choreography by ID
router.delete('/:id', async (req, res) => {
    try {
        const deleteChoreo = await Choreography.findByIdAndDelete(req.params.id);
        if (!deleteChoreo) {
            return res.status(404).json({ message: 'Choreography not found' });
        }
        res.json({message: 'Choreography deleted successfully' });
    }
    catch (error) {
        res.status(500).json({message: error.message });
    }
});

module.exports = router;

