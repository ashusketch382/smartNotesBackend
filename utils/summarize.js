// utils/summarize.js
const axios = require('axios');
require('dotenv').config();

const summarizeText = async (text) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: text, parameters: { max_length: 100, min_length: 50 } },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
    );
    // Check if response.data is an array and has summary_text
    if (Array.isArray(response.data) && response.data[0]?.summary_text) {
      return response.data[0].summary_text.trim();
    }
    // console.error('Unexpected response format:', response.data);
    return 'Failed to summarize text.';
  } catch (error) {
    console.error('Hugging Face error:', error.response?.data?.error || error.message);
    return 'Failed to summarize text.';
  }
};

const suggestTags = async (text) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large',
      {
        inputs: `Suggest 2 tags for the following text: ${text}`,
        parameters: { max_length: 20, min_length: 5 },
      },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
    );
    // Check if response.data is an array and has generated_text
    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      const tags = response.data[0].generated_text
        .trim()
        .split(',')
        .map((tag) => tag.trim())
        .slice(0, 2);
      return tags.length ? tags : ['tag1', 'tag2'];
    }
    console.error('Unexpected response format:', response.data);
    return ['tag1', 'tag2'];
  } catch (error) {
    console.error('Hugging Face error:', error.response?.data?.error || error.message);
    return ['tag1', 'tag2'];
  }
};

module.exports = { summarizeText, suggestTags };