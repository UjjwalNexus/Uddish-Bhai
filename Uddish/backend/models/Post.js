const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  petType: {
    type: String,
    enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'small_mammal', 'other', 'general'],
    default: 'general'
  },
  aiFlags: {
    toxicity: Number,
    spam: Number,
    advice_risk: Number,
    reasoning: String,
    flags: [String]
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'shadow_hidden', 'flagged', 'removed'],
    default: 'pending'
  },
  comments: [{
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    aiFlags: {
      toxicity: Number,
      spam: Number,
      advice_risk: Number,
      reasoning: String,
      flags: [String]
    },
    status: {
      type: String,
      enum: ['pending', 'published', 'shadow_hidden', 'flagged', 'removed'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);