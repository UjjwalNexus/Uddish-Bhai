const express = require('express');
const Post = require('../models/Post');
const { checkRole } = require('../middleware/roleCheck');
const axios = require('axios');

const router = express.Router();

// Create a post
router.post('/', async (req, res) => {
  const { content, petType } = req.body;
  const authorId = req.user.id;

  try {
    // Call AI moderation service
    const aiResponse = await axios.post('http://localhost:8000/moderate', {
      content,
      pet_type: petType
    });

    const aiFlags = aiResponse.data;

    // Determine status based on AI scores
    let status = 'pending';
    if (aiFlags.toxicity > 0.8 || aiFlags.spam > 0.8) {
      status = 'shadow_hidden';
    } else if (aiFlags.advice_risk > 0.7) {
      status = 'flagged';
    } else {
      status = 'published';
    }

    const post = new Post({
      authorId,
      content,
      petType,
      aiFlags,
      status
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all published posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('authorId', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a comment
router.post('/:id/comments', async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;
  const authorId = req.user.id;

  try {
    // Call AI moderation for the comment
    const aiResponse = await axios.post('http://localhost:8000/moderate', {
      content,
      pet_type: 'general'
    });

    const aiFlags = aiResponse.data;

    let status = 'pending';
    if (aiFlags.toxicity > 0.8 || aiFlags.spam > 0.8) {
      status = 'shadow_hidden';
    } else if (aiFlags.advice_risk > 0.7) {
      status = 'flagged';
    } else {
      status = 'published';
    }

    const comment = {
      authorId,
      content,
      aiFlags,
      status
    };

    const post = await Post.findById(postId);
    post.comments.push(comment);
    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;