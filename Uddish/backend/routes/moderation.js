const express = require('express');
const Post = require('../models/Post');
const { checkRole } = require('../middleware/roleCheck');

const router = express.Router();

// Get flagged posts and comments (for moderators and admins)
router.get('/queue', checkRole(['moderator', 'admin']), async (req, res) => {
  try {
    // Find posts that are flagged
    const posts = await Post.find({
      $or: [
        { status: 'flagged' },
        { 'comments.status': 'flagged' }
      ]
    })
      .populate('authorId', 'username')
      .populate('comments.authorId', 'username');

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Make a moderation decision
router.post('/decide', checkRole(['moderator', 'admin']), async (req, res) => {
  const { postId, commentId, decision } = req.body;

  try {
    if (commentId) {
      // Moderate a comment
      const post = await Post.findOne({ _id: postId, 'comments._id': commentId });
      const comment = post.comments.id(commentId);
      comment.status = decision;
      await post.save();
    } else {
      // Moderate a post
      const post = await Post.findById(postId);
      post.status = decision;
      await post.save();
    }

    res.json({ msg: 'Decision applied' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;