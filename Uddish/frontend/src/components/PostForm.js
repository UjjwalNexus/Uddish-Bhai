import React, { useState } from 'react';
import { createPost } from '../services/api';

const PostForm = () => {
  const [content, setContent] = useState('');
  const [petType, setPetType] = useState('general');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ content, petType });
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
          What's on your mind?
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="content"
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="petType">
          Pet Type
        </label>
        <select
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="petType"
          value={petType}
          onChange={(e) => setPetType(e.target.value)}
        >
          <option value="general">General</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
          <option value="fish">Fish</option>
          <option value="reptile">Reptile</option>
          <option value="small_mammal">Small Mammal</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Post
        </button>
      </div>
    </form>
  );
};

export default PostForm;