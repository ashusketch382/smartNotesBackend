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
    return response.data[0].summary_text.trim();
  } catch (error) {
    console.error('Hugging Face error:', error.response?.data || error.message);
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
        const tags = response.data[0].generated_text
        .trim()
        .split(',')
        .map((tag) => tag.trim())
        .slice(0, 2);
        return tags.length ? tags : ['tag1', 'tag2'];
    } catch (error) {
        console.error('Hugging Face error:', error.response?.data || error.message);
        return ['error', 'failed'];
    }
};

module.exports = { summarizeText, suggestTags};