const router = require('express').Router();
const authenticate = require('../middlewares/auth');
const isAdmin = require('../middlewares/adminAuth');
const Poll = require('../models/poll.model');

// Admin routes
router.post('/create', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, description, options, timer } = req.body;
    const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const poll = new Poll({
      title,
      description,
      options: options.map(opt => ({ text: opt, votes: 0 })),
      sessionCode,
      createdBy: req.user._id,
      timer: timer || null,
      isActive: true
    });

    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin', authenticate, isAdmin, async (req, res) => {
  try {
    const polls = await Poll.find({ createdBy: req.user._id });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User routes
router.post('/join/:sessionCode', authenticate, async (req, res) => {
  try {
    const poll = await Poll.findOne({ 
      sessionCode: req.params.sessionCode,
      isActive: true 
    });
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found or inactive' });
    }
    res.json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/vote', authenticate, async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;
    const poll = await Poll.findById(pollId);
    
    if (!poll || !poll.isActive) {
      return res.status(404).json({ error: 'Poll not found or inactive' });
    }

    poll.options[optionIndex].votes += 1;
    await poll.save();

    req.app.get('io').to(poll.sessionCode).emit('voteUpdate', poll);
    res.json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;