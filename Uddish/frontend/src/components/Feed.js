import React, { useState, useEffect } from 'react';
import Post from './Post';
import PostForm from './PostForm';
import { getPosts } from '../services/api';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
    
    socket.on('postAdded', (newPost) => {
      setPosts(prevPosts => [newPost, ...prevPosts]);
    });

    return () => {
      socket.off('postAdded');
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div>
      <PostForm />
      <div className="mt-8">
        {posts.map(post => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;