const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Note = require('../models/Notes');
const { summarizeText, suggestTags } = require('../utils/summarize');
const { convertToRaw, convertFromRaw, ContentState } = require('draft-js');
const { stateToHTML } = require('draft-js-export-html');

router.post('/', authMiddleware, async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    if (!content) return res.status(400).json({ message: 'Content is required' });
    const summary = await summarizeText(content);
    const suggestedTags = await suggestTags(content);
    if (summary.includes('Failed')) {
      return res.status(429).json({ message: 'Summarization failed', note: null });
    }
    const contentState = convertFromRaw(JSON.parse(content));
    const htmlContent = stateToHTML(contentState);
    const note = new Note({
      userId: req.user,
      title,
      content: htmlContent,
      summary,
      tags: tags.length ? tags : suggestedTags,
    });
    await note.save();
    res.status(201).json({
      note,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Missing required fields', details: error.errors });
    }
    res.status(500).json({
      message: 'Server error',
    });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    if (!content) return res.status(400).json({ message: 'Content is required' });
    const summary = await summarizeText(content);
    const suggestedTags = await suggestTags(content);
    if (summary.includes('Failed')) {
      return res.status(429).json({ message: 'Summarization failed', note: null });
    }
    const contentState = convertFromRaw(JSON.parse(content));
    const htmlContent = stateToHTML(contentState);
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      {
        title,
        content: htmlContent,
        summary,
        tags: tags.length ? tags : suggestedTags,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json({
      note,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
