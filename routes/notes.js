const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Note = require('../models/Notes');
const summarizeText = require('../utils/summarize');

router.get('/', authMiddleware, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const notes = await Note.find({
            userId: req.user 
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ updatedAt: -1 });
        const total = await Note.countDocuments({
            userId: req.user 
        });
        res.status(200).json({ 
            notes, 
            total, 
            page, 
            pages: Math.ceil(total / limit) 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { title, content, tags } = req.body;
    try {
        if (!content) return res.status(400).json({ message: 'Content is required' })
        const summary = await summarizeText(content);
        if (summary.includes('Failed')) {
            return res.status(429).json({ message: 'Summarization failed', note: null });
        }
        const note = new Note({ 
            userId: req.user, 
            title, 
            content, 
            summary,
            tags 
        });
        await note.save();
        res.status(201).json({
            note
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Missing required fields', details: error.errors });
        }
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.user });
        if (!note) 
            return res.status(404).json({ message: 'Note not found' });
        res.status(200).json({
            note
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid note ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { title, content, tags } = req.body;
    try {
        if (!content) return res.status(400).json({ message: 'Content is required' })
        const summary = await summarizeText(content);
        if (summary.includes('Failed')) {
            return res.status(429).json({ message: 'Summarization failed', note: null });
        }
        const note = await Note.findOneAndUpdate({ 
            _id: req.params.id, 
            userId: req.user 
        },
        { 
            title, 
            content, 
            summary,
            tags, 
            updatedAt: Date.now() 
        },
        { 
            new: true 
        }
    );
    if (!note) 
        return res.status(404).json({ message: 'Note not found' });
    res.status(200).json({
        note
    });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user 
        });
        if (!note) 
            return res.status(404).json({ message: 'Note not found' });
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;