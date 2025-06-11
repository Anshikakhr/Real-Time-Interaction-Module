const Poll = require('../models/poll.model');

// Generate random session code
const generateSessionCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const pollController = {
  createPoll: async (req, res) => {
    try {
      const { title, description, options, timer } = req.body;
      const sessionCode = generateSessionCode();
      
      const poll = new Poll({
        title,
        description,
        options: options.map(opt => ({ text: opt })),
        sessionCode,
        createdBy: req.user._id,
        timer: timer || null
      });

      if (timer) {
        poll.endTime = new Date(Date.now() + timer * 60000);
      }

      await poll.save();
      res.status(201).json(poll);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAdminPolls: async (req, res) => {
    try {
      const polls = await Poll.find({ createdBy: req.user._id });
      res.json(polls);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllPolls: async (req, res) => {
    try {
      const polls = await Poll.find({ isActive: true });
      res.json(polls);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPollById: async (req, res) => {
    try {
      const poll = await Poll.findById(req.params.pollId);
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }
      res.json(poll);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  joinPoll: async (req, res) => {
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
  },

  submitVote: async (req, res) => {
    try {
      const { pollId, optionIndex } = req.body;
      const poll = await Poll.findById(pollId);
      
      if (!poll || !poll.isActive) {
        return res.status(404).json({ error: 'Poll not found or inactive' });
      }

      poll.options[optionIndex].votes += 1;
      await poll.save();

      // Emit socket event for real-time updates
      req.app.get('io').to(poll.sessionCode).emit('voteUpdate', poll);
      
      res.json(poll);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  endPoll: async (req, res) => {
    try {
      const poll = await Poll.findOneAndUpdate(
        { _id: req.params.pollId, createdBy: req.user._id },
        { isActive: false },
        { new: true }
      );

      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }

      // Emit socket event to notify poll ended
      req.app.get('io').to(poll.sessionCode).emit('pollEnded', poll._id);
      
      res.json(poll);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = pollController;